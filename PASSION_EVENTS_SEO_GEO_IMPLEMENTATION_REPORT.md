# Passion Events — SEO, GEO & Brand Discovery Implementation Report

Date: 15 November 2026 · Site: https://passionevents.co · Stack: Next.js 16 (App Router, server-rendered with partial prerendering), hosted on Hostinger (auto-deploys from GitHub `main`).

Status key: **Completed** (implemented and verified) · **Submitted** (accepted by a search engine, awaiting processing) · **Pending** (waiting on search-engine processing) · **Manual action required** (needs your account or business verification).

---

## Summary

| Area | Finding | Status |
|---|---|---|
| Brand search | "PassionEvents" → passionevents.co is **#1** (exact domain match). "Passion Events" (spaced) is a common business name shared by many companies; in a fresh Google search from this machine the site was not on page 1, but Search Console shows **23 impressions, 10 clicks, average position 2.7** for "passion events" (11–13 Nov). Visibility varies by searcher and location. | Fixes completed; ranking is pending |
| Technical SEO | **www.passionevents.co served a duplicate copy of the site (HTTP 200).** Now permanently redirected to passionevents.co. No other blocking issues found. | Completed (live after deploy) |
| Google indexing | Domain property verified; sitemap read 13 Nov, **Success, 30 URLs discovered**. Page-indexing report still "processing data" (new property). | Pending |
| Google Business Profile | The only profile in your account is named **"kllezo"**, not Passion Events, and is **unverified** ("Verification required"). Unverified profiles do not appear in Search or Maps. | **Manual action required** |
| Bing | Live URL test passes ("URL can be indexed by Bing"); all 30 URLs submitted 14 Nov. Homepage still shows the stale "Discovered but not crawled / DNS" record from the domain's previous owner. | Submitted / Pending |
| IndexNow | Implemented (key file at `/<key>.txt`, `scripts/indexnow.mjs`); every submission returned HTTP 200. | Completed |
| ChatGPT search | `OAI-SearchBot` explicitly allowed in robots.txt; homepage and service pages return **200** to its user-agent; all content is server-rendered HTML. | Completed |
| Google AI Overviews / AI Mode | Pages indexable, no `noindex`/`nosnippet`, clear entity data and FAQs. Google's AI Overview currently **mixes Passion Events with passionevents.co.in** and shows a second phone number. | Eligible; disambiguation needs your input |
| Performance | Measured earlier this month (calibrated Lighthouse): mobile 60–73, desktop 78–84; accessibility, best practices and SEO 100. Heavy blur effects since removed on phones. Not re-measured in this pass. | — |

---

## A. Initial audit

| # | Issue | Evidence | Severity | Correction |
|---|---|---|---|---|
| 1 | `www.passionevents.co` returns the full site (duplicate host) | `curl https://www.passionevents.co/` → 200 (http→https already redirected). Its canonical pointed to the apex, which limited the damage. | Medium | Permanent redirect www → apex (`next.config.mjs`). Verified locally: `Host: www.passionevents.co /weddings` → 308 → `https://passionevents.co/weddings`. |
| 2 | Spaced brand query weak | Google "Passion Events" (gl=in): page 1 = Sulekha (Bangalore), Passion Conferences (US), Paris Passion Events (Vizag), Tradeindia (Delhi), Justdial (Pune), and your Instagram. "PassionEvents": passionevents.co #1, /about also on page 1. | High (business impact) | Root causes in section "Brand search" below. Entity signals strengthened (alternate names, site name, contact data, FAQs); the main remaining levers are a verified Business Profile and consistent external listings. |
| 3 | Business Profile not showing | business.google.com: 1 business, named "kllezo", 0% verified, "Verification required". | High | Manual steps in section F. |
| 4 | Brand confusion in AI answers | Google AI Overview for "Passion Events" cites passionevents.co.in and lists "+91 73579 61694 / +91 6303250045". | High | Needs confirmation whether passionevents.co.in, @passionevents.official and the Sulekha/Justdial Bangalore listings belong to you (section H). |
| 5 | Email missing everywhere | Not in schema or on the page (environment variable unset). | Medium | Supplied email now published (footer, contact blocks, schema, FAQ). |
| 6 | Entity data lacked the one-word spelling | EventPlanner `alternateName` had no "PassionEvents"; WebSite had no `alternateName`. | Medium | Added (Google site-name guidance: `WebSite` with `name` + `alternateName` on the homepage). |
| 7 | FAQ gaps | No direct answers for weddings/destination weddings, stage/sound/lighting, booking only décor or catering, working outside Hyderabad. | Low–medium | Four answers added to the visible FAQ (and its FAQPage data); contact answer now lists phone and email. |
| 8 | Bing stale record | URL Inspection: "Discovered on 01 Jan 2006 … DNS failed"; Live URL test passes. | High (blocks Copilot/ChatGPT discovery via Bing) | Indexing requested 14 Nov; awaiting Bing. |

