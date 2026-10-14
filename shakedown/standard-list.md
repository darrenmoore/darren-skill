# The standard list

Fill this in for your repo. Every shakedown pass covers every section, whatever the change was. The
plan may **add** to this list; it may never quietly drop from it. A section that does not apply is
written into the plan as `n/a: <why>`, so the owner can see it was considered and disagree.

This exists because an agent asked to "work out what to check" will plan around what it finds
interesting and skip the boring half, and the boring half is where the repeat offenders live.

Each row names the lane that owns it. **Nothing here is owned by two lanes.** Replace the example rows
with your own; keep each one checkable from the code or a command.

---

## 1. Structure: where things live

| # | Check | Lane |
|---|---|---|
| 1.1 | Every new file is in the right package or folder (`<your layout rules>`). | drift |
| 1.2 | No scratch files, debug scripts or notes committed outside `<your scratch dir>`. | drift |
| 1.3 | Deleted or moved paths have no live references: build files, CI workflows, scripts, agent instructions. | drift |

## 2. User-facing text

| # | Check | Lane |
|---|---|---|
| 2.1 | Every string the user reads exists in every supported language, written in the same change. | copy |
| 2.2 | Translations are right in meaning, not merely different from the source. | copy |
| 2.3 | No hardcoded user-facing text where the repo uses a translation system. | copy |
| 2.4 | One term per concept across the product. | copy |

## 3. Tests

| # | Check | Lane |
|---|---|---|
| 3.1 | Every new branch has a test that would fail if the branch were wrong. | tests |
| 3.2 | Every side effect (email, event, write) has a test asserting its payload. | tests |
| 3.3 | Tests promised in the plan or ticket exist. | tests |

## 4. Docs, changelog and instructions

| # | Check | Lane |
|---|---|---|
| 4.1 | Docs describing changed behaviour still describe it accurately. | drift |
| 4.2 | Changelog has an accurate line for each change. | drift |
| 4.3 | Agent instructions and skills still describe the workflow as it now is. | drift |

## 5. `<your next standard>`

Screens, service layer, numbers, security, performance: one section per lane you add.

## Last. The pass itself

**Owner: orchestrator. Always.** What did this pass miss, and what did it report that was not real?
See Step 9 of the skill.
