# AI search (GEO / AEO)

> Module of the `seo` skill (Phase 2, strategy). Run for "AI SEO", "GEO", "AEO", "show up in ChatGPT / AI Overviews", "llms.txt", "get cited by AI". The structural recommendations don't need data; the suppression check needs Search Console impressions and CTR. The `schema` module validates the schema this implies.

Improve visibility in AI-generated answers (Google AI Overviews, ChatGPT, Perplexity, Claude and others). The structural wins are cheap on a site you control. Run in its own turn.

## Low-effort moves
1. **`/llms.txt`**: a Markdown index of your key pages at the domain root, so AI agents can find what matters (what the product is, pricing, docs, key guides). About 30 minutes. Justify it by near-zero cost, not by guaranteed effect.
2. **AI-readable pages**: plain, parseable pages for the questions AI gets asked about you: what it is, what it costs, how to start, who it's for. A Markdown or very plain HTML pricing page is the classic example.
3. **`ItemList` schema** on list and comparison pages, so the list can be extracted directly. Coordinate with `schema`.
4. **Third-party citation presence**: AI answers cite forums, Reddit, YouTube, review sites, directories and wikis, not only your site. Produce a concrete list of platforms where presence would make you citable.

## AI Overview suppression check (needs Search Console)
If informational pages show many impressions at good positions but almost no clicks, Google may be answering in the SERP. Call it "consistent with AI Overview suppression", not as a cause; Search Console alone can't confirm it. The fix differs from normal low-CTR work: restructure content with explicit question-style subheadings so the page becomes the cited source, and build third-party citations. Meta description tweaks won't move it.

## What to produce
- A short list of structural changes (`/llms.txt`, AI-readable pages, `ItemList` targets) with effort estimates.
- The platform list for third-party presence.
- Any suppression-consistent patterns, hedged, with the specific pages and impression and CTR numbers.

## Calibration rules
- Don't overstate. Much of GEO is still speculative; say so.
- Skip the "create a Wikipedia article" move; conflict-of-interest deletion is a real risk. Make sure citable content exists, then pursue third-party citation.
- Distinguish a search-engine sample from a controlled check or an AI-assistant response, and date every observation. AI answers change week to week.
