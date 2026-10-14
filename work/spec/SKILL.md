---
name: spec
description: Scaffold a plan pack for a bigger piece of work inside a docs/work/ item (docs/work/_next/<slug>/ or _active/<slug>/): a short setup interview, a README hub, numbered task files with tests named first, and a fixed set of companion docs. Use for "/spec", "set up a spec for this", or when a feature is too big for one commit. Not for small single-commit fixes. Retiring a pack is "/work done", not a delete.
---

# /spec

Turn a bigger piece of work into a **plan pack**: a `docs/work/` item holding a `README.md` hub,
010-stepped task files and a small set of companion docs. `/spec` sets the pack up with a short
structural interview, then stops. The item's status is the folder it sits in (see the `work`
skill); when the work ships, retire it with `/work done <slug>`.

This skill scaffolds and stops. It does not design the feature in depth (that is `grill`, run on
the draft) and it never starts implementation.

## Pack shape (summary)

- **Every pack is phased, even with one phase, and its folders sort in the order they run.** Build
  phases are `01-phase1-<slug>/`, `01-phase2-<slug>/`… (a phase added mid-build is the next
  `01-phaseN-`; nothing else moves). Then a fixed tail that never renumbers: `02-docs/` (only when
  user-facing docs change; the gap is fine), `03-review/`, `04-qa/`, `05-closing/`. Each folder has
  its own `README.md` index, its own `PROGRESS.md`, and restarts at `010-`. No task file sits at
  the root.
- **Every question lives at the root**, in `QUESTIONS.md`. No phase folder holds one.
- **`04-qa/` is the owner's**: `VISUAL-CHANGES.md` (every change a user can see, appended by the
  task that made it), `PREPARE.md` (state to set up before the walkthrough) and `WALKTHROUGH.md`
  (where to go, what to click, what to see, room for notes). It exists because building agents
  change screens the owner never hears about.
- **Companion docs are a fixed set**: `PROGRESS.md`, `QUESTIONS.md` (later rounds are new files,
  `QUESTIONS-2.md`…), `SUMMARY.md`, `REVIEW.md`, `SELF-AUDIT.md`, `CLEANUP.md`, and one design
  file per UI surface. Nothing else: `START.md`, `INFO.md`, `OVERVIEW.md`, `PLAN.md` are banned,
  because the README is the plan.
