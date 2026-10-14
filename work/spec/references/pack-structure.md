# Pack structure: shapes, companion docs, naming

Reference for `spec`. Load it when scaffolding or reshaping a pack.

## The standard shape

```
docs/work/_next/<slug>/
├── README.md            single hub at the root
├── PROGRESS.md          roll-up only: one row per folder below, never task rows
├── QUESTIONS.md         every open owner question, one section per phase (4.2 = phase 4, Q2)
├── SELF-AUDIT.md        the builders' risk register
├── CLEANUP.md           promised refactors and removals, each with its proof search
├── 01-phase1-<slug>/    build phases all share 01-, with a descriptive suffix
│   ├── README.md        phase index and gating condition
│   ├── PROGRESS.md      this phase's task rows
│   ├── 010-<slug>.md    numbering restarts inside each folder
│   └── 020-<slug>.md
├── 01-phase2-<slug>/    a phase added mid-build is the next 01-phaseN-; nothing else moves
├── 02-docs/             only when user-facing docs change; the gap is fine when absent
├── 03-review/           the review pass
├── 04-qa/               the owner's: VISUAL-CHANGES.md, PREPARE.md, WALKTHROUGH.md
└── 05-closing/          ticket housekeeping, then /work done
```

- **State folders are fixed** (`_next/`, `_active/`, `_parked/`, `_done/`) and items sit directly
  under them, with no area layer. An item is never renamed and never deleted.
- **Numbering is always 010-stepped.** Insertions take intermediate numbers (`015-`). No `001-`
  sequences.
- **Slugs** are short, flat and carry their own context. A dated suffix only for a time-boxed
  batch. Never a status or priority word.
- **Folder names sort in the order the work runs.** A plain running number (`01-`, `02-`, `03-`)
  would renumber the tail every time a phase is added, so build phases share `01-` and the tail is
  fixed. Past nine phases, zero-pad (`01-phase01-`) so `phase10` does not sort before `phase2`.

## Companion docs (the only files allowed beside README and tasks)

| File | Role | When |
|---|---|---|
| `PROGRESS.md` | Shared status log: one row per task (status, owner, notes), a decisions log, blockers. An agent picking up a task claims its row. | Whenever more than one agent or session will work the pack. Default yes. |
| `QUESTIONS.md` | Decisions to confirm: recommendation first, plain language, answered inline (`ANSWER:`). The bridge into `grill`. | When the plan has open owner decisions. Annotate once answered. |
| `SUMMARY.md` | Owner-facing plain-English digest: every change, before and after, no code. | When the requester isn't the implementer, or the change is broad. |
| `REVIEW.md` | Evidence: production or staging data that grounds the plan, shareable cold. | When numbers drive the change. |
| `SELF-AUDIT.md` | The builder's risk register, written for a different reviewer: `[CLAIM]`, `[JUDGEMENT]`, `[GAP]`. Each building task appends as it lands. | Any pack with building tasks. Never written after the review starts. |
| `CLEANUP.md` | Every refactor and removal the pack promises, one row each: what exists, what happens to it, the task, and the search that proves it done (`rg "oldHelper" src` is empty). The review pass re-runs every search. | Any pack that moves, replaces or deletes code, or leaves anything temporary. |
| `<SURFACE>-DESIGN.md` | One per UI surface: a mockup (or link to one), its states, copy, rules and what is out of scope. `Status: draft` until the user has seen it and said "agreed". | When the pack builds or reworks a dialog, panel, tab or page. One file per surface; never fold two into one. |

### Where they live

**`PROGRESS.md` belongs to the phase; `QUESTIONS.md` belongs to the root, always.** A phase runs
for days on its own, so its task log lives with it. Questions are different: the owner answers
them, and the owner answers in one place. One pack with seven phase folders, each holding its own
questions file, put fifty questions in front of the owner across seven files. They were moved to
the root, and no pack has done it since.

