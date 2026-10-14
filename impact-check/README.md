# impact-check

Before changing a business rule, lists everything else it touches so you can confirm the trade-off.

Type: skill

## Files
- `SKILL.md`: when to run it, the six axes to trace (callers, coupled rules with real before-and-after numbers, what users see, intent docs, tests, live state), the "one fact, many windows" check for anything hidden or restricted, a report template and two worked examples.

## Adopt it
Paste this into your agent:

> Read impact-check at https://github.com/darrenmoore/darren-skill/tree/main/impact-check. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

Works best with read-only access to production data and a list of where your rules live (config, pricing tables, permission maps).
