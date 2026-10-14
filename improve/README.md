# improve

Turns the session's mistakes and corrections into rules for the next agent. No mistake, no new rule.

Type: skill, hook

## Files
- `SKILL.md`: the /improve skill. List what went wrong, check the skills you relied on against what shipped, write only real gaps, and cut more than you add.
- `chore/SKILL.md`: the /chore skill, which commits the small instructions change on its own, staging only this agent's files.
- `hooks/improve-nudge.mjs`: Claude Code Stop hook. Once per session, after a real commit or a production action, asks the agent for a quick /improve triage. Edit `SKIP_TYPES` and `PRODUCTION` at the top for your repo.
- `settings.example.json`: the Stop hook wiring, with the hook installed at `.claude/hooks/`.

## Adopt it
Paste this into your agent:

> Read improve at https://github.com/darrenmoore/darren-skill/tree/main/improve. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

Needs: an always-loaded instructions file (AGENTS.md or CLAUDE.md), the "where each rule lives" table in Step 4 filled in for your repo, and your deploy or production commands in the hook's `PRODUCTION` list. /chore pairs with the [commit](../commit/) skill.
