# SEO audit methodology

The why. The how is in [RUNBOOK.md](RUNBOOK.md).

Adapted from Chris Cooke's public SEO audit methodology and runbook (see the README credit), which targets client sites with GA4 and an agency toolchain. This version assumes you are auditing your own site with whatever data you actually have: Google Search Console, your own analytics (mapped in [DATA_DICTIONARY.md](DATA_DICTIONARY.md)), the free PageSpeed Insights API, and a crawl of your built output.

## The core insight

**Skills don't replace data collection, they interpret it.** A module run against "it's a SaaS app" produces generic advice. The same module run against pasted Search Console queries, real conversion numbers, PageSpeed scores and crawl findings produces recommendations that cite specific numbers and URLs. Collect the data first. Everything downstream depends on it.

## Data maturity: what you can run when

Don't run data-hungry analysis against thin data. Decide where the site sits before starting.

| Stage | Search Console | Analytics | What to run |
|---|---|---|---|
| New (0 to 4 weeks) | Coverage only (indexing, 404s) | Sparse | Crawl and PageSpeed only. Fix code-level issues. Hold the strategy modules. |
| Establishing (1 to 3 months) | Early, noisy performance | Some conversions | Crawl, PageSpeed, and the `schema`, `architecture`, `programmatic` modules at strategy level. Hold the checklist pass. |
| Mature (3+ months, no migration) | Meaningful queries, CTR, impressions by page | Reliable acquisition and conversion funnel | Full Phase 1 and every module. The minimum for a genuinely specific audit. |

### Which module needs which data

| Module | Minimum data | Runs without Search Console? |
|---|---|---|
| Crawl (built output, or Squirrel Scan) | none, code-level | yes, always first |
| PageSpeed Insights | none | yes |
| `programmatic` | site structure and product context | yes, strategy is data-independent |
| `architecture` | existing page list | yes |
| `schema` | crawl output | yes |
| `competitors` | confirmed competitor names (ask, don't guess) | yes, once confirmed |
| `ai` | top commercial queries help | partly, generic without query data |
| checklist pass | 4+ weeks of performance data | no, generic without it |

### Always actionable, regardless of data age

Code-level findings don't depend on traffic history, so fix them on sight: missing or duplicate meta, missing H1, orphan pages, oversized images, missing alt text, invalid JSON-LD. Skip any your build already guards.

## The four phases

1. **Data collection**: gather raw signals before invoking any strategy module (the `data` module).
2. **Module application**: run each strategy module against the collected data, one per turn.
3. **Synthesis**: combine, deduplicate, prioritise, structure into the report.
4. **Drift monitoring**: turn the snapshot into something you can detect regressions against (the `drift` module).

## What the build already enforces

If your build or CI fails on SEO basics (missing canonical or OG tags, meta description length, missing sitemap or robots.txt, localhost URLs in output, heading-level skips, missing `noindex` on private pages), list those checks in SKILL.md setup. They are true on every deploy, so they are not findings. A useful audit spends its words on what the build can't check: keyword and content strategy, AI search, schema depth and correctness, internal linking, and per-deploy drift.

## Synthesis (Phase 3)

1. **Collect** every module output into one staging doc, one heading per module. Don't edit yet.
2. **Deduplicate.** Several modules surface the same finding (comparison pages show up in programmatic, competitors and the checklist). Keep the most detailed version.
3. **Cross-reference with raw data.** Drop any recommendation that doesn't connect to a specific Search Console, analytics, PageSpeed or crawl data point. Generic means cut it or make it specific.
4. **Assign tiers:**
   - Tier 1 (Week 1): security or indexing bugs, anything broken and fixable in under an hour.
   - Tier 2 (Month 1): highest return. Conversion-path fixes, performance, top-impression content upgrades, tracking gaps.
   - Tier 3 (This quarter): content clusters, comparison pages, programmatic launches.
   - Defer: items that need data you don't have yet (backlinks, deeper analytics).
5. **Assign impact (1 to 5), effort (T-shirt size) and owner** (marketing, dev, content).
6. **Write the 90-day plan first**, before detailing individual recommendations. If an item won't make the 90-day plan, question why it is in the report at all.

## Report design

The biggest failure is a report that reads like a complete inventory: 50 findings, the reader feels paralysed and shelves it. Aim for a decision memo: here's what matters most and why, here's what to do first, here's everything else if you need it.

1. **The executive summary opens with the reframing finding**, not a contents list. One or two findings that change how you see your own situation ("the category term we should own ranks on page 2 while a competitor owns the AI Overview"). State what's working in one paragraph. End with a realistic, hedged 90-day expectation. No methodology, no bullet dumps, no false precision.
2. **The 90-day plan is the spine** (page 2, not the end). Actions, not findings ("fix X", not "X was found"). Grouped by execution window, with an owner column and a Deprioritised row that names what you are deliberately not doing and why.
3. **The appendix is for noise**, not overflow. Test: would a decision-maker reading this section change what they do? If not, appendix.
4. **Calibrate confidence.** Don't cite unofficial numbers as Google specs ("100 internal links", "1,500 DOM nodes", "exactly 155 characters"). Use "consistent with" for patterns you see correlates of but can't confirm (AI Overview suppression, crawl-budget effects). Soften absolute schema claims: Google may extract partial information even from invalid JSON-LD. Test: could you defend the claim if a developer asked for the primary source?

## Prompting tips

- One module per subagent turn. Chained modules produce mixed, unattributable output.
- Front-load data: paste the actual numbers and URLs into each prompt.
- Say "apply this to our data", not "tell me about SEO for <industry>".
- Run the checklist pass last.
- Use crawl output as a forcing function. Specific URLs and scores in the prompt make it hard for recommendations to drift generic.
