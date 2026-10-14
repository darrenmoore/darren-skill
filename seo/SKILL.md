---
name: seo
description: Run a phased SEO audit of a site you own and produce one prioritised, decision-ready report, or run a single narrow pass on request. Use when the user says "SEO", "/seo", "SEO audit", "audit the site", "how's our SEO", "what should we fix for search", "get me an SEO report", or wants to find and prioritise search and AI-search (GEO) opportunities. Also handles narrow asks ("just the schema", "just keyword clusters", "just a drift check", "pull the SEO data") by running the matching module only.
---

# SEO

One skill. The analysis lives in module files under [`modules/`](modules/); read them and delegate to them.

It assumes you are auditing your own site and can read its source and built output. That makes the audit far more precise than a black-box crawl.

## Setup (fill in once)

| Item | Your value |
|---|---|
| Site URL | `<https://example.com>` |
| Build command and output folder | `<npm run build>` → `<dist/>` |
| Where audit data and reports live | `<docs/seo/>` (with `data/`, `reports/`, `baselines/`) |
| Primary conversion | `<signup / purchase / demo request / lead form>` |
| Analytics source | see [DATA_DICTIONARY.md](DATA_DICTIONARY.md), which you fill in |
| Confirmed competitors | `<docs/seo/data/competitors.yaml>`, confirmed by a human |
| Cross-session memory (optional) | `<shipped log>`, `<open backlog>`, `<ruled-out decisions>` |
| SEO checks your build already enforces | `<list them, or "none">` |

## Two ways to run

1. **Full audit (default).** "SEO audit", "how's our SEO", "/seo" → run the four phases below and write one report to `<reports>/<YYYY-MM-DD>-<scope>.md`.
2. **Single module (narrow ask).** Read that one module file, run only it, return its output inline. No full report.

A third shape, the **bounded update** ("refresh the runbook", "plan the next content"), is in [RUNBOOK.md](RUNBOOK.md). It doesn't restart the full audit.

**Step 0, before either mode: read the cross-session memory** if you keep one: what shipped, what is open, what was ruled out. Reconcile it with `git log --since=<date of newest shipped entry>` so the log heals itself if a past session forgot to update it. Never recommend anything already shipped or ruled out. This memory is separate from the per-audit ledger in RUNBOOK §2.

| If the user wants… | Read and run |
|---|---|
| pull data: Search Console, PageSpeed, crawl, SERP captures | [`modules/data.md`](modules/data.md) |
| content clusters, "what should we build", programmatic | [`modules/programmatic.md`](modules/programmatic.md) |
| AI search, GEO, `llms.txt`, "show up in ChatGPT / AI Overviews" | [`modules/ai.md`](modules/ai.md) |
| schema, JSON-LD, structured data, rich results | [`modules/schema.md`](modules/schema.md) |
| internal linking, site architecture, pillar pages | [`modules/architecture.md`](modules/architecture.md) |
| comparison, "vs" and alternatives pages | [`modules/competitors.md`](modules/competitors.md) |
| drift, regressions between deploys, baselines | [`modules/drift.md`](modules/drift.md) |

## Reference files (read before a full audit)

- [METHODOLOGY.md](METHODOLOGY.md): the why. Phases, data-maturity gating, report design, confidence calibration.
- [RUNBOOK.md](RUNBOOK.md): the how. Step-by-step procedure with the progress ledger, fallbacks and QA gate.
- [DATA_DICTIONARY.md](DATA_DICTIONARY.md): a template for mapping your data sources. Fill it in once.
- [report-template.md](report-template.md): the output skeleton.

## Prime directive

**Keep the progress ledger live.** After every completed step, update `<data>/_ledger.md`, not in batches. Audits span context resets and several sessions; the ledger lets you resume without redoing work.

## The four phases

1. **Collect data** ([`modules/data.md`](modules/data.md)): Search Console performance and indexing, PageSpeed Insights, a crawl of the built site (plus [Squirrel Scan](https://github.com/squirrelscan/skills) if installed), SERP captures, and analytics through the data dictionary. Modules interpret data; they don't replace it. Thin data gives generic findings, so collect first.
2. **Apply the strategy modules**: `programmatic`, `ai`, `schema`, `architecture`, `competitors`. Run a checklist pass last to catch gaps.
3. **Synthesise**: deduplicate, ground every recommendation in a specific data point, assign tier, impact, effort and owner, and write the 90-day plan first.
4. **Monitor drift** ([`modules/drift.md`](modules/drift.md)): baseline the top URLs after fixes ship and compare monthly.

## How to run the modules

Each strategy module is a self-contained brief. Run each in its own subagent turn so outputs stay attributable and don't bleed together.

- `architecture` follows `programmatic` (it needs the clusters). `schema` follows `ai` (it validates the schema those recommendations imply). The rest can run in parallel.
- **Front-load real data into each subagent prompt**: paste the Search Console numbers, crawl findings and analytics pulls from Phase 1. The subagent's job is to apply its module to your data, not to talk about SEO in general.
- Run the checklist pass last: a sweep against METHODOLOGY's quality bar to catch what the others missed.

Without subagents, read the module file inline and apply it. The file is the same either way.

## Adapt to your site

- **Conversion is whatever matters to you.** Generic advice says "GA4 conversions"; use the source your data dictionary maps. If analytics access isn't wired up, fire `F-ANSWER` and continue on Search Console signals, noting the gap.
- **Competitors come from a human.** Read the confirmed list; never guess.
- **You own the source.** Crawl the built output directly. A live crawler adds rendered-page and header checks but is optional.
- **Don't re-report what the build already guards.** If your build fails on missing canonicals, long meta descriptions or a missing sitemap, those are true on every deploy. Spend the report on the layer above: strategy, content, AI search, schema depth, internal architecture.

## Report quality bar (enforce these)

- The Executive Summary opens with a reframing finding, not a list of everything found.
- The 90-day plan is the spine (page 2), grouped by Week 1 / Month 1 / Quarter / Deprioritised, with an owner column. Write it before the detailed recommendations.
- Every recommendation cites a specific data point. "Build a comparison page because we rank position 14 for '<category term>' while a competitor owns the AI Overview", not "build comparison pages".
- Calibrate confidence. Don't cite unofficial thresholds as Google specs; say "consistent with" for patterns you can't confirm.
- The appendix holds noise and implementation detail; the main report holds decisions.

## Do and don't

- Do update the ledger after each step and save raw artifacts under `<data>/`.
- Do fire the fallback blocks (`F-LOGIN`, `F-FILE`, `F-ANSWER`, `F-TOOL`) when blocked and keep going on what you can do.
- Don't invent metrics, competitor names or rankings. If you don't have the data, say so.
- Don't dump raw module output into the report. Synthesise.
