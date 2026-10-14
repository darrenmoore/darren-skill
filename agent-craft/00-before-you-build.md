# Diagnose before you code.

**Principle:** Reproduce the failure and localise it to CODE / PROMPT / MODEL before changing
anything. Never patch by guessing.

**Why it matters:** Your first instinct as a coding agent is to edit code, because code is the layer
you can see and change with confidence. In an LLM agent a wrong behaviour usually isn't where you'd
guess. The same symptom, "the bot said the wrong thing", can live in three layers, and each needs a
different fix: a deterministic code gate, an ambiguous prompt boundary, or raw model capability. Pick
the wrong layer and you add a branch that masks one example while the real fault keeps firing on the
next phrasing, and the codebase now carries a special case that lies about where the bug was.

## Do
- Reproduce deterministically first. Freeze the failing input and its pre-turn state as a fixture so
  you can re-run the exact turn at will. A bug you can't replay is a bug you can't prove you fixed.
- Localise the layer before touching anything (method below, and the agent-fault procedure).
- Edit only the layer the localisation names. MODEL → see [04](04-models-and-evaluation.md); don't fake
  it in code.
- Freeze the localised case as a regression fixture.
- State the layer out loud before you change a file: "this is CODE because X." If you can't finish
  that sentence, you're still guessing.

## Don't
- Don't edit code on a hunch because code is the layer you're comfortable in.
- Don't add a special-case branch for one example ([01](01-change-the-least.md)). One green example is
  a mask, not a fix.
- Don't trust a single live model run. One run tells you almost nothing about a probabilistic boundary.
- Don't skip reproduction because it "looks like a one-liner". Cheap-looking fixes are the ones that
  land in the wrong layer.
- When *everything* fails at once on shared or starved hardware, suspect the environment before the
  diff. Probe outside-in (raw model call → single step → full harness) before reading code. An
  all-error round can be resource starvation with nothing wrong in the diff.

## The method: bisect every semantic seam

The classifier is only the first testable seam. A structured reading can be correct and still be
corrupted by validation, repair, normalisation, projection, precedence, routing or answer selection.

1. Write the expected semantic contract for the failing turn.
2. Capture the real structured model output. Do not infer it from the final reply.
3. Feed known-correct output into the first real consumer, then feed each intermediate output forward.
   Stop where meaning first broadens, drops or contradicts the typed result. That seam is **CODE**.
4. If correct output survives every consumer, call the real model K times on the frozen input.
   - Flip-flops across runs → ambiguous boundary → **PROMPT**. Tighten the boundary; don't branch
     around it.
   - Consistently wrong → **PROMPT or MODEL**. Sweep models: if a stronger model gets it right, the
     weaker one needs more prompt scaffolding (or the stronger model). If every model fails the same
     way, it's a capability gap or the intent boundary itself is wrong.

Call a model-correct, code-wrong case **projection corruption**. It is a CODE defect even when the
symptom looks like a misclassification.

## Map the flow first

Before changing an agent's flow (a graph, a chain, a state machine), inspect the compiled or
assembled topology, not just the source files, and record: entry and exit; step and edge count; every
step that reads meaning from a model; every validation, normalisation, projection and precedence seam;
side-effect and finalisation steps; cycles and their bounded exits; handoff paths in both directions.
Then trace the failing path on that map.

## Probe coverage is evidence, not a promise

Write down which seam your probe actually drives. If it covers classification but the failure is in
extraction or projection, capture the real structured output and feed it through those consumers by
hand. Do not label an untested seam PROMPT or MODEL because the tool stops one step earlier.

## When quality plateaus, measure the output layer's freedom

Bisection finds *bugs*. A **plateau** needs a different question: how much of what the user reads was
actually written for this conversation? In one support-style agent, months of routing work moved the
score not at all because almost every reply paragraph was verbatim template text. No routing fix can
move a score whose ceiling is the output layer. The cheap decisive experiment is a blind side-by-side
grade of candidate replies against a human reference. And when you fix the loudest layer, expect the
bottleneck to move down one: better replies exposed state bugs that bad replies had been masking.
Budget that follow-up round.

## Examples

- **"I have more questions" after a handoff → silence.** Feeding the correct intent through the code
  path still produced silence: a suppression gate killed every post-handoff turn. **CODE.**
- **"Seems a bit expensive" → escalated to a human in about 30% of runs.** The code was fine given the
  right reading; K runs showed a risk flag over-firing on an ambiguous phrase. **PROMPT.** A single run
  would have shown pass or fail and lied about which.
- **Typed objection `fee_too_high` → generic fee answer plus escalation.** The model's output was
  right; projection code broadened it. **CODE (projection corruption).**

## Smell test
"Do I know which layer is wrong, or am I guessing?" If you can't name CODE / PROMPT / MODEL and point
to the evidence (a fed-correct-reading result, a K-run rate, a model sweep), you haven't diagnosed yet.
