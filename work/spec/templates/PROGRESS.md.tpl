# {{Feature name}}: progress

**Shared status log. Any agent picking up a task updates this file.** Claim a row (name and date
under Owner), change its Status as you go, leave a one-line note (commit, blocker, decision).

_Last updated: {{YYYY-MM-DD}}: {{one-line state, e.g. "pack scaffolded, no code started"}}._

## Status key
`not started` · `in progress` · `blocked` (say why) · `done` ({{date and commit}})

## Tasks

{{Keep ONE of the two tables below and delete the other.}}

**A phase's own PROGRESS.md: one row per task.**

| Task | Status | Owner | Notes |
|---|---|---|---|
| [{{010 slug}}]({{path}}) | not started | | {{key decision or value}} |
| [{{020 slug}}]({{path}}) | not started | | |

**The pack root: one row per phase, never task rows.**

| Phase | Status | Gated on | Log |
|---|---|---|---|
| [01-phase1-{{slug}}](01-phase1-{{slug}}/README.md) | not started | | [PROGRESS](01-phase1-{{slug}}/PROGRESS.md) |
| [03-review](03-review/README.md) | not started | every build phase | [PROGRESS](03-review/PROGRESS.md) |
| [04-qa](04-qa/WALKTHROUGH.md) | not started | the review | the walkthrough itself |
| [05-closing](05-closing/README.md) | not started | the owner's walkthrough | [PROGRESS](05-closing/PROGRESS.md) |

## Decisions log
- {{decision: choice (source, YYYY-MM-DD)}}

## Blockers
- {{blocker, or "none"}}
