# Site architecture and internal linking

> Module of the `seo` skill (Phase 2, refinement). Run for "internal linking", "site architecture", "pillar pages", "how should pages link". Run after `programmatic` so you know which clusters you're building for.

Design how pages link so authority flows to the pages that should rank and every visitor can reach the main conversion page from anywhere.

## Patterns
1. **Pillar-spoke clusters.** One pillar page targets the head term; 5 to 8 spokes target long-tail variants; all link both ways.
2. **Spoke-to-pillar back-links**, the most commonly missed rule. Every spoke links back to its pillar, not only pillar down to spokes. Standard wording in each spoke: "For the full guide to <topic>, see <pillar title>."
3. **The footer as a free link on every page.** A consistent column structure (for example Product / Learn / Company / Legal) puts every important hub one click from everywhere. Check the footer links to new cluster pages once they exist.
4. **Conversion paths.** Every content page has a clear route to `<main conversion page>`. The architecture serves conversions, not only rankings.

## Inputs
- The existing page list from the crawl.
- The planned clusters from `programmatic`.
- Orphan pages from the crawl (in the sitemap, not internally linked).

## What to produce
- A **pillar-spoke spec** per cluster: which page is the pillar, which are spokes, the exact links to add, and the back-link sentence for each spoke.
- A **footer column proposal** and the diff against the current footer.
- An **orphan-page resolution list**: for each orphan, which hub should link to it.
- Internal links that route content pages to the conversion page.

## Grounding rules
- Tie recommendations to real URLs from the crawl, not hypotheticals.
- Respect the repo's link conventions (trailing slashes, where nav and footer components live).
- This is refinement, not discovery. Use the clusters `programmatic` found; don't invent new ones here.
