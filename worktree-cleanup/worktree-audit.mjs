#!/usr/bin/env node
// Audit git worktrees and sort each into a verdict; with --apply, remove only the ones
// that cannot lose work. Dependency-free Node 18+.
//
//   node worktree-audit.mjs                 report only
//   node worktree-audit.mjs --fetch         fetch first, so "on <base>" is judged against fresh remotes
//   node worktree-audit.mjs --fetch --apply report, remove the Safe set, report again
//   node worktree-audit.mjs --json
//
// Options (CLI flags override DEFAULTS below):
//   --repo <dir>    a repo whose worktrees to audit; repeatable. Default: the repo you are in.
//   --root <dir>    a folder that holds worktrees. When set, every directory directly under it
//                   is audited, including plain folders and standalone clones. When not set,
//                   every linked worktree `git worktree list` reports is audited.
//   --keep <regex>  worktree folder names or branches that are always kept; repeatable.
//   --base <ref>    the branch work must be on to count as safe. Default: origin/HEAD,
//                   falling back to origin/main.

import { spawn } from 'node:child_process';
import { readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---- Configure for your repo, or pass flags -------------------------------------------
export const DEFAULTS = {
  repos: [],    // e.g. ['.', 'services/api', 'services/web']; empty = the current repo
  root: null,   // e.g. '../myrepo.worktrees'; null = whatever `git worktree list` reports
  keep: [],     // e.g. ['-dev$'] for long-lived worktrees that are never cleaned up
  base: null,   // e.g. 'origin/main'; null = origin/HEAD, then origin/main
};
// ----------------------------------------------------------------------------------------

// A worktree whose only dirt is a touched lockfile still counts as clean (removed with --force).
const LOCKFILES = new Set(['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml', 'bun.lockb', 'uv.lock', 'poetry.lock', 'Cargo.lock', 'Gemfile.lock', 'composer.lock']);

export async function auditWorktrees(cwd = process.cwd(), options = {}) {
  const opts = { ...DEFAULTS, ...options };
  const runGit = opts.runGit ?? defaultRunGit;
  const keep = (opts.keep ?? []).map((source) => new RegExp(source));
  let repos = (opts.repos ?? []).map((repo) => path.resolve(cwd, repo));
  if (!repos.length) {
    const top = await run(cwd, ['rev-parse', '--show-toplevel'], runGit);
    if (top.code !== 0) throw new Error('not inside a git repo; pass --repo');
    repos = [path.resolve(top.stdout.trim())];
  }
  const rootDir = opts.root ? path.resolve(cwd, opts.root) : null;

  const registrations = [];
  const prunable = [];
  const fetched = [];
  const bases = new Map();
  for (const repoPath of repos) {
    if (opts.fetch) {
      const result = await run(repoPath, ['fetch', '--prune', '--quiet'], runGit);
      fetched.push({ repo: path.basename(repoPath), ok: result.code === 0 });
    }
    bases.set(repoPath, opts.base ?? await resolveBase(repoPath, runGit));
    const list = await run(repoPath, ['worktree', 'list', '--porcelain'], runGit);
    if (list.code !== 0) continue;
    parseWorktreeList(list.stdout).forEach((entry, index) => {
      // The first entry is the main worktree: never a cleanup candidate.
      const record = { ...entry, main: index === 0, repo: path.basename(repoPath), repoPath };
      if (entry.prunable) prunable.push(record);
      else registrations.push(record);
    });
  }

  const candidates = rootDir
    ? await listDirectories(rootDir)
    : registrations.filter((entry) => !entry.main).map((entry) => entry.path);

  const worktrees = [];
  for (const dirPath of candidates) {
    const registration = registrations.find((entry) => samePath(entry.path, dirPath));
    const info = await inspectWorktree(dirPath, registration, bases, runGit);
    info.current = isInside(cwd, dirPath);
    worktrees.push({ ...info, ...classifyWorktree(info, keep) });
  }

  return { cwd, rootDir, repos, fetched, worktrees, prunable };
}

export function classifyWorktree(info, keep = []) {
  if (!info.registered && !info.standalone) {
    return { verdict: 'folder', reasons: ['not a git worktree, plain folder'] };
  }
  if (info.main) return { verdict: 'keep', reasons: ['main worktree of its repo'] };
  if (keep.some((re) => re.test(info.name) || (info.branch && re.test(info.branch)))) {
    const reasons = [];
    if (info.dirtyFiles.length) reasons.push(`${info.dirtyFiles.length} uncommitted file(s)`);
    return { verdict: 'pinned', reasons };
  }
  if (info.standalone) {
    return { verdict: 'keep', reasons: ['standalone clone, not a worktree of any audited repo; review by hand'] };
  }

  const blockers = [];
  const notes = [];
  if (info.current) blockers.push('this session is running inside it');
  if (info.locked) blockers.push('locked with `git worktree lock`');
  const realDirt = info.dirtyFiles.filter((file) => !LOCKFILES.has(path.basename(file)));
  if (realDirt.length) blockers.push(`${realDirt.length} uncommitted file(s)`);
  else if (info.dirtyFiles.length) notes.push('lockfile only, needs --force');
  if (info.detached) blockers.push('detached HEAD');
  else if (!info.upstream) blockers.push('branch never pushed');
  else if (info.unpushed > 0) blockers.push(`${info.unpushed} unpushed commit(s)`);
  if (info.aheadOfBase === null) blockers.push(`cannot compare with ${info.base}`);
  else if (info.aheadOfBase > 0) blockers.push(`${info.aheadOfBase} commit(s) not on ${info.base}`);

  if (blockers.length) return { verdict: 'keep', reasons: blockers };
  return { verdict: 'safe', reasons: [`on ${info.base}, nothing unpushed`, ...notes] };
}

// The cleanup as data, so the printed Commands block and --apply cannot drift apart.
export function planCleanup(report) {
  const rel = (target) => relativePath(report.cwd, target);
  const safe = report.worktrees.filter((entry) => entry.verdict === 'safe');
  const steps = [];
  for (const entry of safe) {
    const force = entry.dirtyFiles.length ? ['--force'] : [];
    steps.push({
      kind: 'remove',
      cwd: entry.repoPath,
      args: ['worktree', 'remove', ...force, entry.path],
      display: `git -C ${rel(entry.repoPath)} worktree remove${force.length ? ' --force' : ''} ${rel(entry.path)}`,
    });
  }
  for (const entry of report.worktrees.filter((item) => item.verdict === 'folder')) {
    steps.push({ kind: 'folder', path: entry.path, display: `rm -rf ${rel(entry.path)}` });
  }
  for (const repoPath of [...new Set(report.prunable.map((entry) => entry.repoPath))]) {
    steps.push({ kind: 'prune', cwd: repoPath, args: ['worktree', 'prune'], display: `git -C ${rel(repoPath)} worktree prune` });
  }
  // `branch -d` refuses an unmerged branch, so a failure here is a branch to look at, not to force.
  for (const entry of safe.filter((item) => !item.detached && item.branch)) {
    steps.push({ kind: 'branch', cwd: entry.repoPath, args: ['branch', '-d', entry.branch], display: `git -C ${rel(entry.repoPath)} branch -d ${entry.branch}` });
  }
  return steps;
}

// Runs exactly what planCleanup lists, nothing more.
export async function applyCleanup(report, options = {}) {
  const runGit = options.runGit ?? defaultRunGit;
  const removeDir = options.removeDir ?? ((target) => rm(target, { recursive: true, force: true }));
  const results = [];
  for (const step of planCleanup(report)) {
    if (step.kind === 'folder') {
      try {
        await removeDir(step.path);
        results.push({ ...step, ok: true });
      } catch (error) {
        results.push({ ...step, ok: false, error: error.message });
      }
      continue;
    }
    const result = await run(step.cwd, step.args, runGit);
    results.push({ ...step, ok: result.code === 0, error: result.code === 0 ? undefined : result.stderr.trim() });
  }
  return results;
}

export function formatAudit(report) {
  const rel = (target) => relativePath(report.cwd, target);
  const by = (verdict) => report.worktrees.filter((entry) => entry.verdict === verdict);
  const describe = (entry) => {
    const branch = entry.detached ? 'detached' : entry.branch;
    const where = entry.registered ? ` (${entry.repo}, ${branch})` : '';
    return `- ${entry.name}${where}: ${entry.reasons.join(', ') || 'ok'}`;
  };
  const list = (items, fn = describe) => (items.length ? items.map(fn).join('\n') : '- none');
  const plan = planCleanup(report);
  const main = plan.filter((step) => step.kind !== 'branch');
  const branches = plan.filter((step) => step.kind === 'branch');
  const out = [
    'Worktree audit',
    `Scope: ${report.rootDir ? rel(report.rootDir) : 'git worktree list'} (${report.repos.map(rel).join(', ')})`,
    `Fetched: ${report.fetched.length ? report.fetched.map((f) => `${f.repo}${f.ok ? '' : ' (failed)'}`).join(', ') : 'no (pass --fetch to compare against fresh remotes)'}`,
    `Worktrees: ${report.worktrees.length}, safe ${by('safe').length}, keep ${by('keep').length}, pinned ${by('pinned').length}, plain folders ${by('folder').length}, prunable ${report.prunable.length}`,
    '', '## Safe to delete', list(by('safe')),
    '', '## Keep', list(by('keep')),
    '', '## Pinned (always kept)', list(by('pinned')),
    '', '## Plain folders', list(by('folder')),
    '', '## Prunable registrations', list(report.prunable, (entry) => `- ${entry.repo}: ${rel(entry.path)}`),
    '', '## Commands', main.length ? main.map((step) => step.display).join('\n') : '- nothing to do',
  ];
  if (branches.length) out.push('', '## Then drop the local branches (--apply runs these too)', branches.map((step) => step.display).join('\n'));
  return out.join('\n');
}

export function parseWorktreeList(output) {
  const entries = [];
  let current = null;
  for (const raw of output.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      if (current) entries.push(current);
      current = null;
      continue;
    }
    const [key, ...rest] = line.split(' ');
    const value = rest.join(' ');
    if (key === 'worktree') current = { path: value, head: null, branch: null, detached: false, prunable: false, locked: false };
    else if (!current) continue;
    else if (key === 'HEAD') current.head = value;
    else if (key === 'branch') current.branch = value.replace(/^refs\/heads\//, '');
    else if (key === 'detached') current.detached = true;
    else if (key === 'prunable') current.prunable = true;
    else if (key === 'locked') current.locked = true;
  }
  if (current) entries.push(current);
  return entries;
}

async function resolveBase(repoPath, runGit) {
  const head = await run(repoPath, ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], runGit);
  return head.code === 0 && head.stdout.trim() ? head.stdout.trim() : 'origin/main';
}

