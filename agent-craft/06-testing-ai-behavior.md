# Test in two layers, and freeze every failure.

**Principle:** Test AI behaviour at two layers. (1) **Deterministic**: stub the model with a fixed
reading and assert what the code does. Runs in CI, no API key. (2) **Live eval**: call the real model K
times, behind a marker that is off by default and excluded from CI. Then freeze every diagnosed
failure as a regression case.

**Why it matters:** A nondeterministic API call in CI makes the suite flaky and the failures
unactionable. But all the code *around* the model (routing, grounding, suppression, state transitions)
can be tested deterministically, and the model itself must be evaluated on a cadence. Mixing the layers
gives you flaky CI or untested intent. A fix without a frozen regression silently un-fixes itself on
the next prompt tweak or model change.

## Do
- Stub the model with a fixed reading and assert which step it routes to, what it grounds, what it
  suppresses.
- Gate live-model tests behind a marker (e.g. `live_llm`) that CI deselects.
- Run live evals on a cadence and before any model or prompt change.
- Freeze each diagnosed failure as a named case holding the **exact input** that broke it.
- Keep a deliberately RED case visible when a behaviour is diagnosed but undecided. RED with evidence
  attached is a to-do, not a failure to hide.
- Test what scripted replays can't see: **crash-resume** (kill a turn between a side effect and its
  checkpoint; assert exactly-once on resume), **concurrent turns** on one thread, and **schema
  evolution** (a checkpoint from the last release runs on current code). All deterministic.
- Grade the **first causal defect** as the root ([10](10-causal-evaluation.md)).
- **Gate a refactor with golden files, not substring checks.** Pin every prompt payload, per-turn
  brief and function schema byte for byte, with content, settings, date and clock frozen. A substring
  assertion passes while the rest of the prompt drifts. When a golden file goes red, read the diff
  before regenerating; if the change is intended, regenerate in the same commit and say so.

## Climb the regression ladder

Stop at each rung until it is green; only then pay for the next:

1. focused deterministic test at the faulty seam;
2. affected step and route integration tests;
3. real-model K-run at the semantic seam;
4. the complete affected conversation, with downstream state and side effects;
5. the broad or full corpus.

A focused failure should abort before the expensive corpus. Any behaviour change after rung 5
invalidates it until the affected rungs re-run.

## The stub is a hypothesis

A deterministic test feeds a *scripted* model output. That proves the code handles the output you
**imagined**, not the output the model **produces**, and those differ exactly where the bug lives.

Real incident: a one-word answer to "which product?" was "fixed" three times. Each round shipped a
green test that scripted the extractor's output, declared done, and asked the user to try it. The third
round finally ran the real model and found it emitted an **extra field** the scripts never included: a
confident "matched" verdict the code trusted, bypassing the catalogue lookup. The scripts were the
blind spot because they encoded the author's assumption.

- A model-facing fix is **not verified** until the real model has run on the real input and you have
  read its actual output, field by field, against what your fixture assumed.
- **Never make the user your test harness.** If you're about to say "it's fixed, go test", you haven't
  verified it. Drive the failing conversation through the running system yourself.
- If you can't run the whole channel end to end, run the narrowest real-model slice you can (the
  extraction call, the classifier call) in the real runtime and print the raw output.

## Don't
- Mock the model and claim you tested *intent*. You tested code.
- Run live, key-consuming evals unguarded in CI.
- Fix a bug without leaving a regression case.
- Let a RED case rot unlabelled. An unexplained RED trains people to ignore RED.
- Call content-presence, startup key validation or a mocked renderer an answer test. Prove
  select → render → ground → record → send from realistic state.

## Grading rounds that gate a rollout
- **Independent grader agents, one per packet**, given only the grading brief and their packet: never
  the agent that built or fixed the bot, never another grader's output.
- **Exclusions are pre-declared only.** A grader inventing an exclusion mid-run gets the turn back.
- **Pre-declared red flags** in each packet make the worst behaviours impossible to talk around.
- **The orchestrator rebuts with evidence, never re-grades.** The ledger keeps the original grade; the
  report carries the rebuttal.
- **Harness summaries must count silent failures.** A summary that only counts check flags prints the
  same line for "all clean" and "all dead". Count floors, handoffs and silence beside the flags.

**Smell test:** *"If this bug comes back, will a test catch it, and is the model itself on an eval
cadence, not just the code around it?"*
