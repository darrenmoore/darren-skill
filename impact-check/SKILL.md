---
name: impact-check
description: Before changing a business rule (a price, fee, discount, limit, quota, permission, eligibility condition, workflow step, deadline or formula), list everything else it touches so the user can confirm the trade-off is intended. Use when someone proposes a change like "make the trial 7 days", "let viewers export", "lower the free-plan limit" or edits a file that holds such rules. Asks "are you sure? this also affects Y" before the edit happens.
---

# Impact-check

A pre-edit ripple review for **business-rule** changes. The job is to surface, in plain English, everything else a proposed change touches before you edit, and get a deliberate confirmation. It is "are you sure?" for the rules your product runs on.

It is not a technical-correctness check. Type errors, failing tests and broken builds are caught by your normal checks. Impact-check is for what compilers can't see: a small number tweak that shifts how customers behave, a limit change that contradicts a pricing page customers have already read, a formula edit that breaks an assumption a planning doc is built on.

## When to run

- Someone proposes editing the file or table that holds prices, plan limits, permissions, fees, rates, thresholds or other rules (<your rules files: config, pricing table, permissions map, formulas module>).
- Someone describes a change in plain words: *"halve the trial"*, *"make annual plans cheaper"*, *"let members invite guests"*, *"raise the refund window to 60 days"*.
- An eligibility rule, prerequisite, cooldown, cap or approval step is being changed.
- The change **hides, reveals, anonymizes or restricts a fact a user can see** (who did something, an email address, a price someone else paid, whether someone is online). See [One fact, many windows](#one-fact-many-windows). This class is never skipped as "just a bug fix": even fixing one leaking surface means listing all the others.

## When not to run

- **Bug fixes** where the bug *was* the deviation from intended behaviour. The fix restores the intended rule, so ripple analysis would be circular.
- **Pure UI, copy or visual changes** that don't change numbers or rules.
- **Refactors** with no behaviour change.
- **A new rule that is fully isolated** and doesn't replace or interact with an existing one. If it interacts, run it.

When unsure whether a change is a rule change or a bug fix, ask. Don't assume.

## Core rule

**Never silently apply the change.**

1. Surface the impacts.
2. Ask the explicit question.
3. Wait for confirmation.
4. Only then edit, or hand back to whoever was about to.

A confirmed change with documented ripples is fine, even if the ripples are large. An unconfirmed change is the failure this skill exists to prevent.

## Workflow

### 0. Check real state, not just the code

- **Stale local branch.** Fetch and compare the main branch on the remote with your working tree. Saying "X isn't live yet" from a local branch that is a release behind gives a wrong answer.
- **Sample production.** If you can query live data read-only, check the real numbers (how many accounts sit at each plan limit, the spread of order sizes, how many subscriptions renew this week). Don't assume the value on disk is what's running.
- **The user knows what's live.** If the user describes live behaviour that contradicts your reading of the code, they are probably right and your copy is stale. Verify before answering.

### 0b. Start from your rules register, if you keep one

If the repo has a register of business rules (what each rule is for, the owner's intent, where each number lives, options already tried or rejected and why, current baseline), find the entry for what you're changing and read it before tracing anything.

- **A rejected or parked option** is not proposed again without new evidence. Say so if this change is one.
- **After the change lands,** add a history line to the entry: what changed, the expected effect, when.
- No register? Consider starting one. Most of this skill's value compounds through it.

### a. Name the change

One line: file or system, the rule, before → after.

> Free-plan project limit in `<pricing config>`: `5 → 3`.

If the user only described the change in words, find the code yourself. Don't ask them to grep.

### b. Classify it

Which areas does it touch: billing, plans and limits, permissions, onboarding, notifications, reporting, support, partner or reseller terms. List all that apply.

### c. Trace the blast radius (six axes)

For each axis, list findings with `path:line`. One line each is fine.

1. **Direct callers.** Search for the constant, function or key. What code reads this value?
2. **Coupled formulas: when this rule's output is another rule's input.** Flagging the coupling is not enough. **Compute before and after for the downstream rule** at typical values (use the real distribution: min, p25, median, p75, max). If the answer is "small shift", say so with numbers. If the downstream value moves 10× at the median, that is the finding, and it blocks until the downstream rule is retuned or the change is reshaped. The common shape: rule A's output appears as `× limit`, `× price` or `× balance` inside rule B. When A's curve changes shape (flat to tiered, a threshold added, an exponent shifted), B's absolute output moves even though B's percentage of A looks unchanged.
3. **What users see.** Pricing page, plan comparison table, help centre, in-app copy, tooltips, onboarding emails, invoices, sales decks, terms of service. Numbers pulled live from config update themselves; prose, FAQs and hand-written messages don't, and will contradict the new rule.
4. **Intent and policy docs.** Docs that describe how the model is meant to work: pricing strategy, unit economics, permission model, compliance or contractual commitments. A change that breaks a documented assumption is high priority even when all the code compiles. Either the doc changes with it, or the change is fighting the documented design. Say which.
5. **Tests pinning the old value.** Tests that assert the current number or rule as a contract. They will fail; updating them is part of the same change.
6. **Live state.** Does it affect things already in flight: active subscriptions, trials already running, scheduled jobs, pending approvals, existing records above a new limit, customers on a contract that names the old terms? A change that rewrites existing customers' situation is a different decision from one that only applies to new actions, and may need grandfathering or a migration. For coupled formulas (axis 2), this is where you plug the live distribution into the new rule. Flagging without numbers fails this axis.

### One fact, many windows

For changes that hide, reveal or restrict a fact a user can see, the six axes aren't enough. They trace *callers* (what reads a value); this class fails on *emitters* (the other places that produce the same fact independently). A restriction applied at one emitter is a silent leak at every emitter you didn't touch. A typical miss: a paid "hide my identity" option applied to the main page only, while notifications, the activity feed, exports and a weekly summary still named the user.

In order:

1. **Name the fact in plain words:** "who placed the order", "this customer's email", "what this account pays".
2. **Search every field that carries it,** not just the one you're editing: names, ids, emails, derived fields, avatars. Search across APIs, notifications, emails, activity feeds, exports, search indexes, audit logs, aggregates and reports, and frontend renderers.
3. **List every emitter as a checklist** and confirm the rule holds at each, with `path:line`. The gate is "all N", not "the one in the diff".
4. **Treat the user-facing promise as a contract.** Copy like "hides your identity" binds every surface that shows the fact. If the copy is narrower than the intent, flag the copy too.
5. **Recommend the prevention in the same breath:** a conditionally hidden fact should flow through one shared resolver, not be re-derived per surface. If you find N re-derivations, say so; that is the latent bug.

### d. Ranked list

Biggest impacts first, in plain English, with `path:line` for every finding so the user can click through and decide.

### e. Ask the explicit question

- *"Confirm: you want A, B and C to shift together?"*
- *"Did you intend B? If not, scope the change to X only."*
- *"Y looks like it would break. Fix it in the same change, or accept it?"*
- *"This contradicts `<doc>`. Update the doc, or is the doc right?"*

### f. Only after confirmation, proceed

Make the edit, or hand back. If you keep decision records (a ticket, a work item, a decisions log), save the report and the accepted decision there.

## Report template

```markdown
## Impact-check: <one-line change>

**Area(s):** <billing | permissions | …>
**File(s):** <paths>
**Before → After:** <old → new>

### Direct effect
- <what the change literally does>

### Coupled rules (compute, don't flag)
- <downstream rule> [path:line] `<formula>`: at median / p90 live values, before <n> → after <n> (×N). Blocker or acceptable?

### Ripple
- <downstream behaviour> [path:line]: how it moves

### What users see
- <page, email, tooltip> [path:line] says "<quote>": contradicts the new value

### Intent docs
- <doc> [path:line]: which assumption shifts; doc updates with the change, or the change fights the doc

### Tests pinning the old value
- [path:line]: the assertion that will fail

### Live state
- <in-flight records, contracts, jobs>: affected or not, and whether grandfathering is needed

### Open question
- <the confirm-or-scope-down question>
```

## Worked example: "let viewers export reports"

Looks like a one-line permission change: add `export` to the viewer role.

- **Direct:** viewers gain the export button and the export endpoint.
- **Ripple:**
  - **The paid-seat distinction weakens.** Export is one of the reasons teams buy editor seats. If viewers (free seats) can export, the upgrade path loses a reason.
  - **One fact, many windows.** Reports hide salary columns from viewers on screen. Does the export path apply the same column filter, or does it query the raw table? Check every export format (CSV, PDF, scheduled email) and the API.
  - **Rate limits.** Export runs a heavy query. Viewer seats outnumber editors many times over; the queue sized for editors may not hold.
- **What users see:** the pricing page lists "Export" under paid seats; the help article on roles says viewers can't export. Both contradict the change.
- **Intent docs:** the seat-pricing doc treats export as a paid-seat feature. Either it updates, or the change fights it.
- **Tests:** permission tests asserting viewers get 403 on export.
- **Open question:** *"Is the goal letting viewers take data offline, or reducing support requests for exports? If the second, a 'request export from an editor' button keeps the seat distinction."*

## Worked example: "halve the free trial"

- **Direct:** trial length 14 → 7 days.
- **Coupled rule:** the "trial ending" reminder emails fire at fixed days (day 10 and day 13). At 7 days, day 10 never comes and day 13 fires after expiry. Hand-coded thresholds don't scale with the setting.
- **Ripple:** trial-to-paid conversion reporting compares against a 14-day cohort; the dashboard's baseline is now wrong. Sales follow-up cadence assumes two weeks.
- **What users see:** landing page and signup form say "14-day free trial".
- **Live state:** trials already running. Do they keep 14 days, or get cut short? Cutting them is a broken promise.
- **Open question:** *"Apply to new signups only? And should the reminder schedule become proportional to the trial length rather than fixed days?"*

## Easy-to-miss ripples

Classes that searching alone won't find, because the consuming code uses absolute thresholds or hand-written text tied to the original value. Keep your own list of specific cases here as you find them.

| Pattern | Why it's missed |
|---|---|
| Messages with hand-coded tiers ("ends in X days", "> 48h / > 24h / > 1h") tied to a duration setting | Tiers are absolute, not proportional. Changing the setting from 3 days to 7 produced "167h left" messages for days. |
| A percentage applied to another rule's output (a reserve, a protected amount, a commission on a capped value) | The percentage looks unchanged, but when the other rule's curve changes shape, the absolute amount can jump 10× at common values. |
| Copy that formats a value locally instead of reading it from config | The number on one page updates, the same number in another place doesn't. |

When this list grows, prefer fixing the code to be proportional or config-driven over keeping a longer list.

## What this skill is not

- Not a test runner or code reviewer.
- Not a docs update. Propagating the accepted change to docs and copy is the next step.
- Not a vibe check. It produces a concrete list of impacts with `path:line` references. If the report is vague, it has failed.
