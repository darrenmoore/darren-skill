---
name: improve
description: Turn what went wrong in this session into rules the next agent won't have to relearn, and catch skills and runbooks that have gone stale against what shipped. Reviews the session's mistakes and the user's corrections, updates AGENTS.md (or CLAUDE.md) and the skills, and compacts what is already there. Use when the user says /improve, asks what could be improved about how we work, when the improve-nudge Stop hook asks for a triage, or at the end of a piece of work that hit friction.
argument-hint: [nothing, it reads the session you just had]
user-invocable: true
---

# /improve: fix the instructions, not the work

The docs are read by a machine, on a clock, before it does the work. Every line
that doesn't change a decision costs the next agent attention it needed
elsewhere. This skill adds what is missing and **removes more than it adds**.

The `improve-nudge` Stop hook (Claude Code only, `hooks/improve-nudge.mjs`) asks
for Steps 1 to 3 as a triage once per session, after the session's first real
commit or production action. "Nothing worth writing down" is a complete answer
to it.

## The conventions this skill enforces

Fill in the parts in angle brackets for your repo.

- **Two kinds of surface.** `AGENTS.md` (or `CLAUDE.md`) is always loaded, so
  every line is paid for on every task. A `SKILL.md` and its sibling files load
  on demand, so length there is cheap. Prefer moving detail into a skill over
  leaving it in `AGENTS.md`.
- **Budgets, in words** (`wc -w`). Suggested start: `AGENTS.md` 2,500 hard, a
  `SKILL.md` 4,000 soft (over it, say why in the skill). Write down where they
  are enforced, or "enforced by: nothing".
- **One home per rule.** A rule lives in exactly one file and everywhere else
  links to it. Two copies drift, and an agent follows whichever it opened first.
- **`AGENTS.md` carries three things:** routing (which skill a task belongs to),
  facts about this repo with no other home, and traps (a specific way this repo
  bites, with the bite named). Workflow steps belong in the skill that runs them.
- **Generated files are not edited.** If skills are mirrored from one source
  folder to each agent's folder, edit the source: `<your skills source folder>`.

## Step 1: list what went wrong

From this session only. For each: what you did, how it was caught, how you
fixed it. Be specific: a file, a number, a line.

Most failures are one of these, so check each:

- **The user corrected the output**: wording, a design choice, an approach.
- **A wrong verdict or claim to the user**, even when their question caught it
  before anything went out. A claim reversed on a follow-up question is a
  mistake, not a near miss.
- **A number was wrong or misleading**: a count, a rate, a claim of cause.
- **A fact was invented** to make a sentence or a plan flow.
- **A workflow step was skipped or done in the wrong order**: a check, a build,
  a sync, a changelog line.
- **Something went out that shouldn't have**: a secret, an internal name, an
  unannounced feature.

**Include the ones nobody noticed.** A mistake you caught yourself is the
cheapest evidence there is and the most likely to repeat.

Skip anything that cost nothing and changed nothing.

## Step 2: check what the session relied on against what shipped

Many wrong answers come from a skill or runbook whose facts moved, not from a
missing rule. For each skill or runbook you followed this session:

```bash
git log -1 --format=%cd --date=short -- <file>           # when it last changed
git log --oneline --since=<that date> -- <the code it describes>
```

Name any shipped change that alters a decision the file makes: a new outcome, a
guard that now exists, a bug that's fixed, a tool that grew a flag. Grep the
code to confirm it before you write it down.

## Step 3: decide what's worth writing down

For each mistake, one of three answers:

| | |
|---|---|
| **Already a rule** | You broke a rule that exists. Don't restate it. Ask why it didn't fire and fix *that*: usually a missing order of operations, or the rule living somewhere you never opened |
| **A real gap** | Nothing covers it, or the rule's facts moved (Step 2). Write it |
| **Once-off** | A typo, a tool slip, something with no general shape. Drop it |

Most mistakes are the first or third. **A session that produces more than two or
three new rules has misread its own mistakes.**

A **tool bug found mid-session** (a dry run that misreads input, a script that
mangles some characters) is fixed, not documented. A note saying "the dry run
is wrong here" gets rediscovered by the next agent. If the fix is code, it is
its own commit (`/chore`) or ticket.

