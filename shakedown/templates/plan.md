---
kind: shakedown-plan
slug: {{SLUG}}
run: {{RUN}}
generated_at: {{ISO_UTC}}
scope: {{whole-branch | <scope> | since:<ref>}}
diff_base: {{DIFF_BASE}}
files: {{N}}
size: {{XS|S|M|L}}
lanes: [{{LANE_LIST}}]
status: {{proposed | running | complete}}
---

# Shakedown plan: {{SLUG}} (run {{RUN}})

## What changed

{{Two or three plain sentences of what this work actually does, read from the diff, not copied from
the changelog. If you cannot say what it does, you cannot review it, and that is the first finding.}}

| Surface | Files | What moved |
|---|---:|---|
| {{surface}} | {{n}} | {{one line}} |

**Self-audit:** {{path, N claims, N judgements, N gaps | absent}}

## What I will check

### The standard list

Every section of `standard-list.md`, with the ones that do not apply marked and justified. This section
may not be shortened, only annotated.

| § | Section | Applies | Lane | Note |
|---|---|---|---|---|
| 1 | {{section}} | yes / **n/a: why** | {{lane}} | |
| last | The pass itself | always | orchestrator | |

### Specific to this change

What is risky *here* that the standard list would not think to ask. One row per check.

| # | Check | Lane | Finding if |
|---|---|---|---|
| S1 | {{e.g. "the new refund path and the existing cancel path both write the order status; confirm they cannot interleave"}} | {{lane}} | {{threshold, declared now}} |

### Driven from the self-audit

| Tag | Entry | Lane |
|---|---|---|
| `[CLAIM]` | {{A1 ...}} | {{lane}} |

## What I will NOT do

- **Not running the test suites.** They ran when the work was built and run again in CI. The tests
  lane **reads** them and asks whether they would fail if the code were wrong. {{If one file must run to
  confirm a finding, name it.}}
- **Not fixing anything.** Findings first, fixes after.
- **Not re-checking the green checks**: {{list from the digest}}.
- {{Anything else out of scope, and why.}}

## Lanes

| Lane | Running | Scope | Why / why not |
|---|---|---|---|
| {{lane}} | yes / no | {{n files}} | |

## Automated checks

| Check | Result |
|---|---|
| {{id}} | {{pass / fail / error}} |

Warnings handed to lanes as **leads, not verdicts**: {{list}}

---

*Written before dispatch. If the pass deviates from this plan, say so in the findings report.*
