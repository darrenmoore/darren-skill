<!--
Report skeleton. Copy into <reports>/<YYYY-MM-DD>-<scope>.md and fill it in during Phase 3.
Delete these comments in the finished report. Pass the QA gate (RUNBOOK §5) before shipping.
Keep the main report to what informs a decision; push detail to the appendices.
-->

# <Site> SEO audit and prioritised recommendations

**Prepared:** <date> · **Scope:** <full site / landing pages / content> · **Data sources:** <one line, see Appendix A>

> Re-run this audit about quarterly. Baseline drift after Tier 1 fixes ship (see Verification and tracking).

## Leadership summary
<!-- 60-second entry point. Not a summary of findings, not methodology, not a contents list. -->
- **Decisions needed this week (max 3):** …
- **Biggest opportunity (one sentence):** …
- **How the site works now versus how it should:** …
- **What success looks like at 90 days (an outcome, not a fix list):** …

## Executive summary
<!-- 3 to 4 paragraphs. Open with the one or two reframing findings. One paragraph on what's working.
     Then the findings that set the priority order. Close with a hedged 90-day expectation. -->

## 90-day execution plan
<!-- The spine. Actions, not findings. Owner column. Write this BEFORE the detailed recommendations. -->

**Week 1: fastest or highest-risk**
| Action | Owner | Ref |
|---|---|---|
| … | dev / marketing / content | #N |

**Month 1: highest return**
| Action | Owner | Ref |
|---|---|---|
| … | | #N |

**This quarter: content and authority**
- …

**Deprioritised for now (named on purpose, with why)**
- … : *why not yet*

## Top opportunities
| Priority | Opportunity | Why it's the top lever | Where in report |
|---|---|---|---|
| 1 | … | … (cite the data point) | #N |

## Key findings
<!-- Specifics behind the executive summary. Drop anything not grounded in your data. -->
- **Performance and technical:** … (PageSpeed: LCP, INP, CLS)
- **Indexing:** … (Search Console not-indexed counts and the actual URLs from the crawl)
- **Acquisition and conversions:** … (analytics pulls, or the analytics gap if not connected)
- **SERP environment:** … (page-type table, AI Overview presence, whether you're cited)

## Findings by module
<!-- One short block per module. Only what's specific to this site; the rest goes to the appendix. -->
- **Programmatic:** …
- **AI search:** …
- **Schema:** …
- **Architecture:** …
- **Competitors:** …

## What not to do
<!-- Anti-patterns specific to this site, to prevent backsliding. -->
- …

## Prioritised recommendations
<!-- Single layer. Each item appears once. Tier 1, then 2, then 3. -->
### Tier 1 (Week 1)
**#1. <title>**
- **Impact:** 1 to 5 · **Effort:** <15 min / 1 h / half-day / week / quarter> · **Owner:** …
- **Issue:** … (cite the data)
- **Actions:** …
- **Verification:** …

### Tier 2 (Month 1)
…

### Tier 3 (This quarter)
…

## Programmatic growth
<!-- Launch-order table only. Full playbooks go to Appendix B. -->
| Order | Cluster | Target URL pattern | Why first |
|---|---|---|---|
| 1 | … | `/…/` | … |

## Defer (needs more data)
- … : *what it is and what data it needs first*

## Verification and tracking
- **Baseline:** after Tier 1 ships, run the drift module's `baseline` on the top 10 to 20 commercial URLs (home, top organic landing pages, the main conversion page).
- **Monthly:** drift `compare` on baselined URLs, review Search Console, pull conversions. Triage drift by hand; don't wire it to an auto-alert.
- **90-day targets (hedged):** … (Google re-evaluation takes weeks; AI Overview behaviour is volatile; some changes depend on third parties.)

---

## Appendix A: Data sources
| Source | What it covered | When collected |
|---|---|---|
| Search Console | … | … |
| Analytics | … | … |
| PageSpeed Insights | … | … |
| Crawl (build output / Squirrel Scan) | … | … |
| SERP captures | … | … |

## Appendix B: Programmatic playbooks
<!-- Full cluster templates, URL structures, scale estimates. Implementation reference. -->
