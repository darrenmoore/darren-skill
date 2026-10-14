---
name: ai-check
description: "Check a draft for phrases and shapes that read as AI-written, using a banned list you keep, and add new phrases to that list. Use when asked to 'check this for AI tells', 'does this read as AI', 'lint this draft', before publishing a post, article or release note, or when the user says 'don't say that again', 'add that to the do-not-say list', 'that's too AI', or rejects a phrase. Offline, no API key."
---

# AI check

Two jobs: lint a draft against `do-not-say.md`, and grow that list when you reject a phrase.

`check.mjs` is a lint, not an authorship detector. It finds phrases and shapes you have banned. It can't tell whether the reader understands the text or whether a conclusion follows from the evidence, so a clean result means "no banned phrases", nothing more. Read the draft for clarity and evidence first, and run this after.

## Check a draft

```bash
node <path-to>/ai-check/check.mjs <draft.md>
node <path-to>/ai-check/check.mjs <draft.md> --list <your>/do-not-say.md
```

- Frontmatter and fenced code blocks are skipped. Curly quotes are straightened before matching.
- Output is one line per match: `file:line:col  "match"  [family > entry]`. Exit code 1 when anything matched, 0 when clean, so it works in a pre-publish script or CI step.
- If you already run a checker or a prose linter (Vale, a custom rule engine), point it at the patterns in `do-not-say.md` instead and drop `check.mjs`.

## Fix what it flags

1. Go to each spot. Read the whole sentence and the one before it.
2. Rewrite it in the author's voice. The `Why:` line under the entry says what is wrong with the shape.
3. The fix must still be a complete, clear sentence. Never fix a hit by clipping the sentence, deleting the phrase and leaving a stub, or moving the prose into a table.
4. Don't game it. Swapping a flagged word for a synonym that keeps the same shape misses the point and usually reads worse.
5. Re-run until clean.

Treat every match as a hard fail unless it is a genuine false positive (quoting the phrase to discuss it, a proper noun). In that case make the pattern more specific rather than ignoring the hit.

The list can't catch every paraphrase or rhythm. After it passes, still read the draft for the families in `do-not-say.md` that have no pattern (two-part titles, invented detail, "X beats Y" maxims).

## Add a phrase to the list

When the user rejects a phrase ("don't say that", "never again", "that's too AI"):

1. Read `do-not-say.md`.
2. Write one entry under the closest family heading. Add a family only if none fits.
   - A bold line naming the shape to avoid, with the quoted example. If it's a one-off phrase with an obvious underlying shape, name the shape.
   - A `**Why:**` line if the user gave a reason or it is clear from context. One or two sentences. Leave it off if there is no why.
3. Don't duplicate. If it overlaps an existing entry, extend that entry instead.
4. Add a `Pattern:` line with a regex for the phrase:
   - Straight quotes, `\b` word boundaries, matched case-insensitively.
   - Specific. Cover the obvious paraphrases but don't reach so wide it catches normal prose.
   - If the tell is a rhythm or structure with no fixed wording, skip the pattern and say so.
5. Verify it fires: put the phrase in a scratch file, run `check.mjs` on it, confirm the match, delete the scratch file. If the phrase is live in a draft, fix the draft and re-check.
6. If the user gave or approved the better wording, add the before/after pair to `before-after.md`. A ban alone tends to produce clipped sentences; the pair shows what to write instead.
7. Confirm in one line what you added: entry, pattern, and pair if any.

Keep it slim. This is a capture step, not a writing task. Don't reformat the files or touch anything else.

## Report back

Say whether the draft is clean, list the matches with line numbers, and point at the specific rewrites. If you added to the list, say what.
