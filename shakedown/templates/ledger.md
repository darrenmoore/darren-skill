---
kind: shakedown
plan: plan.md
slug: {{SLUG}}
run: {{RUN}}
generated_at: {{ISO_UTC}}
size: {{XS|S|M|L}}
scope: {{whole-branch | <scope> | since:<ref>}}
diff_base: {{DIFF_BASE}}
files: {{N}}
lanes: [{{LANE_LIST}}]
lanes_truncated: [{{TRUNCATED_OR_EMPTY}}]
verdict: {{GREEN|YELLOW|RED}}
blocking: {{N}}
major: {{N}}
note: {{N}}
design: {{N}}
model: {{orchestrator model; lane model}}
tokens: {{N}}
wall_clock: {{minutes}}
---

# Shakedown: {{SLUG}} (run {{RUN}})

**Verdict: {{VERDICT}}.** {{ONE_SENTENCE_WHY}}

{{N}} files. Lanes run: {{LANE_LIST}}. {{TRUNCATION_NOTE_OR_NONE}}

## Automated checks

| Check | Result | Note |
|---|---|---|
| {{check-id}} | pass / fail / error | {{one line}} |

## Findings

Severity: **blocking** (breaks a build, loses data, leaks private information, cannot be undone) ·
**major** (wrong but survivable; fix now if cheap) · **note** (later) · **design** (the owner's call;
see below, these do not move the verdict).

Resolution: `open` → `fixed, unconfirmed` (names the commit and the test that now pins it) → `fixed`
(a confirming round passed it) · `deferred` (where it is tracked) · `accepted` (who, and why).

| # | Lane | File / step | Finding | Evidence | Severity | Resolution | Test |
|---|---|---|---|---|---|---|---|
| 1 | {{lane}} | `{{path:line}}` | {{what}} | {{path:line or command + output}} | major | open | n/a |

(none)

## Design questions for the owner

Not defects. Places where the work is defensible and a different call was available. Nothing here
moves the verdict or becomes a fix without the owner saying so.

**1. {{QUESTION}}**
What was built: {{X}}. The alternative: {{Y}}. The trade-off: {{Z}}.
→ {{THE QUESTION, ASKED PLAINLY}}

(none)

## Lanes that did not complete, and where the pass left the plan

A truncated or errored lane cannot certify anything and forces YELLOW. Name what was left unread so the
next run can start there, and anything in `plan.md` that did not happen.

| Planned | What happened |
|---|---|

(none)

## What this pass learned about itself

**What did this pass miss?** {{"Nothing known yet" is a legitimate answer on the day.}}

**What did it report that was not real?** {{False positives, and which brief produced them.}}

**Changes made:** {{lines added and removed in the briefs, or "none, and why".}}

## Notes

- Self-audit: {{present at <path> | absent: the pass ran without its sharpest input}}
- Test suites: not run (by design). {{Single files run to confirm a finding: <paths> | none}}
- Per-lane cost:

| Lane | Model | Tokens | Tool calls | Duration | Findings kept |
|---|---|---:|---:|---|---:|

## Sign-off

```
Pass ran:          {{DATE}}
Blocking open:     0 / {{N found}}
Major open:        {{N}}
Design for owner:  {{N}}
Lanes truncated:   {{none | ...}}

Owner: ____   Date: ____
```