| Doc | Where |
|---|---|
| `PROGRESS.md` | One per phase folder with its task rows. The root keeps a roll-up only: one row per phase (status, gate, link). |
| `QUESTIONS.md` | Root only, one section per phase, numbered by phase. |
| `README.md` | Root hub and one index per phase folder. |
| Everything else | Root by default; in a phase folder only when it is genuinely phase-local. |

- **Only owner decisions are questions.** Ask: would the owner care which way this goes? If not,
  it is the builder's call, recorded in the task's Decision and as a `[JUDGEMENT]`.
- **Keep the list short.** Before adding a question, check an earlier answer in the pack hasn't
  settled it; if one has, cite it in the task instead.
- **A later round is a new root file**, `QUESTIONS-2.md`, `QUESTIONS-3.md`… The owner reads a
  round in one sitting; answered rounds stay as history and the README index says which is open.

## The design phase (packs that build UI)

If the pack builds or reworks any dialog, panel, tab or page, its first phase is
`01-phase1-designs/`. Every screen is mocked up and agreed by the owner before any build phase
starts, so the owner sees what will be built while it is still cheap to change.

- One task per surface (`0N0-design-<surface>.md`), plus a closing **journey review**: walk each
  kind of user across all the mockups and feed every issue back into the pack.
- Build phases hold no design tasks. A UI building task depends on its design being agreed, and
  each build phase ends with a check against the designs it built.
- A phase that waits on no design (a rename, a schema change) may run beside the design phase; say
  so in its gate.
- Build phases still end with something on screen: designs first does not mean UI last.

## The fixed tail

**`03-review/`** holds the review pass: reviewers who did not build the work check it against the
repo's standards, read `SELF-AUDIT.md` to aim at the risk, and re-run every row of `CLEANUP.md`.
Its verdict gates release. A builder who adds anything temporary, or a task that promises a
removal, adds the `CLEANUP.md` row in the same commit.

**`04-qa/`** covers the whole pack and is walked after the review. Building agents change screens
the owner never hears about (a subtitle fix that reached five dialogs, a caption reworded in
passing); this is where every such change is written down and where the owner steps through them.

| File | Written by | Holds |
|---|---|---|
| `VISUAL-CHANGES.md` | the task that made the change, in the same commit | one row per visible change: date, task, where, before and after, its walkthrough step |
| `PREPARE.md` | the same task, when its step needs set-up state | the commands that stage it, what each leaves behind, how to undo it |
| `WALKTHROUGH.md` | the same task; tidied into reading order before the owner walks it | parts by surface; each step is where to go, what to click, what to see; a Notes space per part |

- A change nobody asked for still gets its row. That is the case this exists for.
- The owner's notes are sorted into fix now (reopen the owning task), later (a ticket) or not a
  bug (say why), and only the fixes are re-walked.

**`02-docs/`**, when present, documents what the build phases actually shipped, not the intent.
It is gated on the build phases landing and runs before the review, so the review can check the
docs against the code.

**`05-closing/`** holds the ticket-housekeeping task and ends with `/work done`.

## The ticket-housekeeping task (multi-ticket packs)

A pack that carries two or more tickets ends with a ticket task in `05-closing/`, after the
owner's walkthrough. It is not a code task, and it is the one most often skipped:

- write a real description onto every title-only ticket from the `QUESTIONS.md` answers, and link
  the pack; a board of one-line titles is how decisions get lost
- move each ticket along as its work lands, not in one sweep at the end
- reply to whoever reported them, once the change is live
- say on the ticket when something was deliberately not built, rather than leaving it open
- name the umbrella ticket and hang the rest off it

Carry a ticket map in the task file: one row per ticket, which tasks cover it, and whether it
still needs a description.

## Ordering and coupling

- The roadmap's **Depends on** column holds hard ordering. Add a "ships with" note when two tasks
  in different phases must land in the same release.
- Phases are otherwise assumed independent unless a dependency says so.
