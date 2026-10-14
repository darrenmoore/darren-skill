---
name: commit
description: Safe multi-agent Git commit workflow. Use when the user says /commit, asks to commit current work, create a clean commit, stage and commit changes, or commit only this agent's changes without mixing in other agents' or the user's work.
user-invocable: true
---

# /commit

Create one clean commit for the work this agent owns. Several agents and the
user may be editing the same checkout, sharing one index and one HEAD. Protect
their work: inspect everything, stage only what you own, and never stash on your
own.

## Workflow

1. **Find the repo.** `git rev-parse --show-toplevel`. In a workspace with
   nested repos, commit in the repo that owns the files. Changes across
   independent repos get one commit per repo.

2. **(If you use a ticket tracker)** find the one ticket this commit belongs to
   from the conversation, the branch name or the request. If none or several,
   ask before staging.

3. **Inspect all state before staging.**
   - `git status --short`, `git diff --stat`, `git diff -- <path>` for the
     candidates.
   - `git diff --cached --stat`: never assume pre-staged changes are yours.
   - On a heavily dirty tree, narrow with `git diff --name-only` first rather
     than reading one huge diff.

4. **Write the path list by hand, from what this session did.** Everything
   else is the user's or another agent's. A list piped out of `git status` is
   `git add -A` with extra steps.
   - Skill or instruction edits made this session count as yours.
   - If you edited a file before this task started, or it may hold someone
     else's work, ask before including it.

5. **Stage safely.**
   - `git add -- <path>` only when the whole file change is yours. Never
     `git add .`, `git add -A`, broad globs, or a directory add: a directory add
     quietly sweeps in whatever another session left there.
   - A file with mixed owned and unrelated edits: stage only your hunks. If hunk
     isolation is risky, stop and ask.
   - `git mv` and `git rm` stage as they run. Stage as late as you can: anything
     staged early sits in the shared index, where another session's commit can
     carry it.
   - Pre-staged work that isn't yours: leave it, and commit with
     `git commit --only -- <your paths>`. A plain `git commit` takes everything
     staged; that is how a one-file docs commit sweeps in hundreds of another
     session's files.

6. **Never stash automatically.** If a stash would make the commit safer, say
   exactly why and ask. If allowed:
   - `git stash push -m <unique-tag> -- <path>`, note its SHA from
     `git stash list --format='%H %gs'`, commit, then `git stash apply <sha>` and
     drop it by tag. Never a bare `pop`: the stash stack is shared by every
     worktree of the repo.
   - Untracked: rename it aside, commit, rename it back.
   - Afterwards `git status` must match the set from before. If the restore
     conflicts, stop and say so.

7. **Validate.** Reuse checks already run this session if nothing runtime
   changed since. Otherwise run the narrowest test, lint or typecheck that
   covers the change (`<your test command>`). If you can't run one, say why.
   - (Optional) Before committing source changes, have a reviewer agent ask of
     each test: would it fail if the code were wrong?

8. **Review the staged diff.** `git diff --cached --name-only`, then
   `git diff --cached -- <path>` for anything nontrivial. Only your work in it.

9. **Commit** in the format below. In a Bash tool, pass multi-line messages
   with a heredoc (`git commit -F - <<'EOF'`), never a PowerShell here-string:
   bash keeps the `@'` literally and the subject becomes `@`. Confirm with
   `git log --oneline -1`; output that looks fine is not proof HEAD moved.

10. **(Optional)** add a changelog line if your repo keeps one, and push only if
    the user or your workflow says so. If a push is rejected, stop. Never
    `--force`.

### When a pre-commit hook fails on a file you didn't stage

Check the path against `git diff --cached --name-only`:
- In your staged set: yours. Fix it and re-run the checks.
- Staged by someone else: commit with `--only` or a private index (below).
- Theirs and unstaged: never `--no-verify` without the user's say-so, never
  edit their file. Leave it out.
- Only a stash would get past it: stop and ask, naming the file.

### When another session is committing in the same tree

`--only` re-reads the working tree, so it still takes their unstaged lines in a
file you share. To commit exactly HEAD plus your changes, use a private index:

```bash
export GIT_INDEX_FILE="$(git rev-parse --absolute-git-dir)/idx-<unique>"   # absolute: hooks read it too
git read-tree HEAD && git add -- <your paths>
git diff --cached --name-only                    # yours only
git commit -F - <<'EOF'
...
EOF
rm "$GIT_INDEX_FILE"; unset GIT_INDEX_FILE
git reset -q -- <your paths>   # the real index still holds the old blobs: a staged revert of your commit
```

`git status --short -- <your paths>` must show nothing in the first column
afterwards, or the next plain commit ships a revert of yours.
`cannot lock ref 'HEAD': is at X but expected Y` means they committed while your
hook ran. Nothing landed: `read-tree HEAD` again and retry.

## Commit format

Conventional Commits:

```text
<type>(<optional-scope>): <clear title>

<short description of what changed and why>

Decision: <the non-obvious choice this commit encodes, if any>
Validation: <checks run, or "not run: <reason>">
```

Types: `feat` (adds or expands user-facing behaviour), `fix`, `docs`,
`refactor` (no intended behaviour change), `test`, `perf`, `style`, `build`,
`ci`, `chore` (maintenance that fits nothing else), `revert`.

Use a clear, human-readable title; prefer plain wording when it stays accurate.
Keep the body short. Add any trailer your harness requires.

```text
fix(auth): prevent login redirect loops

Store the redirect target in one place so returning users land on the right page.

Validation: npm test -- auth
```

## Report

- Commit hash and title.
- Files committed, briefly.
- Validation command and result.
- Uncommitted changes left behind, especially other agents' or the user's.
- If the session hit friction (a rule that didn't fire, a doc pointing at a
  file that's gone), say `/improve` is worth running. Don't fold instruction
  changes into this commit.
