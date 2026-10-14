# seo

A phased SEO audit that ends in one prioritised report, or a single narrow check when that's all you need.

Type: skill

## Files
- `SKILL.md`: the orchestrator: setup table, the two run modes, module routing, the four phases and the report quality bar.
- `METHODOLOGY.md`: the why: data-maturity gating, synthesis, report design, confidence calibration.
- `RUNBOOK.md`: the how: bounded-update route, progress ledger, per-step goal/method/fallback, QA gate, fallback prompts.
- `DATA_DICTIONARY.md`: a template for mapping your data sources (Search Console, analytics, crawl, PageSpeed) and the queries an audit needs.
- `report-template.md`: the report skeleton, with the 90-day plan as its spine.
- `modules/`: data collection, programmatic, AI search, schema, architecture, competitors, drift.

## Adopt it
Paste this into your agent:

> Read seo at https://github.com/darrenmoore/darren-skill/tree/main/seo. It was written for someone else's project, so don't install it as it is. Read every file in it, then look at how this project works: our skills, hooks, conventions and the way we ship. Tell me whether it fits, what it overlaps with, and how you would adapt it to this project: what to keep, what to change and what to drop. Wait for me to decide before you add anything.

Needs access to your site's build output, Search Console exports, and a filled-in data dictionary.

## Credit
Adapted from the SEO audit methodology and runbook by [Chris Cooke](https://github.com/BigChrisCooke), published with his [SEO Audit Report Builder](https://seo-audit-site.vercel.app/) playbook. The phases, data-maturity table, ledger, fallback prompts, QA gate and report design come from there. This version is for auditing a site you own, swaps GA4 for a data dictionary you fill in, and folds the analysis skills that playbook pairs with into modules. Optional crawling uses [Squirrel Scan](https://github.com/squirrelscan/skills) ([docs](https://docs.squirrelscan.com)).
