# grill

Questions you about a plan one decision at a time, with a recommended answer for each, until nothing is left vague.

Type: skill

## Files
- `SKILL.md`: the skill. Reads the code first, walks the decision tree one question at a time, pushes back once on weak answers, and ends with a printed working agreement instead of starting work.
- `LICENSE-UPSTREAM`: MIT licence of the upstream skill.

## Adopt it
Paste this into your agent:

> Read grill at https://github.com/darrenmoore/darren-skill/tree/main/grill. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

## Credit
Adapted from `grill-me` by Matt Pocock, https://github.com/mattpocock/skills (MIT, see `LICENSE-UPSTREAM`). The opening paragraph is his. Added: read the code before asking, a test every question must pass and a list of banned filler questions, one push-back on weak answers, no question cap, and a closing working agreement with a hard stop before implementation. Upstream has since moved to a `grilling` skill that asks questions in numbered rounds; this version keeps one question at a time.
