# ai-check

Flags phrases that read as AI-written and keeps a banned list you add to as you go.

Type: skill, tool

## Files
- `SKILL.md`: how to check a draft, fix what it flags, and add a new phrase to the list.
- `do-not-say.md`: a starter banned list grouped into families by shape, each entry with a why and a regex.
- `before-after.md`: where to record the better sentence whenever you reject one.
- `check.mjs`: a dependency-free Node script that reads `do-not-say.md` and prints every match in a file with its line number.

`check.mjs` is a lint, not a detector. It finds the phrases you have banned. It can't tell who wrote the text or whether the text is any good.

## Adopt it
Paste this into your agent:

> Read ai-check at https://github.com/darrenmoore/darren-skill/tree/main/ai-check. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

Needs Node 18+ and a place to keep the list. Expect to prune the starter list to your own voice.
