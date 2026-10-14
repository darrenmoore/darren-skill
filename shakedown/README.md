# shakedown

Runs several read-only review agents in parallel over finished work, each checking it against one of the repo's standards, and merges their findings into one ledger with a GREEN/YELLOW/RED verdict.

Type: skill, agent

## Files
- `SKILL.md`: the orchestrator: sizing, plan, dispatch, assembly, verdict, and the self-improvement step.
- `standard-list.md`: starter list of standards every pass walks; replace the rows with yours.
- `lanes/tests.md`, `lanes/drift.md`, `lanes/copy.md`: three example lane briefs.
- `lanes/writing-a-lane.md`: how to write a lane for your own standards.
- `templates/lane-prompt.md`: the prompt each lane subagent receives, with the JSON return schema.
- `templates/plan.md`, `templates/ledger.md`: the plan written before dispatch and the findings ledger.
- `templates/self-audit.md`: risk register the building agent writes for the reviewer.

## Adopt it
Paste this into your agent:

> Read shakedown at https://github.com/darrenmoore/darren-skill/tree/main/shakedown. Don't install it yet. Read every file in it first, then look at how this repo already works: our skills, hooks, conventions and the way we ship. Tell me what it does, whether it fits here, what it overlaps with, and what you would change so it suits our work. Wait for me to decide before you add or adapt anything.

Needs an agent that can dispatch parallel subagents, your own standard list and lane briefs, an automated checks command, and a folder for review runs.
