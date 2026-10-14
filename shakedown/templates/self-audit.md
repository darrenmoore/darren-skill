**Who writes this:** the agent that BUILT {{WHAT_WAS_BUILT}}, on {{DATE}}.
**Who reads it:** a different agent, reviewing. You are not expected to trust anything below.

# Self-audit: {{NAME}}

A risk register written by the agent that built the code, for the agent that will review it. It points
the reviewer's budget at the places most likely to hold something, instead of spreading it evenly over
code that is probably fine.

Three tags, each asking the reviewer for something different:

- **`[CLAIM]`**: an assertion made from live data or from reading code. **Re-run it.** Every claim
  carries the command that produced it and a threshold declared *before* the measurement.
- **`[JUDGEMENT]`**: a decision made without an explicit owner ruling. **Challenge it.**
- **`[GAP]`**: something knowingly not done. **Decide whether it matters.**

Where a test exists for something below, do not read the test and tick the box. The building agent
wrote both. Read the assertion and ask: *would this fail if the code were wrong?*

## A. Claims

### A1: {{CLAIM_TITLE}}

**Claim:** {{WHAT_WAS_ASSERTED}}

```
{{COMMAND OR QUERY}}
```

**Observed when built:** {{RESULT}}
**Finding if:** {{THRESHOLD}}

## B. Judgements made without an explicit ruling

Name the alternative not taken and why. If the owner would plausibly have chosen differently, that is
exactly the entry worth writing.

### B1: {{JUDGEMENT_TITLE}}

**Chose:** {{WHAT_WAS_CHOSEN}}
**Over:** {{THE_ALTERNATIVE}}
**Because:** {{REASONING}}
**Challenge it if:** {{WHAT_WOULD_MAKE_THIS_WRONG}}

## C. Gaps: knowingly not done

Not a confession; a map. Say whether it was skipped for scope, for time, or because it needed a
decision nobody had made.

### C1: {{GAP_TITLE}}

**Not done:** {{WHAT}}
**Why:** {{SCOPE | TIME | UNDECIDED}}
**Costs if it stays undone:** {{CONSEQUENCE}}

## D. Things to try to break

The builder knows where the ice is thin. One row per attempt, with the expected result, so the reviewer
can tell a bug from a surprise.

| # | Do this | Expected | Why it is worth trying |
|---|---|---|---|
| D1 | {{ACTION}} | {{EXPECTED}} | {{WHY}} |

## E. Tests to be most suspicious of

| Test | Why suspect it |
|---|---|
| {{TEST_PATH}} | {{WHY}} |
