# work

Work items as folders. The folder a task sits in is its status, so any agent can pick it up again.

Type: skill

## Files
- `SKILL.md`: the `work` skill. Capture, start, park, finish and report progress on items under `docs/work/_next`, `_active`, `_parked`, `_done`.
- `docs-work-README.md`: a five-line `docs/work/README.md` to drop into your repo.
- `spec/SKILL.md`: the `spec` skill. Scaffolds a plan pack (hub, numbered tasks with tests first, companion docs) inside a work item. Install it as its own skill folder beside `work`.
- `spec/references/pack-structure.md`: pack shape, the allowed companion docs, the design phase and the fixed review/QA/closing tail.
- `spec/templates/*.tpl`: README, PROGRESS, QUESTIONS, SUMMARY, SELF-AUDIT, phase index, task, and the three owner-walkthrough files.

## Adopt it
Paste this into your agent:

> Read work at https://github.com/darrenmoore/darren-skill/tree/main/work. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

Needs a `docs/work/` folder in git. Fill in your own homes for docs, scripts and decisions in `/work done`, your test and dev-server commands in the templates, and your tracker if you use one. `spec` hands off to `grill`; its review phase pairs with `shakedown` from this collection.
