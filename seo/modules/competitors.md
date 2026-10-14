# Comparison and alternatives pages

> Module of the `seo` skill (Phase 2, strategy). Run for "comparison pages", "vs pages", "alternatives pages", "competitor SEO". Requires confirmed competitor names. Never guess them: a page built on the wrong competitor is worse than no page.

Plan comparison and alternatives pages that capture high-intent searchers comparing options. Run only after competitors are confirmed (ledger step 1.8).

## Hard prerequisite: confirmed competitors
Read the confirmed list (`<data>/competitors.yaml` or wherever you keep it): each competitor's positioning, differentiators and complaints to verify. Don't go beyond it. If it's missing, fire `F-ANSWER`.

## Formats
1. **"<Competitor> vs <you>"**: the obvious one. Build the strongest competitor's page first.
2. **"<Competitor> alternatives"** / "tools like <competitor>": people actively looking to switch. High intent.
3. **"Best <category> tools"**: a list format; pair with `ItemList` schema (see `ai` and `schema`).
4. **"<Competitor A> vs <Competitor B>", with you as the third option**: the most often missed and most asymmetric. Someone comparing two incumbents is already at the bottom of the funnel; appearing there with a "you haven't considered us" angle reaches people who don't know you exist, and neither incumbent will build that page.

## Method
- **One competitor data file.** Positioning, features, pricing and common complaints per competitor in one YAML or JSON file, so every comparison page stays consistent.
- **Mine real complaints first.** The best "why switch" copy comes from what users say about each competitor: forums, Reddit, review sites, app stores, the competitor's own community. Mine before writing.
- **Stay honest.** Wrong or unfair claims about a competitor are a legal and credibility risk. State only what you can support, and date pricing and feature claims.

## What to produce
- Recommended pages in build order (usually the top "vs" page, then the format-4 page).
- Target URL patterns (`/compare/<a>-vs-<b>/`, `/<competitor>-alternative/`).
- The structure of the competitor data file.
- The honest differentiators that justify each page.

## Grounding rules
- Every page connects to a real demand signal: a "vs" or "alternative" query in Search Console or keyword data, or a SERP you're absent from. "Competitors exist" isn't enough.
- This module decides which pages to build and why. Hand the copywriting to whatever writing workflow you use.