### Amend, remove, delete, or leave

Most of what you find wrong is not a missing rule; it is a rule whose facts moved.

| Action | When | Guardrail |
|---|---|---|
| **Amend** | The rule is right, its facts moved: a renamed file, a changed number, a script that grew a flag | Grep to confirm the new fact first. A corrected rule that's still wrong is worse than the stale one, because it looks fresh |
| **Remove** | The rule is real but lives in two places | Delete one, link to the other. Never delete both, never leave two "authoritative" copies |
| **Delete outright** | A tombstone: a prohibition whose target is gone, a note about a folder that no longer exists | Only with a grep showing zero live occurrences. Quote it when you report |
| **Leave** | A recorded owner decision, or a rule with a live failure behind it | Raise it with the owner; don't edit it away |

## Step 4: write it, short

- State the rule, then what breaks without it, then where it's enforced. Say
  "enforced by: nothing" when that's true. It is a warning, not a gap.
- Keep one measured number or one real example as the evidence (`3 of 4 verdicts
  reversed`, `450 files swept into a one-file commit`). Drop the anecdote.
- Use a do/don't list where the content is a list.
- Put it where it's read. Build this table for your repo:

  | The rule is about | Its home |
  |---|---|
  | A step in a workflow | the skill that runs that step, not `AGENTS.md` |
  | Code shape, size or placement in one area | `<that area's conventions skill or doc>` |
  | Wording or tone the user rejected | `<your style guide or banned-phrases list>` |
  | A fact about this repo with no other home | `AGENTS.md` |
  | A user preference not recorded in the repo | `<your agent's memory, if it has one>` |

Don't:
- Re-explain what the code or a script does. The agent can read it.
- Tell the story. Keep the number, drop the anecdote.
- Add a rule you can't name a failure for.
- Repeat a rule in two files. One home, link to it.
- Soften it. "Consider whether" isn't a rule.

## Step 5: compact what's already there

**This is the half people skip, and it is why the docs grow.**

**Every round removes something. If you only added, you did half the job.** A
round that adds a real capability can grow the total; the rule is that you
looked, and cut what you found. **Report lines added and lines removed.**

Look for:
- The same rule in two files. Delete one, link.
- A rule whose subject no longer exists. **Grep before deleting.**
- A path, script or skill named in prose that has since been renamed.
- Three examples where one carries the point.
- Narrative that survives only because somebody enjoyed writing it.
- A hand-kept number or table a script could generate. Generating it beats
  correcting it; correcting it beats leaving it wrong.
- A plan or "suggested order" section where everything is done.
- A skill listed in `AGENTS.md` that no longer exists, or one that exists and
  isn't listed.

**Never delete the measurement.** A rule with its evidence stripped is a rule
somebody argues with next month. Compress the story to the figure; keep the
figure.

**You may be a better model than the one that wrote this.** Prose written to
walk a weaker reader through a decision can often be cut to the decision. What
you may not cut is a *fact*: a number, a filename, a recorded owner decision,
however verbose its sentence.

## Step 6: prove it

- If you touched a skill, edit it at its source and run `<your skills sync
  command, if you mirror skills>`.
- If you added a pattern to a checker, run the checker on a file containing it
  and see the hit.
- `git diff --stat` on the files you touched: report lines added and removed.
  If the docs grew, justify it or cut again.
- `wc -w` every always-loaded file or skill you touched, against the budgets.
- **Commit on its own with `/chore`**, staging only your files. Never fold an
  instruction change into a feature commit: it becomes invisible in `git log`
  and impossible to revert cleanly. Other sessions edit the same files: if one
  already had someone else's uncommitted changes, say so and leave that commit
  to the user. Don't push.

## What this skill may not do

- Invent a rule from a near miss. No failure, no rule.
- Record a preference as a law. If nobody has ruled and nothing broke, it isn't
  a rule. One remark is a remark; ask before turning it into a rule.
- Reverse an owner's recorded decision. Bring it up instead.
- Touch the work. This is instructions only. A rule that needs a test or a code
  change is its own commit or ticket.

## The test of a good round

The next agent reads less and gets it right sooner. If your round made the docs
longer and the rules softer, it made things worse.