- **Questions are for the owner only.** A technical choice the builder can make (table and column
  names, where a type lives, a file's name) is not a question: the task states it as its Decision,
  and the builder records it as a `[JUDGEMENT]` in `SELF-AUDIT.md`.

Full detail (trees, numbering, companion roles, the design phase, the fixed tail) is in
[references/pack-structure.md](references/pack-structure.md). Read it before scaffolding.

## Step 1: Gather context (read first, don't ask what you can read)

- Load the ticket or request this pack is for. If there is none, say so and proceed only if the
  user agrees.
- **Assume the pack is more than one ticket, and go and look.** A feature big enough for `/spec`
  rarely maps to the single ticket in front of you. The same area usually has siblings in the
  tracker, filed months apart, each a title with no description. Search open tickets for the
  feature's words in titles and bodies, and put the candidates to the user as in / your call / out.
  Finding them afterwards means a README, a roadmap and a breakdown that all have to be reopened.
- List `docs/work/_next`, `_active` and `_parked` for a related item. If one exists, including a
  `/work new` stub that is only a brief, propose writing the pack **into it** instead of forking a
  new slug. Check `_done` too: a shipped sibling is prior art.
- Skim the code the work touches, enough to name concrete building blocks for the reuse table.
- **Specs that change numbers or live behaviour: gather evidence.** Run read-only queries against
  production or staging for the figures that justify the change (real usage, current values) and
  capture them in `REVIEW.md`. A pricing or limits change without evidence is a guess.

## Step 2: Setup interview (structural only, a few questions)

One round, two at most, recommendation first. Ask only what you can't infer:

1. **Slug**: propose a stable, flat kebab-case slug. No status or priority words; it never changes.
2. **State**: `_next` (default) or `_active` if implementation starts this session. Say so if one
   or two items are already active.
3. **Scope boundary**: what is explicitly out.
4. **Other tickets**: confirm the siblings found in Step 1, one by one, in or out. Each one that is
   in goes on the README header, on the tasks that carry it, and in the closing task's ticket map.
5. **User-facing docs?** If the change alters behaviour your user docs describe, plan `02-docs/`.
6. **Who reviews it?** If the requester isn't the implementer (a non-technical owner, a client) or
   the change is broad, plan a `SUMMARY.md`.
7. **New or reworked UI?** If the pack builds a dialog, panel, tab or page, plan a design phase
   first (`01-phase1-designs/`): one mockup task per surface, all agreed by the owner before any
   build phase starts. Name every surface and where it opens from.

Do not interrogate design decisions here. That is `grill`'s job after the draft.

## Step 3: Draft the breakdown before writing files

Outline the pack as a list (each planned `0N0-<slug>.md` with a one-line summary, in dependency
order, plus which companion docs apply) and show it to the user to confirm **before** scaffolding.

**Every pack ends with the fixed tail.** `03-review/` holds the review pass: reviewers who did not
build the work check it against the repo's standards before the owner looks at it, and re-run every
row of `CLEANUP.md`. `04-qa/` is the owner's walkthrough. `05-closing/` holds ticket housekeeping
and ends with `/work done`.

**Nothing that waits for a release is a pack task.** A production backfill, a check after deploy,
a reply to a customer: put each on your release checklist when the task that creates the need
lands, written so it can be followed cold. A release-day task file keeps the pack open after the
work is done.

Each **building** task also owns its slice of the paperwork: its `SELF-AUDIT.md` entries; when it
changes anything a user can see, a `04-qa/VISUAL-CHANGES.md` row plus the `WALKTHROUGH.md` step
that shows it (and a `PREPARE.md` line if the step needs set-up state); and a `CLEANUP.md` row for
anything temporary or any promised removal. Put all of it in each building task's Acceptance. Put
it on the building tasks, never on the review task: a self-audit written after the review has
started is a defence, not a disclosure.

## Step 4: Scaffold

Fill the templates with **real content from the ticket, interview, evidence and code reading**,
never placeholder text:

- `README.md` from [templates/README.md.tpl](templates/README.md.tpl): the onboarding block,
  what and why, doc index, decisions table (with a Source column), reuse table, out of scope, open
  questions.
- Root `PROGRESS.md` from [templates/PROGRESS.md.tpl](templates/PROGRESS.md.tpl) as a phase
  roll-up, and one per phase folder with task rows.
- Each phase folder's index from [templates/phase-README.md.tpl](templates/phase-README.md.tpl),
  with its gating condition.
- Task files from [templates/task.md.tpl](templates/task.md.tpl): Problem and Decision from the
  draft; Tests first, What to do, Where and Acceptance filled as far as honestly known. Every task
  with a code surface names its tests before its steps.
- `QUESTIONS.md` ([template](templates/QUESTIONS.md.tpl)) when there are open owner decisions:
  one section per phase, numbered by phase (`4.2` is phase 4, question 2) so a task can cite one.
- `SUMMARY.md` ([template](templates/SUMMARY.md.tpl)) for an owner-facing digest; `REVIEW.md` for
  the Step 1 evidence.
- `SELF-AUDIT.md` from [templates/SELF-AUDIT.md.tpl](templates/SELF-AUDIT.md.tpl): header and empty
  sections. Building tasks append `[CLAIM]` (re-run it), `[JUDGEMENT]` (challenge it) and `[GAP]`
  (decide whether it matters) entries as they land. It works because a different agent reads it
  than wrote it.
- `CLEANUP.md`: one row per promised refactor or removal, with the search that proves it done.
- `04-qa/` from the three `qa-*` templates: headers only; building tasks fill them.
- One design task per UI surface in the design phase. Make the mockups when that phase starts.

## Step 5: Hand off

Print the pack tree, then recommend `grill` on the draft (it consumes `QUESTIONS.md`) before any
implementation. If the pack has mockups, say they need the user's "agreed": a design only the
builder has seen is worthless, because the builder wrote it. **Stop.** The user holds the next move.

## Rules

- **Scaffold and stop.** Implementation starts only after the user reviews, usually via `grill`.
- **One hub.** `README.md` carries onboarding, doc index and decisions; keep the index in sync as
  files come and go.
- **`PROGRESS.md` is the shared log.** An agent picking up a task claims its row and updates it;
  that is how parallel agents avoid collisions. It is still a claim: the repo outranks it.
- **A phase owns its status, not its questions.** Task rows live in the phase folder; questions
  live at the root.
- **New tickets extend, they don't fork.** A later ticket on the same feature joins the existing
  pack's README.
- **A pack with two or more tickets gets a ticket-housekeeping task in `05-closing/`.** Write a
  real description onto title-only tickets from the `QUESTIONS.md` answers, move them along as
  their work lands, reply to whoever reported them, and say on the ticket when something was
  deliberately not built. Without this task the code ships and the board silently doesn't.
- **Always 010-stepped numbering.** Insert with `015-`; renumber only if the pack becomes
  unreadable.
- **Tests first.** Each task's `Tests first` section is the contract: write those tests, watch
  them fail, code to green. A task whose tests can't be named isn't specced; flag it open.
  Docs-only tasks mark it N/A.
- **Answered questions are annotated, not deleted.**
- **A design is the user's, not yours.** Mark it agreed only on the user's word, and never grade
  an implementation against a design the user has not accepted.

## What this skill is not

- Not for small fixes: a single-commit change needs no pack.
- Not a design interrogation: structural setup questions only.
- Not an implementation kickoff: it never edits code.
- Not a status system: the folder is the status, and `/work` moves it. `/spec` never moves,
  renames or deletes an item.
