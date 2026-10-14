# Data collection (Phase 1)

> Module of the `seo` skill. Run for "pull the SEO data", "get Search Console numbers", "crawl the site", "get PageSpeed scores", or as the first phase of a full audit. Hand back to the orchestrator when done.

Gather the raw signals the audit interprets. Modules don't replace data; they interpret it. Save every artifact under `<data>/` and tick the ledger ([../RUNBOOK.md](../RUNBOOK.md) §2) as you go. Per-step goals and fallbacks are in RUNBOOK §3; this file is the practical "how do I pull each one".

## What lands where

| Step | Output | Folder |
|---|---|---|
| Search Console performance (12 months, queries + pages) | CSVs | `<data>/gsc/` |
| Search Console indexing (not-indexed reasons + 404s) | URL lists | `<data>/gsc/` |
| Analytics (acquisition + conversions) | query results or exports | `<data>/analytics/` |
| PageSpeed Insights | JSON or notes | `<data>/psi/` |
| Crawl (build output + optional Squirrel Scan) | crawl output | `<data>/crawl/` |
| SERP captures + page-type table | notes | `<data>/serp/` |
| robots.txt + sitemap | notes | `<data>/crawl/` |

## Build and crawl (always available; do this first)

You own the source, so the build output is the highest-fidelity crawl target. Run `<your build command>` with the production site URL set, then walk every built HTML file and record per page: `<title>`, meta description and its length, canonical, `<h1>` count, JSON-LD blocks and whether they parse, internal links, images missing `alt`. Read `robots.txt` and the sitemap. Note orphan pages (in the sitemap but not linked) and any page whose canonical isn't its own URL.

If the build already asserts some of these, don't record them as findings. Look for what it doesn't check: schema depth, internal-link structure, thin or duplicate content, image weight.

**Optional: [Squirrel Scan](https://docs.squirrelscan.com)** for the live, rendered site (scored audit categories, headers, rendered DOM):

```
squirrel audit <site-url> --max-pages <n> --coverage full --format llm \
  --output <data>/crawl/squirrel-report.txt
```

Pick `--max-pages` from the sitemap count with room for redirects. If the crawl hits the limit, raise it and re-run, or label the result a partial crawl. Record sitemap count, pages audited, limit and completion status next to the output, and don't compare scores from different crawl scopes. If Squirrel Scan isn't installed, fire `F-TOOL`, crawl the build output, and note that rendered and header checks were skipped. Squirrel Scan also ships agent skills of its own: https://github.com/squirrelscan/skills.

## PageSpeed Insights (free)

Per URL (homepage and top 3 to 5 pages), mobile:

```
https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<URL>&strategy=mobile
```

Capture the performance score, LCP, INP, CLS, TBT and the third-party summary. Flag any asset, font or CDN domain that isn't your production domain; it's a common LCP regression source. These are lab numbers; field data comes from CrUX or the Search Console Core Web Vitals report.

## Google Search Console (user-gated)

You can't log in for the user. Use an API pull if one is set up, otherwise fire `F-LOGIN` and ask them to authorise a browser session or export:

- Performance → Search results → 12 months → export the Queries and Pages tabs.
- Indexing → Pages → export each "not indexed" reason and the 404 list.

Cross-reference "crawled, currently not indexed" URLs against the crawl to find the real pages.

## Analytics

Follow [../DATA_DICTIONARY.md](../DATA_DICTIONARY.md). Pull traffic, channel split, top landing paths, the funnel, conversions by source and organic- or AI-attributable conversions. Filter bots and test accounts. If analytics is unreachable, fire `F-TOOL`, record the gap and continue on Search Console signals. Never invent numbers.

## SERP captures and page types

For the top 3 to 5 commercial keywords (logged out, mobile and desktop, or a web search tool): note AI Overview presence and whether you're cited, and classify each top-10 result with a fixed vocabulary (`product-landing`, `comparison`, `alternatives-list`, `blog-post`, `guide`, `glossary`, `forum-thread`, `video`, `aggregator`, `app-store`). One line per keyword: `keyword | dominant type (count) | our URL | our type`. Flag page-type mismatches. Report web-search-tool consensus as a strong direction, not a precise percentage.

## Do and don't

- Do build first and crawl the output. It's free and exact.
- Do save raw artifacts, not only summaries, so later passes can re-read them.
- Do update the ledger and Session log before stopping.
- Don't block the whole collection on one missing input.
- Don't commit secrets or large binary dumps you won't reuse.
