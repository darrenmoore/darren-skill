---
name: shakedown
description: Fan out parallel read-only review subagents over finished work, each checking it against one of the repo's standards (tests, docs drift, copy, and any lanes you add), then merge their returns into one findings ledger with one severity scale and a GREEN/YELLOW/RED verdict. Use when a feature's build tasks are done and before a person reviews it, when the user says /shakedown, or asks "is this actually right?" about something just built. Not for a typo or a one-line fix.
argument-hint: "[scope] [--lanes a,b] [--size XS|S|M|L] [--since <ref>] [--no-fanout]"
---

# /shakedown

A shakedown cruise is the trial voyage of a new ship: you sail it hard to find what breaks before it
enters service. This skill does that to finished work. It dispatches **parallel review subagents**,
each holding one lane of the repo's standards, and returns one ledger.

It exists so the owner's check is the **second** check, not the first.

**It finds; it does not fix.** Fixes land afterwards as their own changes, then the failing check is
re-run. A pass that edits code while reviewing is how a review becomes a regression.

Two layers, always. A **[standard list](standard-list.md)** is the spine every pass walks whatever
changed. On top of it, a **plan** the pass writes from reading the actual diff. The plan may add to the
standard list; it may never quietly drop from it.

## What you set up once

- `standard-list.md`: your repo's standards, one section per lane. A starter is in this folder.
- `lanes/*.md`: one brief per lane. Three examples ship here (tests, drift, copy); see
  [lanes/writing-a-lane.md](lanes/writing-a-lane.md) to write your own.
- `<your automated checks command>`: lint, type check, any custom gates. Their results feed the digest.
- `<review dir>`: where plans and findings live, e.g. `docs/reviews/shakedown/`.

## When to use

- The build tasks for a feature are done and the owner is about to look at it.
- Before a release that carries real feature work.
- Any time the user asks "is this actually right?" about something just built.

**Do not run it on a typo, a copy tweak, or a one-line fix.** Size XS below catches that case and
refuses the fan-out. This is an expensive operation.

## Step 1: Clean tree

**A dirty worktree aborts the pass.** Subagents reading a half-committed tree report findings against
code that does not exist. Tell the user to commit first. The one exception is the owner saying the
dirty files belong to another session and are outside scope; record that in the plan.

## Step 2: Scope and size

| Invocation | Scope |
|---|---|
| `/shakedown` | whole branch diff vs the main branch |
| `/shakedown <scope>` | the files touched by one feature's commits (however your repo groups them) |
| `/shakedown --since <ref>` | `<ref>...HEAD` |

A re-run after a fix pass takes `--since` the fix commit and hands every lane the previous run's
Resolution column as **claims**: is it fixed everywhere it applies, and would its named test go red on
a revert? Fix rows are often half made. **Every confirming round is a new agent**, given only the prior
findings and the fix diff, never the reviewer or the fixer continued. Repeat until a round has no
unruled must-fix or should-fix. Scoped to the touched files, these rounds are cheap.

Then compute the size. **First match wins. Do not ask.**

```
XS : <=5 files, one surface, no schema or data changes
     -> NO fan-out. Read the diff yourself, report in chat, write no file.
S  : <=25 files, one feature   -> 2 lanes: the surface-mapped one + tests.
M  : <=90 files or <=3 features -> every triggered lane (typically 3-5).
L  : larger, or schema/data changes alongside >=2 other surfaces
     -> all lanes; shard the big ones by feature cluster. Hard cap: 12 subagents.
```

**Shard any lane over about 50 files; merge any under about 30** into a neighbour. The longest lane
sets the wall clock, and every lane pays a fixed reading cost (in measured passes, around 100k tokens)
before it reviews anything. One lane over 150 files took twice as long as the next and still read only
part of its scope.

**Lanes can run on a cheaper, faster model** than the orchestrator; assembly stays on the session's
model. `--size` and `--lanes` override. `--no-fanout` forces the XS path.

Announce the result in **one line** ("M: 61 files, 3 features, lanes tests/drift/copy") and go.

## Step 3: The lanes

A lane runs if any of its triggers appears in the changed files. Keep a table like this in your copy:

