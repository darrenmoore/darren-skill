---
name: agent-craft
description: Rules for building, extending, debugging and reviewing LLM agents and LLM-backed features (chat bots, intent classifiers, extractors, generated content), covering prompts, context, model choice, evaluation, intent routing, conversation control, side effects and multi-agent flows. Use before agent work, especially when a bot misroutes, says the wrong thing, needs a new intent, repeats itself, or when choosing between a code, prompt, context or model change.
---

# agent-craft: building LLM agents that earn trust

You are about to work on an **LLM agent**: a system where a model reads human language and acts. A
coding agent's default instinct is to **add code**. That instinct is usually wrong here. An LLM agent
fails mostly at *reading*, *wording*, *grounding* and *model choice*, not at control flow. The job is
to fix the right layer with the **least** change, and to prove it.

**Read the relevant doc before you start**, not after you've written code.

## Pre-flight: run this before you touch anything

1. **Diagnose, don't guess.** Reproduce the failure, then trace the semantic contract end to end:
   **raw input → typed model output → validation/repair → normalisation/projection → router →
   answer/side effect → final reply**. Feed known-correct output into each seam until the meaning
   changes; only then name **CODE / PROMPT / MODEL**. → [00](00-before-you-build.md)
2. **Map the flow before changing it.** Record the entry and exit, every step that reads meaning from
   a model, every projection, side-effect step, cycle and handoff path. A tour of source files is not
   a flow review. → [00](00-before-you-build.md)
3. **Change the least inside the proven faulty layer.** Within that layer prefer prompt/few-shots →
   context → model/temperature, or the smallest code correction. Prefer subtraction. → [01](01-change-the-least.md)
4. **Is this about what the user MEANS?** Then the model owns it. **Never** regex, keyword-match or
   fuzzy-match human language. → [02](02-intent-is-the-llms-job.md)
5. **Does it touch a fact or number?** Ground every value in resolved context; missing context **fails
   closed**; every model call has a deterministic fallback. → [03](03-grounding-and-fallbacks.md)
6. **Did you measure?** K runs on the real production seam, eval/production parity, roots separated
   from cascades. → [04](04-models-and-evaluation.md), [10](10-causal-evaluation.md)
7. **Does it need more than one model call?** One agent, one job; **routers are pure code**; fan out
   only for a reason. → [05](05-multi-agent-orchestration.md)
8. **How is it tested and frozen?** Climb the regression ladder. Freeze every diagnosed failure. A stub
   is a hypothesis: run the real model on the real input and read its output field by field. **Never
   hand verification to the user.** → [06](06-testing-ai-behavior.md)
9. **What does the prompt see?** Build it from typed, bounded state; keep one authoritative reading
   per turn. → [07](07-state-and-context.md)
10. **What does the channel throw at it?** Bursts, duplicates, concurrent turns, stalls, handoffs: each
    needs a **declared policy**. → [08](08-conversation-control.md)
11. **Does it write live data or speak managed copy?** Writes are mediated, whitelisted and idempotent.
    Copy is proven by reaching the user, not by existing in a table. → [09](09-side-effects-and-copy.md)
12. **Does it generate content people read repeatedly?** Ledger every attempt, measure the prompt,
    check authored copy before blaming the model, and read the fallback. → [11](11-generated-content.md)

## The one idea behind all of them

> **The model speaks; the state machine steers; typed meaning survives every seam.**
> Decisions about *meaning* go to the model and are fixed in the prompt, few-shots, context or model,
> usually by removing code. Decisions about *control and safety* stay in deterministic code, kept
> minimal. When you can't tell which kind of decision you're making, that ambiguity is the bug to
> resolve first.

## The discriminator

| The decision is about… | …so the lever is | …and the change is usually |
|---|---|---|
| what the user **means** (intent, wording, language) | the **model** (prompt / few-shots / context / model) | **remove** code; add examples |
| what we **do** about it, or a **safety** rule | **code** (a pure router or step) | a **small**, single-purpose addition |
| the model read it correctly but meaning changed later | validation / projection / routing **code** | preserve the typed result; delete broadening defaults |

If you're adding code to decide what a human meant, stop: doc 02.
If you're adding a model call to make a control decision, stop: doc 05.

## Fast do / don't

| Situation | Do | Don't |
|---|---|---|
| Model returns `refund_too_slow`; projection turns it into generic `refund` plus escalation | Fix the projection and freeze the narrow and mixed cases | Tune the prompt: the model already read it correctly |
| An approved answer exists in the content store | Drive a realistic state through select → render → ground → record → send | Call the answer "working" because the row exists |
| Replay diverges from the recorded human operator at turn 4 | Grade roots up to the divergence, or run the rest closed-loop | Mark turn 5 RED for lacking facts only the historical operator supplied |
| Code changed after the "final" full replay | Re-run affected conversations and the required corpus | Reuse the old green report as final evidence |

## Related

- **agent-fault** (sibling item): the step-by-step procedure for localising one bad turn to CODE,
  PROMPT or MODEL. This skill is the *why* and the rules; that one is the drill.
- **A test-driven-development skill**: RED-first still applies; doc 06 adds the deterministic vs
  gated-live split.
- `<your orchestration library's docs or skill>`: how to wire nodes, state and checkpoints. This skill
  is *what* to build and *what not to*.

## When NOT to add to this skill

These docs are principles, not a changelog. Add a doc only for a durable rule about building agents,
grounded in a real incident. Project specifics belong in that project's docs.
