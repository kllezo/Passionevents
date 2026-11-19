# Passion Events — SEO recovery report (19 Nov 2026)

Evidence was gathered on 19 Nov 2026 from Google Search Console (sc-domain:passionevents.co), live Google results, the production site and the git history. Nothing here is estimated unless it says so.

## A. Root cause

**What the data shows (confirmed)**

| Period | Brand queries ("passion events", "passionevents") | Source |
|---|---|---|
| 11–17 Nov | 46 impressions, 20 clicks, average position **2.4** ("passionevents" 1.0, "passion events" 2.5) | GSC, 7 days |
| Last 24 h (18–19 Nov) | "passion events" 55 impressions, 1 click, average position **4.9** | GSC, 24 hours |
| 19 Nov, one logged-in search from Hyderabad | Not in the top 19 for "passion events" / "passionevents"; **#1** for "passion events by ramya & tanush" | Google results |

The site did not disappear from Google. It slipped from about position 2 to about 5 for "passion events", and in some people's results it drops off page one (results vary by person, device and location).

**What changed just before the slip (confirmed in git)**
- **17 Nov (c3a2f3a):** ten city pages using one template, and about 140 Q&As across 19 pages. Ten of those Q&As were self-promoting questions: "Who is the best event management company in Hyderabad?", "Who is the best wedding planner in …?", "Who are the top event planners…?", "Which event company plans luxury…?" and similar, all answered "Passion Events".
- **18 Nov (4c35c96):** the business schema on every page began naming passionevents.co.in and Passion Events S.L. (Barcelona) in its description.

