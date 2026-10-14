# SEO audit runbook

A stateful runbook: both the instructions and the execution record. Adapted from Chris Cooke's public SEO audit runbook (see the README credit). Written for an agentic coding tool that can run terminal commands, fetch URLs and, optionally, drive a browser.

Paths below use `<data>` for your audit data folder and `<reports>` for reports (set in SKILL.md).

## Bounded updates

For "update the SEO picture" or "plan the next content", use this route instead of restarting the full audit. Read the cross-session memory and the latest dated report first, and reconcile commits since the newest shipped entry. A commit proves a source change; record live verification separately before calling anything deployed.

1. State the scope, the evidence cutoff date and the current branch and commit. Keep a small **Next / Doing / Done** list at the top of the ledger and leave older audit history underneath. Never reset a finished audit to incomplete.
2. Recheck the specific open findings on source and live pages. An item in the backlog is not proof it is still open: reconcile it with what shipped and with the source before recommending it.
3. Reuse existing data collection. Missing credentials in this session means "unavailable here", not "not instrumented". Ask once for access or exports and carry on with independent work.
4. Capture fresh public evidence before interpreting changes. Record crawl limits and bot protection. A live sitemap total describes your inventory, not Google's index. Detect `urlset` versus `sitemapindex` from the XML, not the filename. Pages scheduled for a future date aren't failures.
5. Carry historical metrics with exact dates. For trends keep the longest Search Console history available (up to 16 months), monthly data and matched 28-day windows. Never compare a partial month with a full one. Split brand and non-brand, page, locale and device where it matters. Keep a search-engine sample distinct from a controlled SERP check or an AI-assistant response.
6. Write a small content sequence: audience, the existing URL that owns the topic, your unique first-hand contribution, dated demand evidence or an explicit hypothesis, outline, assets and permissions, calls to action and internal links, acceptance criteria and measurement. Refresh existing pages before inventing overlapping URLs. Respect ruled-out decisions and anything already scheduled.
7. Save descriptively named, dated reports and update the open backlog. Move only shipped work to the shipped log. A finished plan is not a shipped page.

A bounded update doesn't get a sitewide score, a generic 90-day plan or a "full audit complete" label. Fact and link QA still apply.

**Measurement rules.** Filter bots before computing any rate. Show denominators and observation windows, and give a window time to mature before reading it. Don't use a user's current state as a stand-in for history (a user who is a paying customer today tells you nothing about when they converted; use the conversion event and its timestamp). Keep different measures separate and never relabel one as another (for example: visitors, clicks on the main call to action, signups, activated users).

