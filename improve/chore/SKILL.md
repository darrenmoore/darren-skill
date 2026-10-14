---
name: chore
description: Commit a small maintenance change on its own, such as a skill or doc tidy-up, a tooling tweak, a config nudge or a drive-by cleanup, with the same staging discipline as /commit. Use when the user says /chore <description>, "commit this as a chore", or when /improve has produced an instructions change to commit. Not for changes to product behaviour; those go through /commit.
user-invocable: true
---

# /chore: commit small maintenance work on its own

A light path for the small stuff: tidy a skill, fix a typo in a doc, bump a
tooling default, a cleanup noticed while doing something else, or the rule
`/improve` just wrote. It keeps that work out of feature commits so it stays
visible in `git log` and can be reverted on its own.

If your repo ties commits to tickets, `/chore` is the stated exception: no
ticket is needed or created. The boundary is behaviour: anything that changes
what the product does needs a ticket and `/commit`.

## Command

```text
/chore <description>
```

The description becomes the commit summary. If the user gave one, don't ask
again; if they just said `/chore`, derive it from what changed and show it.

## When to use it

- **`/chore`** for a small maintenance change (one to a few files): agent
  instructions and skills, docs fixes, tooling or config tweaks, scratch
  cleanup, dependency nudges.
- **`/commit`** when the change alters product behaviour or anything someone
  would ask "what changed and why" about. If a chore turns out to change
  behaviour, it isn't a chore: stop.
- In a workspace with several repos, commit in the repo that owns the files.

## Workflow

1. **Stage only the chore's files.** Cross-reference `git status` with this
   conversation. Apply the staging rules from `/commit`: `git add -- <path>`,
   never `git add -A` or `.`, never another session's in-flight work, never
   stash without asking. If a file mixes chore and non-chore edits, stop and ask.
   If skills are mirrored from a source folder, sync them and stage what your
   repo tracks (often only the source; mirrors may be gitignored).
2. **Validate lightly.** If the chore touched something with tests, run the
   narrowest check (`<your test command> <path>`). Docs or skills only need none.
3. **Commit.** Run `git diff --cached --stat` first. If it lists files that
   aren't yours, commit with `git commit --only -- <your paths>`: a plain
   `git commit` takes everything staged, and that is how a one-file chore ends
   up carrying hundreds of another session's files.

   ```text
   chore: <description>

   <one or two lines of what and why, if not obvious>

   Validation: <check run, or "docs/skills only, none">
   ```

   Use `docs:` instead when it's purely documentation. Keep any trailer your
   harness requires. Confirm with `git log --oneline -1`.
4. **Changelog:** skip it for developer-only chores. Add one line only if the
   chore changes how people work in the repo (a new shared skill, say).

## Rules

- One chore per commit. Don't bundle a chore into a feature commit or the reverse.
- Inherit `/commit`'s staging discipline and its no-auto-stash rule; don't weaken them.
- If the diff has grown beyond small maintenance, stop. It isn't a chore any more.
- Don't push unless the user asks.
