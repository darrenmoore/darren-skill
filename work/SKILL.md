---
name: work
description: Resumable work items under docs/work/. A work item is a folder, and the folder it sits in is its status (_next, _active, _parked, _done). Capture, start, park, finish and report real progress on an item. Use for "/work", "what are we working on", "new work item", "start X", "park X", "is X done", "how far did we get", "what's left".
argument-hint: [nothing | new <slug> | start <slug> | park <slug> | done <slug> | progress [slug]]
---

# /work

Work items move between folders. **Their names never encode priority, area or status.** The parent
folder is the status, and renaming an item to reflect a changed priority breaks every link and
every memory of where the work was.

```
docs/work/
  README.md   the four states and the item shape, in a few lines
  _next/      captured or specced, not started
  _active/    being worked on now (keep this to one or two)
  _parked/    started, then deliberately paused
  _done/      finished, shipped, superseded or abandoned (PROGRESS.md says which)
```

A work item is a folder named with a stable, flat, kebab-case slug: `checkout-retry`,
`search-filters`, `billing-export`. No area sub-folders under the states; the slug carries whatever
context it needs. A date in a slug is only for a time-boxed batch (`review-oct-7`).

```
docs/work/_active/checkout-retry/
  README.md        the brief and hub: what and why, doc index, decisions
  010-schema.md    numbered files are tasks; the number is execution order
  020-api.md
  030-ui.md
  PROGRESS.md      resumable state, when more than one session touches it
  QUESTIONS.md     open decisions, when there are any
```

Bigger items can be phased: task files live in phase folders, each with its own `README.md` and
`PROGRESS.md`, numbering restarting per folder. The `spec` skill (in `spec/`) builds either shape
and lists the other companion files allowed. `/work` only needs the three above.

Numbered task files keep their numbers forever: the number is the sequence, not a rank. Insert
with `015-`. Do not add workflow states, status metadata or front-matter: moving a folder is the
whole mechanism.

## Subcommands

Read the text after `/work` as a subcommand and an optional slug. Keep every reply short.

### `/work`: the overview

List items grouped **Active / Next / Parked / Recently done** (the last five or so in `_done`, by
the git date of the move). Names, plus one line from the README's `**Status:**` line if it has
one. Do not open task files to do it.

### `/work new <slug>`

Create `docs/work/_next/<slug>/README.md` containing only:

```markdown
# <Title>

## Brief
```

Fast capture. **Do not decompose, spec or implement.** If the slug already exists in any of the
four states, say where and create nothing. To turn the capture into a plan, run `spec`, which
writes into this same folder.

### `/work start <slug>`

`git mv` it from `_next` or `_parked` into `_active`. Do not rename it, and do not begin
implementation just because it moved. Already active: leave it. If two or more items are already
active, say so; the owner decides which one yields.

### `/work park <slug>`

If meaningful work has started, write enough into `PROGRESS.md` that a cold session can resume.
Then `git mv` it to `_parked`. Do no further implementation while parking.

### `/work done <slug>`

Check the numbered task files and the repository first. If tasks are clearly incomplete or
blocked, **say so and stop**; move it only on explicit confirmation. Then:

1. **What only waits for a release is not a reason to stay open.** A check after deploy, a data
   backfill, a reply to a customer: move each to wherever your team tracks release steps
   (a release checklist, a ticket), cut it from the item, and say in the item where it went.
   **Except** the item's own review pass and any test a task file promises (`Tests first`,
   `The killer test`). Those are not release steps, and an item missing either is not done. One
   item went to `_done` with its review pass parked as a release reminder; when it finally ran it
   found fifteen major issues, two of them promised tests that were never written.
2. **Harvest keepers.** Anything that must outlive the item goes to a real home first: user or
   product docs, durable design notes (<your docs folder>), reusable queries and scripts
   (<your scripts folder>), lasting decisions (<your tracker or ADRs>). Say what moved. Evidence and
   findings may stay inside the item; a `_done` item can still be linked to.
3. Add one line at the top of `PROGRESS.md` (create it if absent): the date and `shipped`,
   `superseded by <slug>` or `abandoned: <why>`. Say what was not done and where it went.
4. `git mv` it to `_done`, unrenamed. Nothing is deleted; `_done` is the archive and git holds the
   rest.
5. Fix links that pointed at the old path (search the repo for `_active/<slug>`).

### `/work progress [slug]`

Answers: where did the last session get to, what happened, what is next.

No slug given: use the single active item, or the one this conversation is clearly about;
otherwise report each active item separately.

**`PROGRESS.md` is a claim, not evidence.** A session that stopped midway left it stale. Weigh
what you find in this order:

> repository state **>** numbered task files **>** `PROGRESS.md`

**A task file's own `Status:` line, and what it says about the code, are claims too.** This holds
when you are building a task, not only when reporting on one: read the task, then verify every
factual claim in it before writing code against it. In one real pack, three of six task files were
wrong: one said a fix was uncommitted when it had been committed two days earlier, one said a
report did not exist when it did, one said an event never fired when it fired correctly. Each cost
a build-from-scratch that turned into a verify-and-delete. In another, every task file still said
`not started` while `PROGRESS.md` said done and the code was live.

Read `README.md`, the numbered files, `QUESTIONS.md`, `git status`, `git diff`, `git log`, and the
implementation itself for any task whose state is unclear. **Change no source code.** You may
rewrite `PROGRESS.md` to match what you found.

Tasks are the files whose names start with a number, found recursively; in a phased item the ID is
`phase2/010`. `README.md`, `PROGRESS.md`, `QUESTIONS.md` and other companions are not tasks.
Statuses are these four and no others: 🟢 complete, 🟡 in progress, 🔴 blocked, ⚪ not started. The
Status column carries the emoji alone.

Output exactly this shape and nothing before or after it:

```markdown
| ID | Item | Summary | Status |
|---:|---|---|:---:|
| 010 | Schema | Migration and tests landed | 🟢 |
| 020 | API | Retry endpoint written, idempotency pending | 🟡 |
| 030 | UI | Not started yet | ⚪ |
| 040 | Docs | Waiting on 020 | 🔴 |

Previous: Wired the retry endpoint. Next: Finish idempotency keys, then start the UI. Blockers: No blockers.
```

One row per numbered task, Item a short name, Summary one phrase. Previous is the last meaningful
work attempted, Next the single most useful next action, Blockers what prevents progress. When
there are none the words are exactly `Blockers: No blockers.`

## Rules

- `spec` scaffolds a plan **inside** a work item and never anywhere else. Retiring a plan is
  `/work done`, never a delete.
- One slug per piece of work. A later ticket or request on the same feature extends the existing
  item; it does not fork a new folder. A shipped sibling in `_done` is prior art; a new round of
  the same feature gets a new slug rather than resurrecting a done item.
- Commit the moves on their own (a housekeeping commit), separate from the code the item produces.
