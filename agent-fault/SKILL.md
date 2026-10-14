---
name: agent-fault
description: Localise one bad LLM-agent turn to CODE, PROMPT or MODEL with evidence instead of guessing, then fix it RED-first with a frozen regression case. Use when a chat agent or LLM pipeline misrouted, escalated when it should have answered, went silent, or said something wrong; when the user pastes a conversation or trace id and asks "why did the bot do X", "is this a code or prompt bug", "debug this thread"; or before deciding whether to patch code, the prompt or the model.
---

# agent-fault: is it the code, the prompt or the model?

When an agent turn misbehaves, the cause is almost always one of three layers:

- **CODE**: routing, suppression gates, validation, projection, the steps after the model.
- **PROMPT**: the model was asked an ambiguous question and answers it inconsistently.
- **MODEL**: the model consistently cannot read it, and a stronger one can.

This skill localises the fault to one layer with evidence, then fixes only that layer. The rules
behind it (why not to guess, why change the least) are in the sibling **agent-craft** skill.

## Set up once

Fill these in for your stack. If a piece is missing, building it is the first job; a capture step and
a fed-reading probe pay for themselves on the second bug.

- `<trace source>`: where a past turn's inputs, model calls and state live. Your checkpointer, your
  conversation store, or a tracing tool (for example LangSmith, if you run LangGraph).
- `<capture>`: a way to freeze one turn's **pre-turn** state and input into a case file.
- `<code probe>`: run the real router and downstream steps with a **fixed** model reading injected.
  Deterministic, no API key.
- `<live probe>`: call the real model K times on the frozen input with the production prompt.
- `<sweep>`: the same live probe across models and prompt variants.
- `<cases dir>`: where frozen cases live as regression tests.

## Step 1: Load the conversation and read it

Get the end-to-end state from `<trace source>`. Review in this order and **write down** what you see:

1. **The turns.** Read the whole conversation. Mark the turn where behaviour diverges from what a good
   human operator would do.
2. **Stage and status fields.** Is the state where the conversation says it should be?
3. **Linked records.** Is it attached to the right customer, order, account? Empty when it should be
   full? Did it change identity mid-thread?
4. **Control mode.** Is the bot deliberately silent because a human owns the thread? "The bot went
   silent" is often a handoff policy working as designed.
5. **The failing turn's trail.** Its route, reason codes and model calls, with their raw structured
   outputs. These are the "why".

## Step 2: Confirm the expectation (hard gate)

Do not plan anything until you can state, and the user confirms:

- **Expected:** what should the bot have done on the failing turn, in one sentence?
- **Observed:** which turn, and what it did instead.
- **Scope:** one phrasing, or a class of messages? Which languages?

If the user's report conflicts with the agent's declared policy (handoff rules, things it must not
do), surface the conflict: it may be a policy decision, not a bug. Ask only questions that change the
fix; if the thread makes it obvious, state your reading and ask for one confirmation.

## Step 3: Capture and label

1. **Capture the pre-turn state. Never reconstruct it by hand.** The latest checkpoint is usually the
   state *after* the turn; if the failing turn mutated state (an escalation, a stage move), step back
   one checkpoint, or reset the mutated fields and say so in the case description.
2. **Label the correct outcome.** This is the human's call; the tool never guesses it. Two blocks:
   - `expect_reading`: what the model **should** produce: the intent, the extracted fields, and any
     flags. Correctness is the *whole* reading. A risk flag that overrides the answer path forces an
     escalation even when the intent is right.
   - `expect_outcome`: what the code **should** do given that reading: route, escalation status,
     reply suppressed or not, text the reply must or must not contain.

## Step 4: Localise, deterministic first

1. **Code probe.** Feed the *correct* reading into the real router and steps.
   - Wrong outcome anyway → **CODE**. Fix the named locus. No model work needed.
   - Right outcome → the code is correct given the right reading. Go on.
2. **Bisect the seams if there are several.** A reading can be correct out of the model and corrupted
   by validation, repair, normalisation or projection. Feed the captured real output into each consumer
   in turn; where meaning first broadens, drops or contradicts the reading is **CODE** ("projection
   corruption"), even though it looks like a misclassification.
3. **Live probe, K times** (around 10-12 for a diagnosis; one call cannot tell wrong from flaked):
   - **unstable** (mix of right and wrong) → **PROMPT**. The boundary is ambiguous; tighten it.
   - **stable wrong** → PROMPT or MODEL. Sweep.
   - **non-reproducing** (right every time) → re-check the captured inputs: context, recent turns,
     the model id production actually resolved. Or it was a tail flake; record the rate.
4. **Sweep** prompt variants × models:
   - a prompt variant fixes it on the production model → **PROMPT** (cheap fix);
   - only a stronger model fixes it → **MODEL**;
   - nothing fixes it → **TAXONOMY**: the intent boundary itself is wrong, or the behaviour is
     escalate-by-design.

Write down which seam each probe actually drove. A probe that only covers classification proves nothing
about extraction or projection. Don't label an untested seam PROMPT or MODEL because the tool stops one
step early.

The verdict names the layer. Do not overrule it with a hunch.

## Step 5: Plan the smallest change in that layer

- **PROMPT** → few-shots, the intent list, instructions. First look at what is actually *sent*:
  payload, context, truncation. If the fault is in a fact the bot says, the fix may be in the content
  store, not the code.
- **CONTEXT** → what the prompt sees (typed state, allowed numbers), not the prompt wording.
- **MODEL** → only with K-run evidence across models. Never pin a model only in tests.
- **CODE** → one single-purpose change to the step or route the probe named. Prefer deleting a
  mechanism to adding one.

State the plan as before / after: what was happening, what changes, what happens after, what risk
remains. Get a go unless the fix is small and reversible.

## Step 6: Fix RED-first and prove it

1. **RED.** The frozen case must fail before the fix. Watch it fail.
2. **GREEN.** The minimal change.
3. The case stays in `<cases dir>` permanently.
   - CODE fix → the deterministic probe goes green.
   - PROMPT fix → the live probe reaches stable correct (about 90%+ of K runs, with no spurious flags).
4. Run the focused suites for that stage. Only known-failing tests may fail.
5. If the prompt or model changed, run your live eval gate (K≥3 across the corpus) before it lands.
6. **Re-drive the original conversation** through the running system and confirm the failing turn now
   does what Step 2 confirmed. Never hand this check to the user.

## Step 7: Report

Only after Step 6 is fully green:

```
agent-fault: <conversation id> FIXED AND VERIFIED

Fault: <one sentence: what was happening>
Layer: <CODE | PROMPT | CONTEXT | MODEL | TAXONOMY> (probe verdict: <verdict>)
Fix:   <one sentence: what changed> (<commit>)

Before: <failing turn: user said → bot did>
After:  <same turn: user said → bot now does>

Proof:
- Regression frozen: <case path>
- Focused suites: <N> passed, known failures only
- Live eval gate: <held (K=?, floor ?) | not required (no prompt or model change)>
- Re-driven conversation: <one line>

Follow-ups: <none | each deferred item and where it is recorded>
```

If the investigation shows the bot behaved **correctly** (policy working as designed), stop after
Step 4, say so with the evidence, and propose a policy change instead of "fixing" designed behaviour.

If the failure taught a durable rule about building agents, add it to agent-craft (its "when not to
add" bar applies).
