# review-gate

Stops the agent from finishing until a reviewer subagent has seen every file it changed in a given area.

Type: hook, agent

## Files
- `hooks/review-gate.mjs`: the gate. One script, three modes: `record` notes matching files on each edit, `reviewed` marks them seen when the reviewer subagent finishes, `check` blocks the stop while any are unreviewed. File globs, reviewer name and the block limit are set at the top. After three blocks it lets the stop through, so a fix and re-review loop can't run forever.
- `agents/reviewer.md`: an example read-only reviewer subagent with placeholders for your standard.
- `settings.example.json`: the hook wiring, assuming the script sits in `.claude/hooks/`.

Claude Code only: it relies on the PostToolUse, SubagentStop and Stop hook events. Dependency-free Node.

## Adopt it
Paste this into your agent:

> Read review-gate at https://github.com/darrenmoore/darren-skill/tree/main/review-gate. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

Needs a written standard for the reviewer to check against, the globs for the files it covers, and the reviewer's name kept the same in the hook, the agent file and the SubagentStop matcher.
