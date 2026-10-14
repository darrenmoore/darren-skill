#!/usr/bin/env node
// Stop-gate that forces a reviewer subagent pass over files the agent wrote this session.
// Claude Code hook (PostToolUse, SubagentStop, Stop events). Dependency-free Node.
//
// The trap this exists for: a review skill or style guide is advisory, so a long build turn
// can finish without it ever being consulted. Three modes cooperate through one per-session
// state file:
//   record   (PostToolUse Edit|Write)   -- remember which matching files were written
//   reviewed (SubagentStop <reviewer>)  -- mark everything recorded so far as reviewed
//   check    (Stop)                     -- block the stop while any file is unreviewed
//
// MAX_BLOCKS bounds the fix -> re-review -> fix cycle. Without it, every round of fixes
// records new files and the turn can never end.
//
// To run two gates (say, UI files -> design reviewer, migrations -> schema reviewer), copy
// this file under a second name and give it its own GATE_NAME.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, relative, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';

// ---- Configure here -------------------------------------------------------------------
const GATE_NAME = 'review-gate';   // names the state dir and the messages
const REVIEWER = 'reviewer';       // subagent_type to spawn; match it in the SubagentStop matcher
const INCLUDE = [                  // globs, relative to the project root, forward slashes
  'src/**/*.{ts,tsx}',
];
const EXCLUDE = [                  // files with nothing for the reviewer to judge
  '**/*.test.{ts,tsx}',
  '**/*.d.ts',
];
const MAX_BLOCKS = 3;
const INSTRUCTIONS = [             // what the agent should do with the review
  'Apply its Must-fix findings, and state plainly which Should-fix items you are',
  'declining and why.',
];
// ---------------------------------------------------------------------------------------

const mode = process.argv[2] ?? 'check';

// Minimal glob: ** (any depth), * (within a segment), ? and {a,b}.
function globToRegex(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        i++;
        if (glob[i + 1] === '/') { i++; re += '(?:.*/)?'; } else { re += '.*'; }
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') re += '[^/]';
    else if (c === '{') {
      const end = glob.indexOf('}', i);
      re += '(?:' + glob.slice(i + 1, end).split(',').map(escape).join('|') + ')';
      i = end;
    } else re += escape(c);
  }
  return new RegExp('^' + re + '$');
}
function escape(s) {
  return s.replace(/[.+^$()|[\]\\]/g, '\\$&');
}

const includeRes = INCLUDE.map(globToRegex);
const excludeRes = EXCLUDE.map(globToRegex);

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

function statePath(sessionId) {
  const dir = join(tmpdir(), `claude-${GATE_NAME}`);
  mkdirSync(dir, { recursive: true });
  return join(dir, `${(sessionId || 'no-session').replace(/[^a-zA-Z0-9_-]/g, '')}.json`);
}

function loadState(path) {
  if (!existsSync(path)) return { touched: [], reviewed: [], blocks: 0 };
  try {
    const s = JSON.parse(readFileSync(path, 'utf8'));
    return { touched: s.touched ?? [], reviewed: s.reviewed ?? [], blocks: s.blocks ?? 0 };
  } catch {
    return { touched: [], reviewed: [], blocks: 0 };
  }
}

function projectRelative(file, input) {
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const rel = isAbsolute(file) ? relative(root, file) : file;
  return rel.replace(/\\/g, '/');
}

function matches(rel) {
  if (rel.startsWith('../')) return false; // outside the project
  return includeRes.some((r) => r.test(rel)) && !excludeRes.some((r) => r.test(rel));
}

const input = readInput();
const path = statePath(input.session_id);
const state = loadState(path);

if (mode === 'record') {
  const file = input.tool_input?.file_path ?? input.tool_input?.filePath ?? input.tool_input?.notebook_path ?? '';
  if (file) {
    const rel = projectRelative(file, input);
    if (matches(rel) && !state.touched.includes(rel)) {
      state.touched.push(rel);
      writeFileSync(path, JSON.stringify(state));
    }
  }
  process.exit(0);
}

if (mode === 'reviewed') {
  state.reviewed = [...new Set([...state.reviewed, ...state.touched])];
  writeFileSync(path, JSON.stringify(state));
  process.exit(0);
}

// mode === 'check'
const pending = state.touched.filter((f) => !state.reviewed.includes(f));

if (pending.length === 0) process.exit(0);

if (state.blocks >= MAX_BLOCKS) {
  console.log(JSON.stringify({
    systemMessage: `${GATE_NAME}: ${pending.length} file(s) still unreviewed, but the ${MAX_BLOCKS}-block limit was reached. Allowing stop.`,
  }));
  process.exit(0);
}

state.blocks += 1;
writeFileSync(path, JSON.stringify(state));

const list = pending.map((f) => `  - ${f}`).join('\n');
const reason = [
  `These files were written this session and have not been reviewed by ${REVIEWER}:`,
  list,
  '',
  `Spawn the ${REVIEWER} subagent on them now (Agent tool, subagent_type "${REVIEWER}"),`,
  'passing the file list above.',
  ...INSTRUCTIONS,
].join('\n');

console.log(JSON.stringify({ decision: 'block', reason }));