| Lane | Brief | Owns | Triggers |
|---|---|---|---|
| tests | [lanes/tests.md](lanes/tests.md) | Would these tests fail if the code were wrong? | any source or test file |
| drift | [lanes/drift.md](lanes/drift.md) | Do the docs, changelog, configs and instructions still agree with the code? | docs, changelog, any deleted or moved path |
| copy | [lanes/copy.md](lanes/copy.md) | Does the user read the right words, consistently, in every language? | locale files, UI text, emails, error messages |
| `<yours>` | `lanes/<yours>.md` | one question | `<paths or patterns>` |

**Shard by surface, never by rule.** Two agents applying the same rule to different files is fine. Two
agents applying different rules to the same file produce the same finding in different words. After
sharding, check every file that a check flagged is in some shard's list; a keyword split can leave a
flagged file in neither.

(Claude Code: a lane can dispatch to a named subagent in `.claude/agents/`, e.g. a test reviewer
such as the one in `test-driven-development/agents/test-reviewer.md`, so it accumulates its own memory.
Elsewhere, a general-purpose agent reading the same brief.)

## Step 4: Run the automated checks first

Run `<your automated checks command>`. **Do not run the full test suites** (see "On running tests").

If a lane must look at running screens, make the app answer first, or write "graded from code" into
the plan. A screen lane that silently grades from code reports `?` where it should report a finding.

Build the **already-checked digest**: one line per check and its verdict, pasted into *every* lane
prompt. This is the biggest single saving in the pass; without it, every agent re-derives that the
linter is clean.

A check's **warnings** (things it cannot be sure of) go to the owning lane as a **lead list**, not a
verdict: the lane opens each one and classifies it. Its **failures** are verdicts and go in the digest.

## Step 5: Read the diff, then write the plan

**Do not dispatch anything yet.** Read the diff until you can say in two or three plain sentences what
this work does. If you cannot, that is the first finding, and it usually means the change is doing more
than one thing.

Write the plan to `<review dir>/NNN-<slug>/plan.md` from [templates/plan.md](templates/plan.md).
Three layers, in this order:

1. **The standard list.** Every section of `standard-list.md`. You may mark a section `n/a` **with a
   reason**; you may not drop one silently. Left to itself an agent plans around what it finds
   interesting and skips the boring half, and the boring half is where the repeat offenders live.
2. **Specific to this change.** What is risky *here* that the standard list would not think to ask, one
   row each, with the lane that carries it and the threshold that makes it a finding, **declared now,
   before anything is measured**.
3. **What I will not do.** Said out loud so the owner can disagree before the budget is spent. Always
   includes the test suites and the green checks.

At size **L**, or whenever the plan marks a standard section `n/a`, **stop and let the owner read it**
before dispatching. That is the cheap moment to redirect. At XS/S/M with a full standard list, carry on.

## Step 6: Dispatch

Fill [templates/lane-prompt.md](templates/lane-prompt.md) per lane and **send every lane in one
message** so they run concurrently. No lane depends on another.

Each prompt must carry, without exception:

1. The lane's **scope file list**, computed by you. Findings outside it are dropped.
2. The **already-checked digest**, under "do not re-check".
3. The lane's **not-mine list** from its brief.
4. The **pointed input**: the builder's self-audit entries for that lane (below), any acceptance
   criteria for the work, and any owner rulings that define how strict "right" is.
5. The **evidence rule** and the **return schema**. Lanes return JSON. They never write files.

Put what every lane needs (diff stat, digest, self-audit) in one `context.md` in the run folder and
point each prompt at it. The brief itself goes in unabridged.

Omitting (1) makes an agent wander the repo. Omitting (2) wastes a third of the budget. Omitting (3)
produces the same finding five times. Letting lanes write files makes several agents race one ledger.

## Step 7: Assemble

1. **Dedupe** on `(file, rule)`, keeping the highest severity and the lane that owns it.
2. **Drop** any finding with an empty `evidence` field, and any that duplicates a green check.
3. **Check coverage.** Each lane returns `files_read` against `files_in_scope`. Under 80% read in full,
   dispatch the unread rest as a new shard before writing the report. A "partial" footnote is not
   coverage.
