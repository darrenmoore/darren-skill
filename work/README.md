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

> Read work at https://github.com/darrenmoore/darren-skill/tree/main/work. Don't install it yet. Read every file in it first, then look at how this repo already works: our skills, hooks, conventions and the way we ship. Tell me what it does, whether it fits here, what it overlaps with, and what you would change so it suits our work. Wait for me to decide before you add or adapt anything.

Needs a `docs/work/` folder in git. Fill in your own homes for docs, scripts and decisions in `/work done`, your test and dev-server commands in the templates, and your tracker if you use one. `spec` hands off to `grill`; its review phase pairs with `shakedown` from this collection.
