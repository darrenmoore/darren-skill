# Evaluate conversations causally: roots, cascades and readiness.

**Principle:** Replaying recorded conversations is trustworthy only while the tested bot sees the same
context the recorded conversation had. Once its action diverges, later turns that depend on the
historical operator's words are neither independent REDs nor GREENs. Stop at that causal frontier,
substitute the missing context explicitly, or continue closed-loop.

## Choose the evaluation mode

- **Open-loop replay:** feed recorded user turns while the bot stays on the recorded path. Stop
  grading dependent turns at the first material divergence.
- **Context substitution:** inject the exact missing fact or state and label the result as a seam
  test, not an end-to-end replay.
- **Closed-loop journey:** let a user simulator respond to the bot's actual replies. Use this for
  recovery, handoff and multi-turn readiness.

## Grade roots, not fallout

Name the first causal defect. Later wrong turns caused by its missing state are cascades: report them
for blast radius, but don't inflate the root count or open separate fixes until the root is rerun.

- **RED:** an independently reproducible defect with valid causal context.
- **YELLOW / excluded:** ungradeable after divergence, intentionally escalated, or below a quality
  threshold without a discrete defect.
- **GREEN:** the asserted behaviour passed with valid context.

## Define "green" before the run

"Zero RED roots" means the known correctness defects are fixed. It does **not** mean release-ready.
Readiness also needs every declared rubric above its threshold, the required closed-loop journeys
passing, and the final code, prompt, model, content and environment matching the evidence.

Any behaviour change after a full replay invalidates the word "final".

## Do
- Record the first divergent turn and whether later turns depend on operator-only context.
- Report root counts, cascade counts, exclusions and quality scores separately.
- Keep factual answers and human-review requests independently testable in mixed turns.
- Record the evidence identity: commit, prompt hash, resolved model, content versions, stage scope,
  environment, run time.

## Don't
- Mark a later turn RED because the test never supplied a fact the bot would only have had on the
  historical branch.
- Mark excluded turns GREEN to improve the headline.
- Count five consequences of one early routing defect as five bugs.
- Say "all green" when 0 RED coexists with required quality scores below threshold.

## Example
At turn 4 the tested bot answers an objection instead of handing off, so the recorded operator message
that supplied a key fact never happens. At turn 5: stop open-loop grading, inject the fact as a labelled
seam test, or let a simulator answer the bot. Don't grade turn 5 RED for not using a fact it never got.

**Smell test:** *"Would this turn still have received the same context if the bot had behaved as
tested?"* If not, you have crossed the causal frontier.