**Most likely causes (hypotheses; the timing fits, but Google doesn't confirm causes)**
1. **Content written for search engines.** Self-promoting "who is the best" Q&As and near-identical city pages are patterns Google's helpful-content and spam systems are built to discount. The simpler site that ranked had neither.
2. **Same-name competition on a two-week-old domain.** "Passion Events" is shared by passionevents.co.in, a Barcelona company, and Delhi and Bangalore businesses. On a new domain, early rankings swing a lot.
3. **Weak links to the website.** Your own Instagram (@passionevents.p) and MeraEvents pages rank #1–2 for the brand, but they don't point Google strongly at passionevents.co.
4. **Naming the competitor domain on every page** may have tied the two brands together for Google. Low confidence.

**Ruled out (checked)**
- Robots blocks, noindex mistakes, wrong canonicals, redirect chains or server errors.
- Duplicate-canonical problems, a manual action, or CDN blocking.
- All 30 sitemap URLs return 200 with a self-canonical and one H1.

## B. Changes made (commit on perf/optimize; not yet deployed)

| File | Change |
|---|---|
| `src/content/qa.ts` | 10 self-promoting questions reworded into real customer questions, with honest answers ("How do I choose an event management company in Hyderabad?", "Do you plan weddings in {city}?", "Do you plan birthday parties in Hyderabad?" …). No content removed. |
| `src/content/qa.ts` | `indexedCities` is now empty. /event-management/hyderabad joins the other city pages as noindex, follow, because it competed with the home page for "event management company in Hyderabad". The pages stay live for visitors. |
| `src/lib/seo.ts` | Schema description no longer names passionevents.co.in or the Barcelona company. It still says "Its only website is passionevents.co". The llms.txt disambiguation for AI assistants is unchanged. |
| `src/content/areas.ts` | Telangana page title and H1 now target the state ("Event Management in Telangana — Warangal, Khammam & More"), so the page stops competing with the home page for Hyderabad. |

No design, animation or layout changes were made.

## C. URL-level audit (production, 19 Nov)

| URL | Issue found | Action | Canonical | Google status |
|---|---|---|---|---|
| / | Owns "event management company in Hyderabad" plus the brand; two other pages competed with it | Competitors de-targeted | self | Indexed, crawled 19 Nov |
| /event-management/hyderabad | Same intent as the home page | noindex, follow; out of sitemap | self | Was never indexed |
| /event-management/telangana | Title "Hyderabad & Telangana" overlapped the home page | Retitled to Telangana | self | Indexed |
| /event-management/{9 other cities} | One template with the city swapped | Already noindex (471f096) | self | Not indexed (correct) |
| /about, /what-we-do, /weddings, /corporate-events, /private-events, service pages | Self-promoting "best/top" FAQs | Reworded | self | Mixed (see section F) |
| /concerts, /concerts/about, /concerts/events, /concerts/partners, /contact, /destination-events, 4 concert show pages | "Discovered – currently not indexed" | Validation running (started 19 Nov). Pages are linked from 8–22 other pages, so not orphaned | self | Waiting for Google to crawl |

## D. Keyword map (one main page per intent)

| Intent | Main URL |
|---|---|
| Passion Events (brand); event management company / event planners in Hyderabad | / |
| Wedding planners Hyderabad; haldi, mehendi, sangeet planners | /weddings |
| Corporate event management Hyderabad; conferences; product launches | /corporate-events |
| Concert organisers Hyderabad; artist booking; live entertainment | /concerts |
| Birthday and private party planners | /private-events |
| Destination weddings and events | /destination-events |
| Event design and production; stage, sound, lighting | /event-production |
| College fest organisers | /services/college-fests-and-cultural-events |
| Individual services (one service only) | /services |
| Event management in Telangana / Andhra Pradesh / Bengaluru | /event-management/{telangana, andhra-pradesh, bengaluru} |

**Overlaps fixed:**
- Home vs /event-management/hyderabad vs /event-management/telangana for "event management Hyderabad".
- "Who is the best…" questions repeated across the home page, About, What we do and city pages.

## E. City pages

| Group | Pages |
|---|---|
| Strong, keep indexed | Bengaluru (region page with real concert work), Telangana, Andhra Pradesh |
| Needs its own work, photos and details before indexing | Hyderabad (also overlaps the home page), Vijayawada, Visakhapatnam, Tirupati |
| Not yet justified by local evidence | Warangal, Khammam, Guntur, Amaravati, Rajahmundry, Kurnool |

To bring a city back into Google: add real events done there (with photos), venues used and city-specific details, then add its id to `indexedCities`.

## F. Validation (local production build, 19 Nov)

- Type check and `next build`: pass.
- Sitemap: 27 URLs locally; production will list 29 (the 2 extra concert pages come from the production database). /event-management/hyderabad is removed.
- `/event-management/hyderabad`: `noindex, follow`. Home page, /weddings, /about, Telangana and Bengaluru: indexable.
- No "Who is the best" or "Who are the top" text, and no "Not affiliated" text, on any tested page.
- FAQPage schema renders the new questions (checked on /about).
- robots.txt (live): allows Googlebot, Bingbot, OAI-SearchBot, GPTBot, PerplexityBot and ClaudeBot; blocks /admin and /api only.
- Search Console: 17 pages indexed; 12 "Discovered – currently not indexed" (validation started); 2 "Page with redirect" (www → apex, expected). Home page crawled 19 Nov 4:27pm. Sitemap read 19 Nov: Success.

## G. Actions only you can take

1. **Approve the deploy** of this commit.
2. **Google Business Profile:** set Website = https://passionevents.co. Check that the category is "Event planner" or "Event management company", and add your services and service areas (no fake address).
3. **Instagram @passionevents.p bio:** link to https://passionevents.co. It ranks #2 for your brand, so this link carries the most weight.
4. **MeraEvents organiser page and Facebook page:** add the website link.
5. **Reviews:** ask real clients for Google reviews.
6. **Search Console:** I'll re-request indexing for the remaining pages once the daily quota resets (scheduled 20 Nov, 3:23pm). Requesting is not a guarantee of indexing.

## H. Status

| Issue | Status |
|---|---|
| Self-promoting FAQ content | Fixed in code; waiting for deploy and recrawl |
| Home / Hyderabad / Telangana overlap | Fixed in code; waiting for deploy and recrawl |
| Near-duplicate city pages | Fixed and verified live (471f096); Hyderabad added in this commit |
| Competitor names in schema | Fixed in code; waiting for deploy |
| 12 pages discovered but not crawled | Waiting on Google (validation started; requests scheduled) |
| Weak links from your own profiles | Needs your action (section G) |
| Brand ranking back to #1 | Not guaranteed. Depends on recrawl, the section G links, and time on a shared name |

**Note:** the `agentic-awesome-skills` router you asked for is not installed in this environment. This work used the installed SEO/GEO skill. The files FEATURES_SO_FAR.md, CURRENT_ARCHITECTURE.md and NEXT_TASKS.md don't exist in this repository, so this report is the record of the work.
