# One agent, one job. Call a second model only for a reason.

**Principle:** One step or agent has one responsibility. Routers are pure code, with no model call
inside. Fan out to more than one model only to decompose, to verify independently, or to scale; never
by default. Between agents the contract is typed.

**Why it matters:** Chained or overlapping model calls multiply latency, cost and nondeterminism, and
make failures impossible to localise: when the turn is wrong, which agent was wrong? Most "multi-agent"
needs are one classifier, pure routing and one drafter. Code that steers is debuggable; a model that
steers is a guess wrapped around a guess.

## Do
- Keep **classify / route / draft** as three separate single-purpose steps.
- Make the router a **deterministic function of the model's structured output**: fixed thresholds,
  fixed branches.
- Use a second model to **verify** a high-stakes output adversarially: it tries to refute, not to
  re-answer.
- Give each fanned-out agent a **distinct lens** when you do decompose (research, review).
- **Cap and justify** any fan-out. Write down why one classifier plus code can't do it.
- Pass typed contracts between agents, not free text.

## Don't
- Put the intent decision inside the router. The router consumes the reading; it doesn't make it.
- Call N agents where one classifier plus code does the job.
- Let agents hand off to each other on free-text contracts.
- Add an "orchestrator agent" for control flow that code should own.
- Have one agent re-derive another's work. Verify it, or trust the typed contract.
- Fan out to "be thorough". Thoroughness is more evals, not more calls.

## Why the split pays
A turn built as classify → route → draft (plus a code post-check) lets you say whether a bad turn was
CODE, PROMPT or MODEL, because each seam has one job and a wrong turn lands in exactly one of them.
Collapse classify and route into one "router agent" and the same failure becomes unlocalisable.

When you do fan out for research or review, refuting beats re-answering. Two models answering the same
question are two correlated guesses; one trying to break the other's claim is an independent test.

**Smell test:** *"Does this need a second model call to decompose, verify or scale, or am I adding
agents where code should steer?"*
