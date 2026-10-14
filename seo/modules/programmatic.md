# Programmatic SEO and content clusters

> Module of the `seo` skill (Phase 2, strategy). Run for "what content should we build", "programmatic SEO", "content clusters", "what pages should we add to rank". Feeds the `architecture` module. Works without traffic data; sharper with Search Console queries and keyword volumes.

Find the types of pages worth building at scale and the order to build them. Run in its own turn.

## Inputs
- Site structure from the crawl: what pages and sections exist.
- Search Console queries (`<data>/gsc/`): the real demand signal.
- Keyword volume data if you have it.
- Confirmed competitors, for comparison clusters.

## Candidate clusters

Filter hard. Only recommend a cluster where the underlying reality exists.

1. **How-to guides**: "how to <do X> with <category>". High intent from engaged users and useful for AI answers. Pillar = the head term, spokes = specific tasks.
2. **Comparisons and alternatives**: "<competitor> alternative", "<competitor> vs <you>", "best <category> tools". Bottom of funnel. Needs confirmed competitors (see `competitors`).
3. **Glossary**: "what is <term>" pages for the category's vocabulary. Scales well, builds topical authority, and gives AI answers something to cite.
4. **Integration or use-case pages**: "<you> + <tool>", "<category> for <use case>". Only where the integration or use case actually exists.
5. **Persona or segment pages**: "<category> for <segment>". Only if the segments are real and you can show it.

*Add clusters specific to your site (location pages, template galleries, data pages) the same way: a real entity behind every page.*

## What to produce
- The **recommended launch order**, not just the list: what to build first and why.
- A **target URL pattern** per cluster (`/guides/<slug>/`, `/compare/<a>-vs-<b>/`, `/glossary/<term>/`).
- A rough **scale estimate** and the demand signal behind it (impressions, volume, SERP presence).
- Which clusters to **defer**, and why.

## Grounding rules
- Tie each cluster to a specific demand signal. "Build guides" is generic. "Build a setup guide: '<product> setup' shows 90 impressions at average position 18, and 7 of 10 SERP results are guides" is a finding.
- No clusters without a real product behind them (fake comparisons, imaginary segments). They make pages that don't rank.
- Respect the repo: new pages follow the site's existing content structure and slug rules.
- Each cluster needs a pillar-spoke linking plan from the `architecture` module.
