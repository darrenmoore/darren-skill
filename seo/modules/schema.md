# Schema and structured data

> Module of the `seo` skill (Phase 2, validation). Run for "schema", "structured data", "JSON-LD", "rich results". Run after the `ai` module so you validate the schema those recommendations imply.

Make sure the JSON-LD is present, correct and the right type per page. Run after the crawl has captured current schema (`<data>/crawl/`). Before recommending any type for a rich result, check that Google still supports that result; features get restricted and retired.

## Per-page schema map (adapt to your page types)

| Page type | Schema | Notes |
|---|---|---|
| Homepage | `Organization` + `WebSite` | `Organization.logo` as a URL string; `Organization.url` required. |
| Product or pricing page | `SoftwareApplication` / `Product` with `offers` | Match the type to what the page sells. No `Product` on non-commercial pages. |
| Blog post or article | `Article` / `BlogPosting` | `publisher.name`, `publisher.logo` and `image` present and valid. |
| Docs or help page | `Article` / `TechArticle` + `BreadcrumbList` | Breadcrumbs help deep pages surface in results. |
| Comparison or "best X" list | `ItemList` | Lets AI systems and Google extract the list. Coordinate with `ai`. |
| Glossary term | `DefinedTerm` in a `DefinedTermSet` | For the glossary cluster from `programmatic`. |
| Video page | `VideoObject` | |

## Common failures to flag
- `Organization.logo` as an `ImageObject` wrapper where a URL string was expected.
- Missing `Organization.url`.
- `Article` missing `publisher.name`, `publisher.logo` or `image`.
- Several separate `<script type="application/ld+json">` blocks on one page that should be one `@graph` array.
- Schema that doesn't match the page content.

## What to produce
- Current-state validation per audited page, naming the specific field that's wrong.
- The recommended type and a minimal correct JSON-LD snippet per page type.
- A note on consolidating multi-block pages into `@graph`.

## Calibration rules
- Soften absolute claims. "The schema fails validation, which likely prevents rich-result eligibility; Google may still extract some entity information" is defensible. "Google rejects the whole block" overstates documented behaviour.
- Keep three things separate: schema.org validity, Google rich-result eligibility, and what actually displays.
- Validate against the built HTML, not assumptions, and point fixes at the layout or component that emits the schema.
