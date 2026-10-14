#!/usr/bin/env node
// Flags do-not-say phrases in a draft. A lint, not an AI detector.
// Usage: node check.mjs <draft.md> [--list path/to/do-not-say.md]
// Exit codes: 0 clean, 1 matches found, 2 usage or file error.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const listFlag = args.indexOf('--list');
const listPath = listFlag >= 0 ? args[listFlag + 1] : join(dirname(fileURLToPath(import.meta.url)), 'do-not-say.md');
const draftPath = args.find((a, i) => !a.startsWith('--') && (listFlag < 0 || i !== listFlag + 1));
if (!draftPath || (listFlag >= 0 && !listPath)) {
  console.error('Usage: node check.mjs <draft> [--list do-not-say.md]');
  process.exit(2);
}

const read = (p) => {
  try { return readFileSync(p, 'utf8'); } catch (e) { console.error(`Cannot read ${p}: ${e.message}`); process.exit(2); }
};
const fold = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

// Collect patterns: each "Pattern: `regex`" line belongs to the latest family (##) and entry (- **...**).
const rules = [];
let family = '', entry = '', listFence = false;
for (const line of read(listPath).split(/\r?\n/)) {
  if (/^\s*(```|~~~)/.test(line)) { listFence = !listFence; continue; }
  if (listFence) continue;
  const h = line.match(/^##\s+(.+)/);
  if (h) { family = h[1].trim(); continue; }
  const e = line.match(/^-\s+\*\*(.+?)\*\*/);
  if (e) { entry = e[1].trim(); continue; }
  const p = line.match(/^\s*Pattern:\s*`(.+)`\s*$/);
  if (!p) continue;
  try { rules.push({ re: new RegExp(p[1], 'gi'), family, entry }); }
  catch (err) { console.error(`Bad pattern in ${listPath}: ${p[1]} (${err.message})`); process.exit(2); }
}

// Scan the draft line by line. Skip YAML frontmatter and fenced code blocks.
const lines = read(draftPath).split(/\r?\n/);
let inFront = lines[0]?.trim() === '---', inFence = false;
const hits = [];
lines.forEach((raw, i) => {
  if (inFront) { if (i > 0 && raw.trim() === '---') inFront = false; return; }
  if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; return; }
  if (inFence) return;
  const text = fold(raw);
  for (const r of rules) {
    r.re.lastIndex = 0;
    for (const m of text.matchAll(r.re)) {
      hits.push({ line: i + 1, col: m.index + 1, match: m[0], ...r });
    }
  }
});

if (!hits.length) {
  console.log(`${draftPath}: clean (${rules.length} patterns checked)`);
  process.exit(0);
}
hits.sort((a, b) => a.line - b.line || a.col - b.col);
for (const h of hits) {
  console.log(`${draftPath}:${h.line}:${h.col}  "${h.match}"  [${h.family} > ${h.entry}]`);
}
console.log(`\n${hits.length} match(es). Rewrite each spot as a full, clear sentence; don't just delete the phrase.`);
process.exit(1);