**SEO restraint.** Check current Google search feature support before recommending schema; features get restricted or retired (FAQ rich results are the usual example; check [Google's search updates](https://developers.google.com/search/updates)), while visible FAQ content can stay useful to readers. Lab performance runs are not field Core Web Vitals. Security-header crawler warnings are not SEO priorities on their own. Never prune or rewrite a page on age, word count, traffic or an unindexed state alone.

## §0 Operating principles

- **Keep the ledger live.** Update §2 after every completed item, not in batches. It is what survives context resets and multi-session audits.
- **Read the cross-session memory first** (shipped, open, ruled out). Never re-recommend a shipped item or a ruled-out idea. On finishing, move shipped items to the shipped log and add new opportunities to the backlog.
- **Never guess.** Competitor names, rankings and conversion numbers come from the user or the data. If you don't have them, fire a fallback (§6) and move on.
- **Crawl before modules.** Strategy modules interpret data; run Phase 1 first.
- **Degrade gracefully.** A missing tool or login is normal. Do what you can, record the gap, fire the matching fallback, keep going. A partial audit with honest gaps beats a stalled one.
- **The human owns logins and judgment.** Never handle passwords. The user pastes exports or authorises a browser session.

## §1 Setup (one-time)

| Need | How |
|---|---|
| Built site to crawl | `<your build command>` → read `<build output folder>` |
| PageSpeed Insights | free public API, no key needed for light use: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<URL>&strategy=mobile` |
| Google Search Console | CSV exports, an API pull if you've set one up, or a browser session the user logs into (`F-LOGIN`) |
| Keyword volume data | Google Keyword Planner or another source, if you have one; otherwise `F-ANSWER` |
| Analytics | whatever [DATA_DICTIONARY.md](DATA_DICTIONARY.md) maps (GA4 export, your own events table, Plausible, etc.) |
| Squirrel Scan CLI (optional) | `squirrel audit <site-url> --max-pages <n> --coverage full --format llm --output <data>/crawl/squirrel-report.txt`. Check `squirrel audit --help` for current flags. If absent, crawl the build output and note it. |

## §2 Progress ledger (copy into `<data>/_ledger.md` and keep current)

```
# SEO audit ledger
Updated: <timestamp>   Scope: <scope>   Data maturity: <new|establishing|mature>

## Phase 1: Data collection
[ ] 1.1 Search Console performance (12 months, queries + pages)  → data/gsc/
[ ] 1.2 Search Console indexing (not-indexed reasons + 404s)     → data/gsc/
[ ] 1.3 Analytics (acquisition + conversions)                     → data/analytics/
[ ] 1.4 PageSpeed Insights (home + top pages)                     → data/psi/
[ ] 1.5 Crawl (build output, + Squirrel Scan if present)          → data/crawl/
[ ] 1.6 Manual page audits (home, main conversion page, top landing page) → data/crawl/
[ ] 1.7 SERP captures + page-type classification                  → data/serp/
[ ] 1.8 Competitor names confirmed (user)                         → ledger
[ ] 1.9 robots.txt + sitemap structure                            → data/crawl/

## Phase 2: Modules (each in its own subagent turn; checklist pass LAST)
[ ] 2.1 programmatic
[ ] 2.2 ai
[ ] 2.3 schema
[ ] 2.4 architecture
[ ] 2.5 competitors (needs 1.8)
[ ] 2.6 checklist pass

## Phase 3: Synthesis
[ ] 3.1 Collect + deduplicate
[ ] 3.2 Cross-reference every item to a data point
[ ] 3.3 Tier / impact / effort / owner
[ ] 3.4 Write the 90-day plan FIRST
[ ] 3.5 Assemble report → reports/<date>-<scope>.md
[ ] 3.6 QA gate (§5)

## Phase 4: Drift (after Tier 1 fixes ship)
[ ] 4.1 Baseline top URLs → baselines/

## Blockers queue
- (none yet)

## Session log
- <timestamp>: <one line>
```

## §3 Phase 1: Data collection

Each step: Goal, Method, Success, Fallback. Practical commands are in [`modules/data.md`](modules/data.md).

### 1.1 Search Console performance
- **Goal:** 12-month queries and pages tables (impressions, clicks, CTR, average position).
- **Method:** Performance → Search results → Queries tab and Pages tab, 12 months, exported as CSV; or an API pull; or a browser session the user logs into.
- **Success:** two CSVs in `data/gsc/` with more than 4 weeks of data.
- **Fallback:** `F-LOGIN` or `F-FILE`. With no performance history at all, set maturity to new and skip the checklist pass.

### 1.2 Search Console indexing
- **Goal:** counts and URL lists for "Crawled, currently not indexed", "Discovered, currently not indexed", "Duplicate, Google chose different canonical", and 404s.
- **Method:** Indexing → Pages → each reason → export.
- **Success:** URL lists in `data/gsc/`, cross-checked against the crawl (1.5) to find the actual pages.
- **Fallback:** `F-FILE`.

### 1.3 Analytics
- **Goal:** acquisition and conversion funnel over the Search Console date range: visits by source, landing pages, conversions, and conversions attributable to organic search and AI assistants.
- **Method:** follow [DATA_DICTIONARY.md](DATA_DICTIONARY.md). Save the pull and the queries or report settings used.
- **Success:** a short pull in `data/analytics/`.
- **Fallback:** `F-TOOL` or `F-ANSWER` if analytics is unreachable. Record the gap and continue on Search Console signals. Don't invent numbers. Apply the measurement rules above.

### 1.4 PageSpeed Insights
- **Goal:** performance score plus LCP, INP, CLS and TBT for the homepage and top 3 to 5 pages, mobile.
- **Method:** the free API per URL. Note the third-party summary and any asset domains that aren't your production domain.
- **Success:** JSON or notes per URL in `data/psi/`.
- **Fallback:** `F-TOOL` (rare).

### 1.5 Crawl (before any module)
- **Goal:** code-level inventory: every page's title, meta, H1, canonical, schema; broken links; internal nofollow; orphan pages; JSON-LD validity.
- **Method:** build, then crawl the build output directly (highest fidelity). Optionally run Squirrel Scan against the live site for rendered output and headers. Its most useful categories are structured data, links and accessibility.
- **Success:** crawl output in `data/crawl/`, with the specific URLs behind the "crawled, not indexed" count identified.
- **Fallback:** `F-TOOL` if Squirrel Scan isn't installed; note that rendered and header checks were skipped.

### 1.6 Manual page audits
- **Goal:** look at the load-bearing pages yourself: home, the main conversion page, the top organic landing page from 1.1, one article, one docs or help page.
- **Method:** read the built HTML: H1, title, meta description, canonical, JSON-LD present and valid.
- **Fallback:** none; always doable from the build.

### 1.7 SERP captures and page-type classification
- **Goal:** for your top 3 to 5 commercial keywords, capture the SERP and classify each top-10 result by page type, to spot page-type mismatches (your blog post against a SERP of product pages).
- **Method:** search each keyword (logged out, mobile and desktop) or use a web search tool. Note AI Overview presence and whether you're cited. Classify with a fixed vocabulary, for example: `product-landing`, `comparison`, `alternatives-list`, `blog-post`, `guide`, `glossary`, `forum-thread`, `video`, `aggregator`, `app-store`. One line per keyword: `keyword | dominant type (count) | our URL | our type`.
- **Success:** a table in `data/serp/`. Flag every keyword where your page type differs from the dominant type; that usually outranks technical findings.
- **Fallback:** `F-ANSWER` for keyword choice if Search Console data is thin. Web search tools often return 6 to 8 results and no "People also ask", so report consensus as a strong direction, not a precise percentage.

### 1.8 Competitor names, confirmed by a human
- **Goal:** the real competitors you position against.
- **Method:** read the confirmed list file. Ask only if it is missing or stale.
- **Fallback:** `F-ANSWER`. Don't build comparison strategy on a guess.

### 1.9 robots.txt and sitemap
- **Goal:** confirm crawl directives and sitemap structure.
- **Method:** read `robots.txt` and the sitemap from the build. If the build already asserts they exist, this is a content check: is anything important disallowed or missing from the sitemap?

## §4 Phase 2: Modules

Run each module in [`modules/`](modules/) in its own subagent turn, against the real Phase 1 data. Save each output for synthesis. Order:

1. `programmatic`: content clusters.
2. `ai`: AI search, `llms.txt`, AI-readable pages, third-party citations.
3. `schema`: JSON-LD depth and correctness.
4. `architecture`: pillar-spoke internal linking and footer.
5. `competitors`: comparison pages (needs 1.8).
6. Checklist pass last: a sweep for gaps the others missed (needs 4+ weeks of Search Console data).

## §5 Phase 3: Synthesis and QA gate

Follow METHODOLOGY.md "Synthesis". Assemble the report from [report-template.md](report-template.md). Don't ship it until every box passes:

- [ ] The Executive Summary opens with a reframing finding, not a contents list.
- [ ] The 90-day plan is on page 2, grouped by execution window, with an owner column and a Deprioritised row.
- [ ] Every recommendation cites a specific data point (Search Console, analytics, PageSpeed or crawl).
- [ ] Every content or keyword recommendation has demand data behind it, or is labelled a hypothesis.
- [ ] Confidence calibrated: no unofficial thresholds stated as Google specs; "consistent with" for patterns you can't confirm.
- [ ] No build-enforced check is reported as a finding.
- [ ] Thin-site guard: if maturity is new or establishing, recommendations read as strategy, not as false data-backed precision.
- [ ] The report says to re-run the audit about quarterly and to baseline drift.

## §6 Fallback blocks

When blocked, show the user one of these (fill the brackets), record it in the Blockers queue, and continue with what's still doable.

- **F-LOGIN**: "I need you to log in. Please open <service> and either (a) authorise the browser session I'm driving, or (b) export <exact report> and save the CSV to `<data>/<folder>/`. I never handle your password. I'll continue with the steps that don't need this meanwhile."
- **F-FILE**: "I need a file I can't generate myself: <exact export> from <service>. Steps: <click path>. Save it to `<data>/<folder>/` and tell me when it's there."
- **F-ANSWER**: "This needs your judgment, not data I can pull: <question, e.g. confirm competitors / pick the top commercial keywords / analytics access>. I'll hold the dependent step and carry on with the rest."
- **F-TOOL**: "This step wants <tool> which isn't available here. Install: <one line>. For now I'll fall back to <alternative> and note what that misses."

## §7 End-of-session checkpoint

Before stopping: save all artifacts under `<data>/`, tick the ledger rows you completed, update the ledger timestamp, move open blockers into the Blockers queue, and append one line to the Session log. That is what lets the next session resume cleanly.
