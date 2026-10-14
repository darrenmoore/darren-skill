#!/usr/bin/env node
// Claude Code Stop hook: if this session added a worktree or merged a PR, audit the
// worktrees before going idle and hand the agent the teardown when something is safe
// to remove.
//
// Why: sessions that create a worktree per task usually end right after the merge, so
// the worktrees pile up (a dozen-plus checkouts and gigabytes within weeks). Runs once
// per session, no fetch (the merge already talked to the remote), and only ever points
// at `--apply`, which removes nothing with uncommitted or unpushed work.
//
// Guards:
//   - stop_hook_active: never fire on the turn the hook itself caused
//   - once per session (state file in the OS temp dir)
//   - only this session's own tool calls count, read from its transcript
//   - silent when there is nothing safe to clean
//
// Dependency-free Node 18+. Wire it up with settings.example.json.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

// ---- Configure for your repo -----------------------------------------------------------
// Where worktree-audit.mjs lives, relative to the project root. Its DEFAULTS (repos, root,
// keep, base) apply here too, so configure them there, once.
const AUDIT_SCRIPT = '.claude/skills/worktree-cleanup/worktree-audit.mjs';

// Commands that leave worktrees behind. Add your own (a release script, say).
const TRIGGERS = [
  /(^|[;&|(]\s*|\n\s*)git(\s+-C\s+\S+)?\s+worktree\s+add\b/,
  /(^|[;&|(]\s*|\n\s*)gh\s+pr\s+merge\b/,
];
// -----------------------------------------------------------------------------------------

export function touchesWorktrees(command) {
  return typeof command === 'string' && TRIGGERS.some((re) => re.test(command));
}

export function scanTranscript(text) {
  for (const line of text.split('\n')) {
    if (!line) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    const content = entry.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (block.type === 'tool_use' && touchesWorktrees(block.input?.command)) return true;
    }
  }
  return false;
}

export function buildReason(report) {
  const by = (verdict) => report.worktrees.filter((entry) => entry.verdict === verdict);
  const safe = by('safe');
  const folders = by('folder');
  if (!safe.length && !folders.length && !report.prunable.length) return null;
  const lines = ['This session added a worktree or merged a PR, and there are leftovers:'];
  for (const entry of safe) lines.push(`- ${entry.name} (${entry.repo}, ${entry.branch}): ${entry.reasons.join(', ')}`);
  for (const entry of folders) lines.push(`- ${entry.name}: plain folder, no git worktree behind it`);
  if (report.prunable.length) lines.push(`- ${report.prunable.length} stale registration(s) to prune`);
  lines.push(
    '',
    `Before stopping, tear them down with \`node ${AUDIT_SCRIPT} --apply\` (removes only`,
    'worktrees whose commits are all on the base branch, plain folders, and stale registrations;',
    'keeps pinned worktrees and anything with uncommitted or unpushed work). If the work is',
    'still open, say so instead and leave it. Report the After: line it prints.',
    '',
    'This runs once per session.',
  );
  return lines.join('\n');
}

async function main() {
  let input = {};
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* no input */ }
  if (input.stop_hook_active) return;

  const dir = join(tmpdir(), 'claude-worktree-nudge');
  mkdirSync(dir, { recursive: true });
  const statefile = join(dir, `${String(input.session_id || 'no-session').replace(/[^a-zA-Z0-9_-]/g, '')}.json`);
  if (existsSync(statefile)) return;

  const path = input.transcript_path;
  if (!path || !existsSync(path)) return;
  if (!scanTranscript(readFileSync(path, 'utf8'))) return;

  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const { auditWorktrees } = await import(pathToFileURL(join(root, AUDIT_SCRIPT)).href);
  const report = await auditWorktrees(root, { fetch: false });
  writeFileSync(statefile, JSON.stringify({ nudgedAt: new Date().toISOString() }));
  const reason = buildReason(report);
  if (reason) console.log(JSON.stringify({ decision: 'block', reason }));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((error) => { console.error(`[worktree-nudge] ${error.message}`); });
}