async function inspectWorktree(dirPath, registration, bases, runGit) {
  const info = {
    name: path.basename(dirPath),
    path: dirPath,
    registered: Boolean(registration),
    standalone: false,
    main: registration?.main ?? false,
    locked: registration?.locked ?? false,
    repo: registration?.repo ?? null,
    repoPath: registration?.repoPath ?? null,
    branch: registration?.branch ?? null,
    detached: registration?.detached ?? false,
    base: registration ? bases.get(registration.repoPath) : 'origin/main',
    upstream: null,
    unpushed: 0,
    aheadOfBase: null,
    dirtyFiles: [],
  };
  if (!registration) {
    const gitDir = await maybeStat(path.join(dirPath, '.git'));
    if (!gitDir) return info;
    // A .git directory is an independent clone; a .git file is a worktree of a repo we were not told about.
    info.standalone = true;
    const head = await run(dirPath, ['rev-parse', '--abbrev-ref', 'HEAD'], runGit);
    info.branch = head.code === 0 ? head.stdout.trim() : null;
    info.detached = info.branch === 'HEAD';
    if (info.detached) info.branch = null;
  }

  const status = await run(dirPath, ['status', '--porcelain'], runGit);
  info.dirtyFiles = status.stdout.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).trim());

  const upstream = await run(dirPath, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], runGit);
  if (upstream.code === 0 && upstream.stdout.trim()) {
    info.upstream = upstream.stdout.trim();
    const unpushed = await run(dirPath, ['rev-list', '--count', '@{u}..HEAD'], runGit);
    info.unpushed = unpushed.code === 0 ? Number.parseInt(unpushed.stdout, 10) || 0 : 0;
  }

  const ahead = await run(dirPath, ['rev-list', '--count', `${info.base}..HEAD`], runGit);
  info.aheadOfBase = ahead.code === 0 ? Number.parseInt(ahead.stdout, 10) || 0 : null;
  return info;
}

