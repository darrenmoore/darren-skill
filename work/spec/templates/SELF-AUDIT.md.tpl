# Self-audit: {{pack name}}

**Who writes this:** the agents that BUILD the tasks, each appending as its task lands.
**Who reads it:** a different agent, reviewing. Nothing below is to be trusted as written.

A risk register from the builder to the reviewer. It points the review at the places most likely
to hold a problem, instead of spreading attention evenly over code that is probably fine.

- **`[CLAIM]`**: an assertion made from live data or from reading code. **Re-run it.** Each claim
  carries the command or query that produced it and a threshold declared *before* measuring.
- **`[JUDGEMENT]`**: a decision made without an owner ruling. **Challenge it.**
- **`[GAP]`**: something knowingly not done. **Decide whether it matters.**

Where a test covers something below, don't read the test and tick the box. The builder wrote both
the code and the test. Ask: *would this test fail if the code were wrong?*

## A. Claims

### A1: {{claim title}} ({{task}})

**Claim:** {{what was asserted}}

```
{{runnable query or command}}
```

**Observed when built:** {{result}}
**Finding if:** {{threshold}}

## B. Judgements

### B1: {{title}} ({{task}})

**Chose:** {{what}}
**Over:** {{the alternative}}
**Because:** {{reasoning}}
**Challenge it if:** {{what would make this wrong}}

## C. Gaps

### C1: {{title}} ({{task}})

**Not done:** {{what}}
**Why:** {{scope | time | undecided}}
**Cost if it stays undone:** {{consequence}}

## D. Things to try to break

| # | Do this | Expected | Why it is worth trying |
|---|---|---|---|
| D1 | {{action}} | {{expected}} | {{why}} |

## E. Tests to be most suspicious of

| Test | Why suspect it |
|---|---|
| {{path}} | {{why}} |
