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

> Read worktree-cleanup at https://github.com/darrenmoore/darren-skill/tree/main/worktree-cleanup. Don't install it yet. Read every file in it first, then look at how this repo already works: our skills, hooks, conventions and the way we ship. Tell me what it does, whether it fits here, what it overlaps with, and what you would change so it suits our work. Wait for me to decide before you add or adapt anything.

Needs: a remote with a base branch (`origin/main` or `origin/HEAD`) and, if your worktrees live in one folder, that folder as `root`.
