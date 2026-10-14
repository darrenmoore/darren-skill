# Never invent facts. Ground every number, and fail closed.

**Principle:** Every fact in a reply (price, fee, date, address, percentage) comes from resolved
context, not from the model. The model *phrases* facts; it never *supplies* them. Missing context fails
closed (handoff, or an honest holding line), never a guess. Every model call has a deterministic
fallback, and each grounded decision carries the evidence that justified it.

**Why it matters:** A confident wrong number destroys trust faster than a handoff ever will, and you
cannot unsend it. A handoff is a recoverable non-answer; a hallucinated number is an unrecoverable
wrong answer. So truth lives in your data layer, the model only quotes it, and a deterministic check
sits between the draft and the wire.

## Do
- Source every number from a context method, never from model recall or arithmetic.
- Post-check every draft: the numbers in it must appear in the allowed set from context. Reject
  otherwise.
- On a rejected draft, retry **once** with the violation named. On the second failure, send one honest
  "the team will reply" line **and** flag a human. Record the reject reason; an unexplained floor costs
  a day of diagnosis later.
- Capture the justifying evidence **at decision time**: the basis behind a quoted price is frozen with
  the price when it is sent.
- Compute anything about *now* (a deadline, a remaining count) at answer time with a deterministic
  method; the model only quotes the computed string.
- On a missing required field, hand off.

## Don't
- Let the model compute or remember a number, not "20% of the total", not "the price I mentioned".
- Answer when a required field is absent.
- Bake a rotating value into prompt copy ("offer ends next month"). It reads fine today and lies later.
- Trust a draft with no post-check.
- Fall back to template copy when the model fails. That hides the failure inside a reply that *looks*
  handled. The honest floor plus a human flag makes the failure visible and countable, so you can
  drive it down.
- Assume a numeric check is the whole guarantee. It can make invented *numbers* extinct and still miss
  numberless claims ("items like this usually sell for far less"). Pair it with prompt rules for claim
  *classes* tied to an approved knowledge base, and accept the last mile is graded, not checked.
- Change *what* the model produces without re-gating the grounding check. A style rule like "show your
  arithmetic" makes the model emit derived numbers the whitelist doesn't contain, and the checker
  starts rejecting correct drafts. Teach the checker the legitimate derivations (products and sums of
  allowed numbers); don't drop the style rule or widen the whitelist blindly. Only re-running the eval
  after the style change caught this.
- Stop at fail-closed. **Make the data layer actually hold the fact.** Failing closed on a fact your
  pipeline never stores is a permanent outage of that answer: the most common user objection handed off
  every time because the basis for the number was never saved. Grounding is a data-pipeline requirement
  first and a prompt technique second.

## Frozen vs live
- **Frozen:** anything that justifies a past decision is immutable: the figure, its basis, the
  comparables. Later answers quote that snapshot, so the justification never drifts from what the user
  was told.
- **Live:** anything about *now* is recomputed every turn by deterministic code.
- If a value changes over time, it is live config, not copy.

## Example flow
User: "that seems high." The context resolves the frozen string "quote sent: 1,950 (basis: X); 30-day
guarantee". The answer step emits a directive carrying it; the composer writes the reply quoting 1,950;
the checker confirms every number traces to the allowed set (record ∪ catalogue ∪ user-stated ∪
directive payload) and that a quote delivery actually contains the amount. If the draft had invented
2,100, the checker rejects it, the composer retries once, and a second failure floors to the honest
line plus a human flag. If the basis had been missing, there is no draft: the flow hands off.

Keep a separate diagnostic for a *correct* draft wrongly rejected, so a too-strict checker shows up as
CODE rather than being blamed on the model.

**Smell test:** *"If this number is wrong, where did it come from, and would anything have caught it
before the user saw it?"*
