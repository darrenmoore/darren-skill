# Data dictionary (template)

Fill this in once per site so an agent can answer the questions an audit needs without guessing: where do visitors come from, what do they land on, and how many convert? Generic SEO advice assumes GA4. Use whatever you actually have, and write down how to read it here.

Delete the guidance in italics as you fill each section. Keep secrets out of this file: name the environment variable or secret store that holds a credential, never the value.

## 1. Sources at a glance

| Question | Source | Access | Owner of access |
|---|---|---|---|
| Did they find us in search? (impressions, queries, CTR, position) | Google Search Console | `<CSV export / API with service account / browser session>` | `<who can grant it>` |
| Did they land, and from where? (visits, referrers, landing pages) | `<GA4 / Plausible / your own events table / server logs>` | `<export / API / read-only DB role in env var NAME>` | |
| Did they convert? (signups, purchases, leads) | `<analytics events / app database / CRM>` | | |
| How fast is it? (lab performance) | PageSpeed Insights API | public, no key for light use | |
| Real-user performance (field Core Web Vitals) | `<CrUX / Search Console CWV report / your RUM>` | | |
| What's on the site? (crawl) | build output `<folder>` and, optionally, Squirrel Scan | local | |
| Keyword demand | `<Keyword Planner / Search Console queries / other>` | | |

*Search Console is the upstream half (did they find us?). Analytics is the downstream half (did they land and convert?). A complete audit joins them: Search Console says a query gets impressions, analytics says whether those landings convert.*

## 2. Connection

*For each source that isn't a manual export: how the agent connects, read-only, and where the credential lives. Include a minimal "is it working" check (a one-line query or API call) so the agent can test access before relying on it. Timezone and timestamp format matter for date ranges; record them.*

- Engine or service: `<...>`
- Credential: `<env var name or secret store path>`, read-only. Never commit it; never write with it.
- Smoke test: `<one command or query>`
- Timestamps: `<UTC ISO strings / local time / epoch>`

## 3. Event and table map

*Name the events or tables that answer each question, with the columns that matter. Keep it to what an audit uses.*

| Concept | Where it lives | Key fields | Notes |
|---|---|---|---|
| Page view | `<event or table>` | visitor id, session id, path, referrer, UTM, timestamp, bot flag | |
| Main call-to-action click | | | which CTAs fire it, and since when |
| Conversion | | user id, timestamp, source | |
| Activation or retention signal | | | |
| Self-reported source ("how did you hear about us") | | | |

## 4. The questions an audit asks, with queries

*Write one saved query, report config or export recipe per question. Take a date range as parameters.*

- **A. Traffic over a range**: page views, visitors, sessions, bots excluded.
- **B. Visits by channel**: bucket referrers only where the bucket merges true synonyms (search engines, AI assistants, the big social networks). Let everything else fall through to its actual referrer host, so a new source shows up as its own domain instead of vanishing into "other". Treat your own domain as internal navigation, not acquisition.
- **C. Top landing paths**: first page per session.
- **D. Conversions over a range**: from the conversion event and its timestamp, not from a user's current state.
- **E. Funnel**: view → main CTA click → conversion → activation, with a denominator at every step.
- **F. Conversions attributable to organic search and AI assistants**: report two signals side by side if you have them: the referrer of the converting visitor's first visit, and the self-reported source. They won't match exactly; note the gap.
- **G. Locale or country split**, if you serve more than one market.

## 5. Caveats to carry into every report

*List what makes the numbers misleading on your site. Common ones:*

- **Bots and test accounts.** Which flag or filter removes them. Crawlers that execute JavaScript can swamp the visitor denominator and make every conversion rate look like it collapsed.
- **Tracking coverage changes.** If an event only started firing on some pages from a date, earlier rates are floors, not rates. Record the cutover date.
- **Direct traffic.** Apps, bookmarks and stripped referrers inflate "direct". Don't read it as brand strength without corroboration.
- **Two sources of "source".** Referrer data is per visit and objective; self-report is per conversion and catches word of mouth. Report both.
- **Privacy.** Hashed identifiers stay hashed. Don't try to de-anonymise.
- **What this data can't tell you.** Impressions, query CTR and SERP position stay in Search Console.

## 6. Maintenance

Re-check this file when the event vocabulary or tracking changes, and note the date at the top.
