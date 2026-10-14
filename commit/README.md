# commit

Commits only this agent's changes and leaves other agents' and your own work alone.

Type: skill

## Files
- `SKILL.md`: the /commit skill. Inspect everything, stage only owned paths or hunks, never stash on its own, and commit with Conventional Commits. Includes what to do when a hook fails on someone else's file and a private-index recipe for when another session is committing in the same tree.

## Adopt it
Paste this into your agent:

> Read commit at https://github.com/darrenmoore/darren-skill/tree/main/commit. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

Needs: your test command, and a decision on whether commits need a ticket, a changelog line or a push.
