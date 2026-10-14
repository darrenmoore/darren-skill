# Drift monitoring (Phase 4)

> Module of the `seo` skill. Run for "baseline the SEO", "did the deploy break SEO", "check for SEO regressions", "compare against baseline". Baseline after fixes ship; compare monthly and after deploys.

Turn the point-in-time audit into something you can detect regressions against. A crawl tells you what's broken now. Drift tells you what changed since last time, per URL, and catches the specific deploy that stripped a canonical or dropped schema, which a quarterly crawl would miss.

Snapshots live in `<baselines>/`.

## What a baseline captures (per URL)
Title, meta description, canonical, meta robots, H1/H2/H3 lists, JSON-LD, Open Graph tags, Core Web Vitals (from PageSpeed Insights), HTTP status, content hash. Store the raw values as well as the hash so a compare can show exactly what changed.

## Commands (a manual, judgment-driven workflow)
| Command | Purpose | When |
|---|---|---|
| `baseline <url>` | capture current state as known good | after Tier 1 fixes ship; before a planned migration; before major content changes |
| `compare <url>` | diff current state against the stored baseline | monthly; after deploys; on an unexpected ranking drop |
| `history <url>` | show changes across baselines | ranking-drop investigations |

Cheapest implementation on a site you own: snapshot those fields from the built HTML (plus one PageSpeed call per URL) into `<baselines>/<date>/<url-slug>.json`. `compare` diffs the latest against the previous. No extra tooling needed.

## Which URLs
The top 10 to 20 commercial URLs: homepage, the main conversion page, top organic landing pages from Search Console, and any page that just received Tier 1 fixes. Don't baseline broken pages: fix first, then lock the good state.

## Severity and triage
- **Critical:** canonical changed, H1 gone, schema fails validation, status not 200.
- **Warning:** title or meta swing, Open Graph change, Core Web Vitals regression.
- **Info:** minor copy changes.

For each critical or warning item, judge intent. A deliberate content change means re-baseline. An accidental deploy regression means flag it for a fix. The judgment is the value; the diff is only the trigger.

## What drift doesn't replace
Rank tracking, Search Console monitoring, the full crawl, and content-quality judgment (a title can change from good to bad and still pass a length check).

## Do and don't
- Do baseline after fixes ship and re-baseline after intentional changes.
- Do triage by hand.
- Don't wire `compare` to an auto-alert cron and email. It produces 10 to 30 mostly intentional or noisy findings per run and trains everyone to ignore the channel.
