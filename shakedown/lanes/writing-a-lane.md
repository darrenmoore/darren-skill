# Writing a lane for your own standards

A lane is one reviewer holding one standard. Add one when a class of mistake keeps reaching the owner
and no script can catch it. Good candidates: screens and styling, API or service layering, money and
numbers, security, migrations, accessibility.

## The shape

Copy one of the example lanes and keep these sections, in this order:

1. **Title as a question.** "Is the service layer sound?" One question per lane. If you need "and",
   you have two lanes.
2. **You review. You do not edit.** Say it at the top.
3. **NOT yours.** Name the neighbouring lanes and what they own. This is what stops five agents
   reporting the same finding in five wordings. Every row of `standard-list.md` has exactly one lane.
4. **What is already automated.** List the checks whose results arrive in the digest, so the lane does
   not redo them.
5. **Method.** Numbered steps, each concrete enough to act on: what to grep, what to open, what
   question to ask of it. Lead with the check that catches the most real bugs.
6. **Severity.** Examples of `blocking`, `major`, `note` and `design` *for this lane*. Without them,
   agents score taste as `major`.
7. **Output.** What evidence a finding in this lane must carry (the quoted string, both sides of a
   disagreement, the mutation a test would miss). Pick the one thing that makes a finding actionable.

## Then

- Add the lane to the table in `SKILL.md` with its triggers (paths or patterns).
- Add its rows to `standard-list.md`.
- After each pass, Step 9 decides what to add or cut. Add one line per real miss. If a rule could be a
  grep, move it to a script and delete it from the brief.

Keep a lane under about 130 lines. Length is the main way a brief fails: a reviewer skims a long one
and misses the rule that mattered.
