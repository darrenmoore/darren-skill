---
name: grill
description: Interview the user relentlessly about a plan or design until you share an understanding of it, walking each branch of the decision tree, challenging weak decisions and resolving dependencies one at a time, with a recommended answer for every question. Use when the user says "/grill", "grill me", or wants a plan stress-tested before implementation starts.
---

# /grill

Interview the user relentlessly about their plan until you reach a shared understanding. Walk down
each branch of the design tree, resolving dependencies between decisions one by one. Ask the
questions **one at a time**, and give your recommended answer with each.

This interrogates the **decisions**; it is not a read-back of the plan. If your output could be
produced by paraphrasing what the user just said, you are not grilling.

## Step 1: Read the code first

Before asking anything, spend a focused pass on the relevant code, docs and tickets.

- If a question can be answered by exploring the codebase, **explore the codebase instead**. Never
  ask the user something a file already answers.
- Identify the areas the change will touch and the constraints already encoded there: existing
  patterns, naming, size limits, and any project skills or docs that govern those areas.
- Note anything in the code that **contradicts or complicates** the plan. Those contradictions are
  your best opening questions.

## Step 2: Walk the decision tree

Build a mental tree of the decisions the plan implies (scope, placement, data shape, edge cases,
migration, interactions with existing systems) and resolve it branch by branch.

- **One question at a time.** Each answer decides what to ask next. Don't batch a survey up front.
- **Descend before moving on.** When an answer opens sub-decisions, follow that branch down until
  it is resolved, then go back up to the next branch.
- **Recommend with every question.** State your pick and why in a line or two, then ask. The user
  wants an opinion, not a questionnaire.
- **Challenge weak answers.** If the user's call conflicts with the code, the project's docs, a
  decision made earlier in this session or their own stated goal, say so and push back once with
  the concrete evidence. Then accept their final call and move on.

Every question must do at least one of these:

1. expose an assumption the plan silently depends on
2. force a choice between two genuinely different implementations
3. probe an edge case the plan doesn't cover (empty state, conflict, race, partial failure,
   existing production data)
4. confront the plan with something you found in the code
5. resolve a dependency that blocks a later decision

Questions that do none of these are filler. Banned:

- restating part of the plan and asking "right?" or "shall I proceed?"
- preference questions whose answer doesn't change the diff (naming, helper layout)
- anything already answered by the project's agent instructions, skills or the code you read
- re-asking something the user already decided this session

When the choice is enumerable, offer two to four concrete options with your recommendation first,
marked "(Recommended)". In Claude Code the `AskUserQuestion` tool does this; elsewhere, a short
numbered list. When the question is open-ended or confrontational, plain chat. Either way, one at a
time.

There is **no question cap**. Stop when the tree is resolved (every branch has the user's call or
your flagged default), not at an arbitrary count. For genuinely narrow work (a typo, a copy tweak, a
one-line fix), say so, print a two-line agreement and stop.

## Step 3: Print the working agreement

End with a tight summary the user can confirm or push back on:

```
Goal:         <one sentence>
Approach:     <two or three lines on the shape of the implementation>
Decisions:    <a bullet per resolved decision, including ones the user overruled you on>
Out of scope: <what we are deliberately not doing this session>
Open:         <anything unresolved, with your default>
```

Then **stop**. Do not start editing files. The user will say go.

If the work has a plan folder (a spec, a work item, a design doc), you may also write the agreement
there, for example into its decisions table or `QUESTIONS.md` answers. That is the only file you
touch.

## Rules

- **Never start implementation in this skill.** The user holds the next move.
- **Don't re-grill in the same session.** Once the agreement is printed and the user says go, that
  is the spec. New ambiguity mid-implementation is raised inline, not by rerunning the skill.
- **Point at related checks, don't run them.** If a decision touches an area with its own review
  step in this repo (an impact check, docs, translations), name it in the **Open** line.
