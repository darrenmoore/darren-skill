#!/usr/bin/env node
// Claude Code Stop hook: once per session, after the session has done real work, hand
// the agent an /improve triage before it goes idle.
//
// Deliberately a TRIAGE, not a mandatory round. /improve's own rule is "no failure, no
// rule": most work teaches nothing, and forcing a full round each time pushes the agent
// to invent rules and grows docs that are meant to shrink. "Nothing worth writing down"
// is the expected answer and ends the turn in one line.
//
// Real work is either:
//   - a `git commit` this session made whose subject is not one of SKIP_TYPES, or
//   - a production action matching PRODUCTION (merges, deploys, live writes), because
//     some work changes the world without making a commit.
//
// Guards, each for a way this loops or misfires:
//   - stop_hook_active: never fire on the turn the hook itself caused
//   - once per session (state file in the OS temp dir), so the chore commit the triage
//     produces can't re-arm it, and neither can later commits
//   - skipped when /improve already ran this session
//   - SKIP_TYPES commits never count, so an instructions-only session is never nudged
//   - only this session's own tool calls count, read from its transcript
//   - with VERIFY_COMMITS, a commit counts only if its subject is in `git log` since the
//     session started AND inside one of this transcript's `git commit` commands. The log
//     proves it landed (a commit blocked by a hook doesn't count); the transcript proves
//     it was ours (parallel sessions on one branch would otherwise be credited to us).
//     Commits run as `cd other && git commit` can't be traced and are not counted.
//
// Dependency-free Node 18+. Wire it up with settings.example.json.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// ---- Configure for your repo -------------------------------------------------------

// Conventional Commit types that never count: the triage's own follow-up commits.
const SKIP_TYPES = ['chore', 'agents'];

// Commands that change something outside the repo. Matched against each Bash command
// this session ran. Add your own deploy scripts, data writes and send commands.
const PRODUCTION = [
  /\bgh\s+pr\s+merge\b/,
  /\bnpm\s+run\s+(deploy|release)\b/,
  /\b(terraform|tofu)\s+apply\b/,
  /\bkubectl\s+(apply|rollout|delete)\b/,
  /\b(fly|vercel|netlify)\s+deploy\b|\bvercel\s+--prod\b/,
];

// Confirm commits against `git log` (see the guards above). Set false to trust the
// transcript alone.
const VERIFY_COMMITS = true;

// The skill this hook nudges toward.
const SKILL = 'improve';

// -------------------------------------------------------------------------------------

// A command at the start of a statement, not inside a grep pattern or a string.
const START = String.raw`(^|[;&|(]\s*|\n\s*)`;
const GIT_COMMIT = new RegExp(`${START}git(\\s+-C\\s+\\S+)?\\s+commit\\b`);
const SKIP_RE = `(${SKIP_TYPES.join('|')})(\\([^)]*\\))?!?:`;
const SKIP_MSG = new RegExp(String.raw`-m\s+["'$(]*\s*(cat\s+<<-?'?\w+'?\s*)?\s*` + SKIP_RE, 'i');
const SKIP_SUBJECT = new RegExp(`^${SKIP_RE}`, 'i');
const IMPROVE_CMD = `<command-name>/${SKILL}</command-name>`;

export function classify(command) {
  if (typeof command !== 'string') return null;
  if (GIT_COMMIT.test(command)) return SKIP_MSG.test(command) ? null : 'commit';
  return PRODUCTION.some((re) => re.test(command)) ? 'production' : null;
}

export function scanTranscript(text) {
  const out = { startedAt: null, improveRan: false, commits: [], production: [] };
  for (const line of text.split('\n')) {
    if (!line) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    if (!out.startedAt && entry.timestamp) out.startedAt = entry.timestamp;
    const content = entry.message?.content;
    if (typeof content === 'string' && content.includes(IMPROVE_CMD)) out.improveRan = true;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (block.type === 'text' && block.text?.includes(IMPROVE_CMD)) out.improveRan = true;
      if (block.type !== 'tool_use') continue;
      if (block.name === 'Skill' && block.input?.skill === SKILL) out.improveRan = true;
      const cmd = block.input?.command;
      const kind = classify(cmd);
      if (kind === 'commit') out.commits.push(cmd);
      if (kind === 'production') out.production.push(cmd);
    }
  }
  return out;
}

function git(cwd, args) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function repoOf(command, cwd) {
  const m = command.match(/git\s+-C\s+("([^"]+)"|'([^']+)'|(\S+))/);
  return m ? resolve(cwd, m[2] || m[3] || m[4]) : cwd;
}

/** Subjects of commits that landed since the session started and came from this transcript. */
export function verifiedCommits(commands, startedAt, cwd) {
  if (!startedAt) return [];
  const found = [];
  for (const repo of new Set(commands.map((cmd) => repoOf(cmd, cwd)))) {
    const subjects = git(repo, ['log', `--since=${startedAt}`, '--format=%s', 'HEAD'])
      .split('\n')
      .filter((s) => s && !SKIP_SUBJECT.test(s))
      .filter((s) => commands.some((cmd) => cmd.includes(s)));
    found.push(...subjects);
  }
  return found;
}

export const REASON = [
  `This session did real work. Before stopping, run /${SKILL} Steps 1-3 only as a triage:`,
  'list what went wrong THIS session (the user\'s corrections, wrong numbers or claims,',
  'invented facts, skipped steps, and mistakes you caught yourself), check the skills and',
  'runbooks you followed against what has shipped since they last changed, and sort each',
  'item into already-a-rule / real gap / once-off.',
  '',
  '- No real gap: say "Improve triage: nothing worth writing down" plus one line why, and stop.',
  `- A real gap or a stale rule: finish /${SKILL} (write it short, compact, prove it), then`,
  '  commit it on its own with /chore. Never fold it into feature work, don\'t push, and',
  '  leave any file another session is editing alone.',
  '',
  'This runs once per session.',
].join('\n');

function main() {
  let input = {};
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* no input */ }
  if (input.stop_hook_active) return;

  const dir = join(tmpdir(), 'claude-improve-nudge');
  mkdirSync(dir, { recursive: true });
  const statefile = join(dir, `${String(input.session_id || 'no-session').replace(/[^a-zA-Z0-9_-]/g, '')}.json`);
  if (existsSync(statefile)) return;

  const path = input.transcript_path;
  if (!path || !existsSync(path)) return;
  const scan = scanTranscript(readFileSync(path, 'utf8'));
  if (scan.improveRan) return;

  const cwd = input.cwd || process.cwd();
  const commits = VERIFY_COMMITS ? verifiedCommits(scan.commits, scan.startedAt, cwd) : scan.commits;
  if (commits.length === 0 && scan.production.length === 0) return;

  writeFileSync(statefile, JSON.stringify({ nudgedAt: new Date().toISOString(), commits, production: scan.production.length }));
  console.log(JSON.stringify({ decision: 'block', reason: REASON }));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main();
