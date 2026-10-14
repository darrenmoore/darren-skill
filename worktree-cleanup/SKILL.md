---
name: worktree-cleanup
description: Work out which git worktrees are safe to delete, and delete only those. Use when the user says /worktree-cleanup, "which worktrees can I remove", "clean up my worktrees", "too many worktrees", or after a batch of merges has left per-task checkouts behind. Never deletes anything with uncommitted files, unpushed commits, or commits missing from the base branch.
user-invocable: true
---

# /worktree-cleanup

Agents that open a worktree per task leave them behind: sessions end right
after the merge, and nothing removes the checkout. They pile up fast (a dozen
or more, gigabytes of `node_modules`, within weeks). This skill audits every
worktree, sorts each into a verdict, and removes only the ones that cannot lose
work.

Where the leftovers come from, so the fix goes in the right place:

- **Per-task worktrees after the merge.** Whatever creates them (a release or
  ship skill, say) should remove its own when done. The Stop hook
  (`hooks/worktree-nudge.mjs`, Claude Code only) re-audits at the end of any
  session that ran `git worktree add` or `gh pr merge`. If these still pile up,
  the step that should tear them down is being skipped.
- **Plain folders and prunable registrations.** Someone deleted the folder
  instead of running `git worktree remove`, or `remove` failed halfway on a
  locked `node_modules`. Harmless to clean.
- **Ad-hoc worktrees** made for one session and forgotten. The audit keeps
  these while their branch is unmerged; the user decides.

## The audit script

`worktree-audit.mjs` does the work. Run it rather than hand-rolling git loops.
Configure `DEFAULTS` at the top once (or pass flags):

- `repos`: the repos to audit. Default: the one you're in. A workspace with
  several repos lists each.
- `root`: a folder that holds your worktrees. When set, every directory under
  it is audited, so plain folders and stray clones show up too. Default: every
  linked worktree `git worktree list` reports.
- `keep`: name or branch patterns that are never removed, for long-lived
  worktrees (e.g. `-dev$`).
- `base`: the branch work must be on to count as safe. Default: `origin/HEAD`,
  then `origin/main`.

```bash
node worktree-audit.mjs --fetch          # report against fresh remotes (default choice)
node worktree-audit.mjs --fetch --apply  # report, remove the Safe set, report again
node worktree-audit.mjs --json
```

Use `--fetch` unless offline: "on the base branch" is only as fresh as the
remote refs. `--apply` runs exactly the printed `Commands` block plus
`branch -d` on the Safe branches, then prints an `After:` line.

## Verdicts

| Verdict | Meaning | Action |
|---|---|---|
| **Safe to delete** | Registered worktree, clean (a touched lockfile is tolerated), branch pushed, nothing unpushed, zero commits missing from the base branch | `git worktree remove` (`--force` only for lockfile dirt) |
| **Keep** | Uncommitted files, branch never pushed, unpushed commits, commits not on the base, detached HEAD, locked, the worktree this session runs in, the main worktree, or a standalone clone | Leave it. Name the exact reason |
| **Pinned** | Matches a `keep` pattern | Always kept. The report shows uncommitted files and its branch |
| **Plain folder** | Under `root`, no `.git` at all, usually leftover `node_modules` | Delete the directory |
| **Prunable** | Git still lists a worktree whose folder is gone | `git worktree prune`. No data involved |

Squash or rebase merges leave the branch's own commits off the base, so those
worktrees show as Keep with "N commit(s) not on <base>". That is the safe
failure. Check the PR is merged, then the user can decide.

## Workflow

1. Run `node worktree-audit.mjs --fetch` from the repo (or workspace) root.
2. Show the user the report. Lead with the Safe and Keep lists and the reason
   on every Keep line. The two reasons that matter most are "branch never
   pushed" and "N commit(s) not on <base>", because there deleting loses work.
3. Ask before deleting unless the user already said to go ahead. Removing a
   tree is not reversible, and it is a mutating action across repos.
4. Run `--apply` (or the printed `Commands` block by hand, and nothing beyond
   it). It only ever holds `git worktree remove` for the Safe set, folder
   deletes for plain folders under `root`, `git worktree prune`, and
   `branch -d` for Safe branches.
5. Report the `After:` line: worktrees before and after, how many removed, what
   was kept and why.
6. `branch -d` refuses anything unmerged, so a failed line there is a branch to
   look at, not one to force.

## Guardrails

- Never delete a Keep or Pinned item. If the user wants one gone, the route is
  commit and push it first (or the user explicitly says the work is discarded),
  then re-audit. Never `--force` past uncommitted files.
- Never run `reset --hard`, `checkout --`, `stash` or `clean` as part of cleanup.
- Never delete a directory that has its own `.git`. That is an independent
  clone or another repo's worktree; the script marks it Keep.
- Never touch the main worktree of a repo.
- Treat the verdicts as evidence, not orders. If a Safe item looks wrong (the
  user says the work is still open), stop and check the branch against the base
  by hand before removing it.
