# {{Feature name}}

**Tickets:** {{ticket}}{{, ticket2: append later tickets here, never fork a new folder}}
**Status:** planning (pre-implementation)
**Work item:** `docs/work/{{_next|_active}}/{{slug}}/` (status is the folder; move it with `/work`)
**Created:** {{YYYY-MM-DD}}

## Picking this up (agents start here)

1. **Read the plan:** {{`SUMMARY.md` for the plain-English digest, if present;}} this hub for the
   index and decisions{{; `REVIEW.md` for the evidence, if present}}.
2. **Check [PROGRESS.md](PROGRESS.md)**, then the phase's own `PROGRESS.md`: what is done, in
   progress, free.
3. **Claim your task** in the phase's `PROGRESS.md`: set its row to `in progress`, add your name
   and the date under Owner.
4. **Do the work** from the task file (`0N0-*.md`: tests first, then acceptance).
5. **Update PROGRESS.md** as you go: `done` (with commit) or `blocked` (say why).

{{Gates, if any: checks to run before touching certain areas, e.g. `<your migration review>`.}}

## What we're building and why

{{Two to four paragraphs: the user or operator problem, the shape of the solution, and why this
approach over the obvious alternative. Written for a future session picking this up cold.}}

## Doc index

| Doc | Contents |
|---|---|
| [PROGRESS.md](PROGRESS.md) | The phase roll-up |
| {{[SUMMARY.md](SUMMARY.md)}} | {{Plain-English digest, if present}} |
| {{[QUESTIONS.md](QUESTIONS.md)}} | {{Decisions to confirm or answered, if present}} |
| {{[REVIEW.md](REVIEW.md)}} | {{Evidence, if present}} |
| [01-phase1-{{slug}}/](01-phase1-{{slug}}/README.md) | {{one-line summary}} |
| [03-review/](03-review/README.md) | The review pass; its verdict gates release |
| [04-qa/](04-qa/WALKTHROUGH.md) | The owner's walkthrough, prepare list and visual change log |
| [05-closing/](05-closing/README.md) | Ticket housekeeping, then `/work done` |
| [SELF-AUDIT.md](SELF-AUDIT.md) | The builders' risk register |
| [CLEANUP.md](CLEANUP.md) | Promised refactors and removals, each with its proof search |

{{Keep this table in sync: every phase folder and companion doc gets a row. Every question stays
in the root QUESTIONS.md; later rounds are QUESTIONS-2.md and so on.}}

## Decisions locked with the user ({{YYYY-MM-DD}})

| Decision | Choice | Source |
|---|---|---|
| {{decision}} | {{what was chosen and, briefly, why}} | {{grill / user / evidence}} |

## Building blocks we reuse (do not rebuild)

| Need | Existing code |
|---|---|
| {{capability}} | {{`path/to/file.ts:line`: what it already does}} |

## Out of scope

- {{explicitly dropped item, and where it lives if deferred}}

## Open questions

{{Answered items stay here annotated "(answered YYYY-MM-DD: ...)". Detailed decisions live in
QUESTIONS.md; this is the short list.}}

- {{open question, with the default if we had to proceed}}
