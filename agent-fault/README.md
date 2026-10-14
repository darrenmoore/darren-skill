# agent-fault

When an LLM agent does the wrong thing, works out whether the code, the prompt or the model is at fault, with evidence, then fixes that layer RED-first.

Type: skill

## Files
- `SKILL.md`: the procedure: read the trace, confirm the expected behaviour, capture the pre-turn state, run a fed-reading code probe, K-run live probe and model/prompt sweep, then fix, freeze and report.

## Adopt it
Paste this into your agent:

> Read agent-fault at https://github.com/darrenmoore/darren-skill/tree/main/agent-fault. Don't install it yet. Read every file in it first, then look at how this repo already works: our skills, hooks, conventions and the way we ship. Tell me what it does, whether it fits here, what it overlaps with, and what you would change so it suits our work. Wait for me to decide before you add or adapt anything.

Needs a place where turn traces live, a way to capture one turn's pre-turn state, and a probe that can inject a fixed model reading into your routing code. The skill lists what to build if you have none of these yet. Pairs with agent-craft.
