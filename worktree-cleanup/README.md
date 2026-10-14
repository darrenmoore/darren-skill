# worktree-cleanup

Finds the git worktrees that are safe to delete. Never touches uncommitted or unpushed work.

Type: skill, hook, tool

## Files
- `SKILL.md`: the /worktree-cleanup skill. Verdicts, workflow and guardrails.
- `worktree-audit.mjs`: dependency-free Node script that audits worktrees and, with `--apply`, removes only the Safe set. Configure `DEFAULTS` at the top (repos, worktree root, always-keep patterns, base branch).
- `hooks/worktree-nudge.mjs`: Claude Code Stop hook. Once per session, after `git worktree add` or `gh pr merge`, runs the audit and asks the agent to tear down what is safe. Set `AUDIT_SCRIPT` to where you put the script.
- `settings.example.json`: the Stop hook wiring, with the hook installed at `.claude/hooks/`.

## Adopt it
Paste this into your agent:

> Read worktree-cleanup at https://github.com/darrenmoore/darren-skill/tree/main/worktree-cleanup. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

Needs: a remote with a base branch (`origin/main` or `origin/HEAD`) and, if your worktrees live in one folder, that folder as `root`.
