# {{0N0}}: {{Task name}}

**Status:** not started {{| in progress | done (YYYY-MM-DD) | deferred}}
**Ticket:** {{ticket, if you use a tracker}}
**Depends on:** {{010-slug.md | none}}
**Leverage:** {{existing code or pattern this rides on, or "none, new ground"}}

## Problem

{{What is wrong or missing today, concretely. Cite code with `file:line` where it helps.}}

## Decision

{{The chosen approach in one to three sentences, and the alternative it beat if that isn't
obvious. A technical choice made without an owner ruling also goes in SELF-AUDIT.md as a
[JUDGEMENT].}}

## Tests first

{{The failing tests to write BEFORE implementation: file path and what each asserts. They must
verify behaviour, not be written to pass. Implementation starts only once these exist and fail.
Docs-only task: N/A.}}

- {{`src/__tests__/<name>.test.ts`}}: {{behaviour it pins}}

## What to do

1. Write the tests above; run them (`<your test command>`); confirm they fail for the right reason.
2. {{ordered implementation step}}
3. {{...}}

## Where

- {{`path/to/file.ts`}}: {{what changes there}}

## Acceptance

- {{observable criterion}}
- **The killer test:** {{the one scenario that proves this works end to end, if there is one}}
- **SELF-AUDIT.md** entries added for this task's claims, judgements and gaps.
- **CLEANUP.md** row for anything temporary or any promised removal. Delete if none.
- **Visible to a user?** A row in `04-qa/VISUAL-CHANGES.md` and the `04-qa/WALKTHROUGH.md` step
  that shows it (a `04-qa/PREPARE.md` line if it needs set-up state). Delete if nothing is visible.

## Notes

{{Edge cases, migration concerns, docs or translation flags, anything a future session needs.}}