4. **Reclassify.** Anything marked `major` that is really "I'd have built this differently" becomes
   `design` and moves to the owner section as a question. Agents are bad at this call; make it
   yourself, on every row.
5. Write the report.

**Verdict:**

- `RED`: any `blocking` finding, or any check `fail`.
- `YELLOW`: any `major`, any check `error`, **or any lane that truncated or errored**. An incomplete
  lane cannot certify anything.
- `GREEN`: otherwise. `note` and `design` never move the verdict.

## Step 8: Write the findings and hand off

One directory per run, numbered so the path from RED to GREEN stays visible:

```
<review dir>/NNN-<slug>/
├── plan.md        # written at Step 5, before any dispatch
├── context.md     # shared lane input
└── findings.md    # the ledger and the verdict
```

Fill [templates/ledger.md](templates/ledger.md) into `findings.md`. Every section appears even if
"(none)". If the pass deviated from the plan, say so. **A plan quietly abandoned is worse than no
plan**: it reads as coverage that never happened.

Record the run's cost (model, tokens, wall clock) and a per-lane table (model, tokens, tool calls,
duration, findings kept). Those numbers decide the next run's lane count and model.

Print the verdict and path, the top three actions, and the count of `design` rows waiting on the owner.

## Step 9: Improve the instrument

Runs every time. Answer two questions honestly, three lines each:

1. **What did this pass miss?** Anything the owner finds afterwards that a lane should have caught is a
   gap in a brief, not bad luck.
2. **What did it report that was not real?** A false positive costs more trust than a miss. A report
   where a third of the rows are noise is a report nobody reads twice.

Then edit the briefs. Most answers are *already a rule* (so ask why it did not fire) or *once-off* (so
drop it). This step should remove about as much as it adds; more than two or three new lines means it
has misread itself. Where the answer is a rule a grep could hold, put it in a script instead of a
brief: a rule in a brief is paid for by an expensive, fallible reader every pass, a rule in a script is
free forever.

## On running tests

**This pass does not run the test suites.** The tests lane answers what a green run cannot, whether a
test would fail if the code were wrong, by reading the assertions. One named test file may be run to
confirm a specific suspicion. Full runs belong to CI and your release check.

## On screens

**Grade from code by default.** Driving a browser is the slowest thing an agent does. When a lane must
see a screen: one committed walk script, one browser session, waits on a ready selector rather than a
sleep, and a written note of the state the screen needs.

## The builder's self-audit

The sharpest input a reviewer gets is a risk register written by the agent that **built** the code,
for a **different** reviewer. Ask building agents to write one ([template](templates/self-audit.md)).
Three tags:

- `[CLAIM]`: an assertion made from live data or from reading code. **Re-run it.**
- `[JUDGEMENT]`: a decision made without an owner ruling. **Challenge it.**
- `[GAP]`: something knowingly not done. **Decide whether it matters.**

Every `[CLAIM]` carries the command that produced it and a threshold written *before* the measurement:
`Finding if: <threshold>`. That stops an agent rationalising whatever number came back.

If it is missing, the pass still runs; say so in the report. Do not ask the builder to write one after
the review has started: a self-audit written then is a defence, not a disclosure.

## Rules

- **Run it from the main session, never inside a subagent.** Lane completion notices go to the root
  session; a subagent orchestrator can end up receiving none of its lanes' returns.
- **A row is `fixed` only after a confirming round has passed it.** Until then write
  `fixed, unconfirmed`. Rows marked fixed with no round have hidden new defects in or beside the fix.
- **Findings, not fixes.** Never edit code during a pass. Group fixes by cluster, not one per row.
- **No evidence, no finding.** Every row cites `path:line` plus the rule, or a command with its output.
- **A design disagreement is severity `design`** and never moves the verdict. This is the likeliest
  way a pass wastes the owner's time.
- **Never certify a truncated lane.** It forces YELLOW.
- **Do not re-check a green check.** The digest exists for this.
- **The plan is written before dispatch and lands on disk.** A pass that decided what to check as it
  went cannot be audited, and cannot be told what it skipped.
- **Every run ends with Step 9.** The instrument gets better or it decays. When the user names a new
  failure mode, add one line to the relevant lane brief.
