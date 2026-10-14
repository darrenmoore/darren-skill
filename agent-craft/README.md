# agent-craft

Rules for building LLM agents: prompts, context, model choice, evals, intent routing, conversation control and multi-agent flows, each tied to a production incident.

Type: skill

## Files
- `SKILL.md`: pre-flight checklist, the code-vs-model discriminator, and an index of the docs.
- `00-before-you-build.md`: diagnose and localise to CODE / PROMPT / MODEL before changing anything.
- `01-change-the-least.md`: smallest fix inside the proven layer; subtract before adding.
- `02-intent-is-the-llms-job.md`: never regex human language; one seam for user-visible output.
- `03-grounding-and-fallbacks.md`: every fact from context, post-checks, fail closed.
- `04-models-and-evaluation.md`: K-run evals, model sweeps, eval/production parity.
- `05-multi-agent-orchestration.md`: one agent one job, routers in code, when to fan out.
- `06-testing-ai-behavior.md`: deterministic vs live layers, the regression ladder, golden files.
- `07-state-and-context.md`: typed bounded state instead of transcripts; schema evolution.
- `08-conversation-control.md`: bursts, duplicates, concurrency, loops, handoff lifecycle.
- `09-side-effects-and-copy.md`: mediated idempotent writes; versioned user-facing copy.
- `10-causal-evaluation.md`: grading replayed conversations by root cause.
- `11-generated-content.md`: ledgers, prompt budgets, repetition and fallbacks for generated content.

## Adopt it
Paste this into your agent:

> Read agent-craft at https://github.com/darrenmoore/darren-skill/tree/main/agent-craft. Don't install it yet. Read every file in it first, then look at how this repo already works: our skills, hooks, conventions and the way we ship. Tell me what it does, whether it fits here, what it overlaps with, and what you would change so it suits our work. Wait for me to decide before you add or adapt anything.

Pairs with agent-fault for the step-by-step diagnosis of one bad turn.