async function listDirectories(targetPath) {
  const targetStat = await maybeStat(targetPath);
  if (!targetStat?.isDirectory()) return [];
  const entries = await readdir(targetPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== '.git')
    .map((entry) => path.join(targetPath, entry.name))
    .sort();
}

async function maybeStat(targetPath) {
  try {
    return await stat(targetPath);
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

const normalize = (value) => path.resolve(value).replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
function samePath(a, b) {
  return normalize(a) === normalize(b);
}
function isInside(child, parent) {
  const c = normalize(child);
  const p = normalize(parent);
  return c === p || c.startsWith(`${p}/`);
}

async function run(cwd, args, runGit) {
  try {
    const result = await runGit(cwd, args);
    if (typeof result === 'string') return { code: 0, stdout: result, stderr: '' };
    return { code: result.code ?? 0, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
  } catch (error) {
    return { code: error.code ?? 1, stdout: error.stdout ?? '', stderr: error.stderr ?? error.message };
  }
}

function defaultRunGit(cwd, args) {
  return new Promise((resolve) => {
    const child = spawn('git', args, { cwd, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => resolve({ code: 1, stdout, stderr: error.message }));
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

function relativePath(from, target) {
  const relative = path.relative(from, target);
  return (relative || '.').replace(/\\/g, '/');
}

function parseArgs(argv) {
  const options = { fetch: false, json: false, apply: false };
  const multi = (key, value) => { options[key] = [...(options[key] ?? []), value]; };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (value === undefined) throw new Error(`${arg} needs a value`);
      return value;
    };
    if (arg === '--fetch') options.fetch = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--apply') options.apply = true;
    else if (arg === '--root') options.root = next();
    else if (arg === '--base') options.base = next();
    else if (arg === '--repo') multi('repos', next());
    else if (arg === '--keep') multi('keep', next());
    else if (arg === '--') continue;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = await auditWorktrees(process.cwd(), options);
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(formatAudit(report));
  if (!options.apply) return;
  const results = await applyCleanup(report);
  console.log('');
  console.log(results.length ? 'Applied' : 'Applied: nothing to do');
  for (const step of results) console.log(`${step.ok ? 'ok  ' : 'FAIL'} ${step.display}${step.error ? ` (${step.error})` : ''}`);
  const after = await auditWorktrees(process.cwd(), { ...options, fetch: false });
  const count = (verdict) => after.worktrees.filter((entry) => entry.verdict === verdict).length;
  console.log(`After: ${after.worktrees.length} worktrees, ${count('safe')} safe, ${count('keep')} keep, ${count('pinned')} pinned, ${count('folder')} plain folder(s), ${after.prunable.length} prunable`);
  if (results.some((step) => !step.ok)) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`[worktree-audit] ${error.message}`);
    process.exitCode = 1;
  });
}