Checked and fine: HTTPS everywhere; `http://` → `https://` 301; trailing-slash variants 308 to one URL; unknown URLs return real 404s; robots.txt allows all public pages (only `/admin` and `/api/` blocked); no stray `noindex` on public pages (the standalone `/launch.html` is intentionally `noindex, follow`); one H1 per page; titles, descriptions, Open Graph and canonicals set on every route; sitemap lists only canonical, indexable URLs (30 + the code-defined show pages); internal links crawlable (`<a href>`); 33 pages × 8 screen sizes load without console errors.

## Brand search — why "PassionEvents" beats "Passion Events"

1. **Exact domain match.** The one-word query is literally the domain name, so Google maps it to passionevents.co with high confidence.
2. **A shared, generic name.** "Passion Events" is used by unrelated companies in Bangalore, Delhi, Pune, Vizag, Europe (passionevents.eu, passionevents.org) and the US (Passion Conferences). Google treats the spaced query as ambiguous and shows a mix.
3. **A new site with little authority yet.** The domain changed owners recently (Bing still held the previous owner's record), the Search Console property is days old, and few other websites link to passionevents.co. Your Instagram (10K+ followers) currently carries more authority than the website.
4. **No verified local entity.** Without a verified Business Profile named "Passion Events", Google has no local knowledge-panel entity to tie the brand to the site.
5. **Look-alike brands nearby.** passionevents.co.in and @passionevents.official also present as "Passion Events", and Google's AI already merges details from them.

What the code now does about it: names the business **Passion Events** everywhere, declares **PassionEvents** and **passionevents.co** as alternate names (business and website data), states Hyderabad and India-wide service consistently, links the Instagram and MeraEvents profiles via `sameAs`, publishes the real phone and email, and answers the questions people ask. No duplicate pages or hidden text were created.

## B. Implemented changes (this pass)

| File | Change | Why |
|---|---|---|
| `next.config.mjs` | 308/301 redirect: host `www.passionevents.co` → `https://passionevents.co/:path*` | One canonical host |
| `src/lib/site.ts` | Phone `+91 63032 50045` and email `passionevents07@gmail.com` as defaults (env vars still override) | Supplied contact details, published consistently |
| `src/lib/seo.ts` | EventPlanner `alternateName` adds "PassionEvents"; WebSite gets `alternateName: ["PassionEvents","passionevents.co"]` and `url` with trailing slash | Brand-variant and site-name signals |
| `src/content/events.ts` | +4 FAQs (weddings & destination weddings; stage, sound & lighting; booking only décor or catering; outside Hyderabad); contact answer lists phone and email | Real customer questions, answered from published facts |
| `PASSION_EVENTS_SEO_GEO_IMPLEMENTATION_REPORT.md` | This report | — |

Already in place from earlier work (verified in this audit): EventPlanner (LocalBusiness subtype) with Hyderabad address locality only (no invented street address), India-wide `areaServed`, founders as `Person`, `hasOfferCatalog` of services, `disambiguatingDescription`; WebSite and WebPage (with dates) on the homepage; Service, BreadcrumbList, BlogPosting, MusicEvent (only for real, documented shows) and FAQPage on their pages; `/llms.txt` (optional aid, not a ranking factor); IndexNow key and script.

Not added on purpose: aggregate ratings or reviews, a street address or coordinates, awards, extra social profiles, Event markup for anything undocumented.

## C. Google

- **Search Console:** domain property `passionevents.co` verified. Performance (11–13 Nov): 15 clicks, 45 impressions; "passion events" 10 clicks / 23 impressions / position 2.7; "passion event management" 1 click.
- **Sitemap:** `https://passionevents.co/sitemap.xml`, submitted 13 Nov, last read 13 Nov, **Success**, 30 pages.
- **Indexing:** Page-indexing report "Processing data, please check again in a day or so". A `site:passionevents.co` search shows the main pages indexed.
- **Structured data:** every JSON-LD block on `/`, `/what-we-do` and `/contact` parses; types EventPlanner, WebSite, WebPage, FAQPage, BreadcrumbList, ItemList. Run Google's Rich Results Test on the live homepage after deploy (section H).
- **Outstanding (Manual action required):** after this deploy, URL Inspection → *Request indexing* for `/`, `/what-we-do`, `/contact`, `/founders` (once each).

## D. ChatGPT search (OpenAI)

- robots.txt: `User-Agent: OAI-SearchBot` → `Allow: /` (also GPTBot and ChatGPT-User allowed, as previously decided; GPTBot left unchanged).
- Requests with the OAI-SearchBot user-agent: `/`, `/what-we-do`, `/weddings`, `/contact`, `/founders` → **200**.
- Hostinger's bot protection blocks *fake* Googlebot/Bingbot user-agents from non-Google/Bing IPs (expected). It cannot be confirmed from here that OpenAI's real IP ranges (https://openai.com/searchbot.json) are never challenged; check Hostinger's firewall/bot settings or access logs for `OAI-SearchBot` hits (Manual action required).
- Content is server-rendered HTML: business name, location, services, contact details and FAQs are readable without JavaScript.

## E. Bing & Copilot

- Webmaster Tools: site verified; sitemap known (23→30 URLs); all 30 URLs + homepage submitted 14 Nov (quota 100/day).
- URL Inspection (15 Nov): homepage still "Discovered but not crawled" (stale record). Live URL test (14 Nov): "can be indexed", "No SEO/GEO issues".
- IndexNow: HTTP 200 for 31 URLs (15 Nov). Submission ≠ indexing.
- AI Performance report: available only once pages are indexed. Re-check in 1–2 weeks.
- DuckDuckGo (uses Bing): `site:passionevents.co` → no results yet.

## F. Business entity & Google Business Profile

**Website, schema and FAQs now agree on:** Passion Events (alt. PassionEvents) · Hyderabad, Telangana · serving Andhra Pradesh, Telangana and India · +91 63032 50045 · passionevents07@gmail.com · Instagram @passionevents.p · By Ramya & Tanush · 50+ events.

**Business Profile — exact steps (Manual action required, in business.google.com):**
1. Open the existing profile and **rename it to `Passion Events`**. No keywords in the name.
2. **Primary category: Event planner.** Secondary: Wedding planner, Event management company, Party planner (and Entertainment agency if you want the concert side represented).
3. Because you don't receive customers at the Miyapur address, set it up as a **service-area business**: hide the street address; service areas Hyderabad plus the cities you actually serve (e.g. Vijayawada, Visakhapatnam, Guntur, Warangal, Bengaluru).
4. Website `https://passionevents.co`, phone `+91 63032 50045`, hours (or "by appointment"), opening date.
5. Description (≤750 characters), for example: *"Passion Events is a Hyderabad event management company — By Ramya & Tanush — planning weddings, destination weddings, concerts, corporate events and private celebrations across Andhra Pradesh, Telangana and India. Book a single service — décor, catering coordination, photography, stage, sound and lighting, artists, accommodation or transport — or hand us the whole event from concept to execution. 50+ events executed. Big or small, we make it special."*
6. Services: list the individual services above.
7. Photos: logo, cover, and real event photos (e.g. the 24 Frames galleries). No stock images.
8. **Verify** (Google will offer video or phone verification). Nothing appears publicly until this is done.
9. Reviews, the honest way: after each event, send a direct review link and ask the client to mention the type of event. Never offer incentives, gate reviews or post reviews yourself.

**External authority (legitimate only):** add passionevents.co to your Instagram bio and MeraEvents organiser profile; ask venues you work with (e.g. Illuzion 2.0), photographers (24 Frames) and artists to link the site when they post about shared events; claim or correct any directory listings that really are yours (Justdial, Sulekha, WedMeGood) with identical name, phone and city; pursue genuine local press.

## G. Content

- **Improved:** What we do FAQ (7 → 11 answers), contact answer, homepage entity data.
- **Already present:** dedicated pages for weddings, corporate events, private events, destination events, event production, concerts (Passion Live), individual services, region pages (Telangana, Andhra Pradesh, Bengaluru), founders, blog guides, and show pages with real photos (Sameera Bharadwaj, Mohana Bhogaraju).
- **Still needed (client material):** more real event write-ups with city, scope and photos (weddings especially); genuine client feedback you're happy to publish; photos for Geetha Madhuri and Paatashala Band shows; Ramya's biography.

## H. Outstanding work

| Needs | Task |
|---|---|
| Your decision | Deploy this change set |
| Your input | Are **passionevents.co.in**, **@passionevents.official**, the **+91 73579 61694** number, and the Sulekha/Justdial "Passion Events" listings in Bangalore yours? If not, we add them to the "not to be confused with" text; if yes, we link them as official profiles. |
| Google account | Business Profile rename, categories, service area, verification (section F) |
| Google account | After deploy: Request indexing for `/`, `/what-we-do`, `/contact`, `/founders`; Rich Results Test on the homepage |
| Bing account | Re-inspect the homepage in ~7 days; if still "DNS failed", contact Bing Webmaster support |
| Hosting | Confirm Hostinger bot protection doesn't challenge OpenAI's published IP ranges; optional: set `NEXT_PUBLIC_CONTACT_EMAIL` (the code default already covers it) |
| Client material | Event write-ups, photos, approved feedback (section G) |

## I. Monitoring plan

Track separately in Search Console (Performance → Queries, filter "contains"): `passion events`, `passionevents`, `passion events hyderabad`, `passion events india`, `passion events weddings`, `passion events concerts`, `passion events event management`. Record clicks, impressions and average position weekly.

**Days 1–30:** after deploy, request indexing (section C); verify the Business Profile; re-check Bing URL Inspection weekly; confirm the www redirect and the Page-indexing report; watch GA4 for referrals from `chatgpt.com`, `bing.com` and `copilot.microsoft.com` (absence of referrals doesn't prove absence of visibility).

**Days 30–90:** compare brand-query positions with the 11–13 Nov baseline; check Bing's AI Performance report once pages are indexed; review the Business Profile's search/maps views; add at least two real event case studies; add legitimate links from venues, artists and partners. No ranking position or AI citation can be guaranteed; these steps maximise eligibility.
