# impact-check

Before changing a business rule, lists everything else it touches so you can confirm the trade-off.

Type: skill

## Files
- `SKILL.md`: when to run it, the six axes to trace (callers, coupled rules with real before-and-after numbers, what users see, intent docs, tests, live state), the "one fact, many windows" check for anything hidden or restricted, a report template and two worked examples.

## Adopt it
Paste this into your agent:

> Read impact-check at https://github.com/darrenmoore/darren-skill/tree/main/impact-check. Don't install it yet. Read every file in it first, then look at how this repo already works: our skills, hooks, conventions and the way we ship. Tell me what it does, whether it fits here, what it overlaps with, and what you would change so it suits our work. Wait for me to decide before you add or adapt anything.

Works best with read-only access to production data and a list of where your rules live (config, pricing tables, permission maps).
