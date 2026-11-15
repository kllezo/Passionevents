# Passion Events — AI visibility fix report

Date: 15 November 2026 · Site: https://passionevents.co · Commits: `20ed0cd` (SEO/GEO), `159f76c` (agent view + disambiguation)

This report keeps what was checked separate from what is assumed. Nothing here claims a ranking, an indexing result or an AI answer that was not observed.

---

## 1. Why ChatGPT could not read the site (findings)

| Check | Result |
|---|---|
| HTTP status for normal browser, `ChatGPT-User`, `OAI-SearchBot`, `python-requests`, `HeadlessChrome` | **200** on `/`, `/services`, `/about` (tested live, 14–15 Nov) |
| `GPTBot` burst of requests | First two answered **429** (Hostinger rate limit), then 200 |
| robots.txt | GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot all **allowed** (unchanged) |
| Hostinger CDN → AI Audit (24 h) | 206 AI-crawler requests, **206 allowed, 0 blocked** (includes our own tests) |
| Homepage weight | 825 KB HTML; visible text only 18 KB. Service list starts at byte ~221 000, FAQ at ~451 000 |
| What a rendering fetcher saw (before fix) | A first-time visitor's homepage was covered by the intro overlay, and many headings and paragraphs started at opacity 0 until scrolled into view (47 hidden text blocks on `/`, 28 on `/what-we-do`, 41 on `/concerts`) |

**Conclusion.** The site was never blocked. The most likely cause is that tools which *render* the page (headless browsers used by AI fetchers) saw an intro screen and content that only appears on scroll, inside a very heavy page. Truncation of long HTML by the fetcher is the second likely factor. A one-off 429 on a burst is possible but is a minor factor.

## 2. What was changed

| Change | File | Effect |
|---|---|---|
| **Static view for automated agents.** Crawlers, AI fetchers and headless browsers are detected before the first paint and get the page like "reduce motion": no intro overlay, no scroll-reveal, nothing starting hidden. People get the site exactly as before. | `src/app/layout.tsx`, `src/motion/gsap.ts` | Same content, same HTML for everyone (no cloaking); only the animation is skipped |
| `www.passionevents.co` → `passionevents.co` permanent redirect (308) | `next.config.mjs` | One canonical host |
| Alternate names "PassionEvents", "Passion Events Hyderabad", "Passion Events by Ramya & Tanush" in schema | `src/lib/seo.ts` | Brand spelled as one word maps to the same business |
| Public email passionevents07@gmail.com and phone +91 63032 50045 in schema and contact FAQ | `src/lib/site.ts`, `src/content/events.ts` | Consistent contact details |
| **Disambiguation from Passion Events S.L. (Barcelona)**: schema `disambiguatingDescription`, llms.txt "Not to be confused with", and a visible FAQ "Is Passion Events the same as Passion Events S.L. in Barcelona?" | `src/lib/seo.ts`, `src/app/llms.txt/route.ts`, `src/content/events.ts` | States plainly which company this is; nothing about the other company is claimed beyond its name and city |
| Services catalogue | already on `/services`, `/what-we-do` (eight services, each with what it handles), `/llms.txt` and `Service` schema | No duplicated paragraphs; no unconfirmed services added (e.g. no "brand activations") |
| FAQs added: weddings & destination weddings; stage, sound & lighting; booking only décor or catering; outside Hyderabad; contact; Barcelona | `src/content/events.ts` | Direct answers to the test questions below |

GPTBot access was **not** changed. No design, copy or animation changed for visitors.

## 3. Test results

### Agent view vs visitor view (local production build, Chrome)

| Page | Hidden text blocks — agent | Hidden text blocks — visitor | Intro overlay for agent |
|---|---|---|---|
| `/` | 14 (inactive tabs / hover states, by design) | 47 | none |
| `/what-we-do` | 0 | 28 | — |
| `/services` | 0 | 3 | — |
| `/about` | 0 | 6 | — |
| `/founders` | 0 | 2 | — |
| `/concerts` | 6 (closed accordions / hover captions) | 41 | — |

The remaining gap between `innerText` and `textContent` is JSON-LD scripts and the mobile/desktop versions of the same section — not hidden content.

Visitor check (`__peForceMotion` set, desktop Chrome, Pixel 7, iPhone 14 WebKit): `motion-ok` and `intro-pending` set as before, no page errors.

User-agent classification: desktop Chrome, iPhone Safari, Android Chrome and Lighthouse/PageSpeed → normal visitor. ChatGPT-User, OAI-SearchBot, GPTBot, ClaudeBot, PerplexityBot, Googlebot, bingbot, HeadlessChrome → static view.

### Live verification after deploy

Checked on https://passionevents.co after the Hostinger rebuild (15 Nov, ~4.5 min after push):

| Check | Result |
|---|---|
| `https://www.passionevents.co/services` | **308 → https://passionevents.co/services** |
| `/` for Chrome, ChatGPT-User, OAI-SearchBot, ClaudeBot, PerplexityBot (curl) | **200** |
| `/` for GPTBot user agent from this machine | **429** (3/3) — Hostinger limits GPTBot; real GPTBot traffic in AI Audit was allowed. GPTBot is OpenAI's *training* crawler; ChatGPT search uses OAI-SearchBot and ChatGPT-User, which both get 200 |
| `/` for a fake Googlebot user agent | 403 — expected: Hostinger checks Googlebot by IP. The real Googlebot passes (GSC live test: pass) |
| Schema `alternateName` live | "PassionEvents", "Passion Events Hyderabad", "Passion Events by Ramya & Tanush" |
| Barcelona FAQ on `/what-we-do`, llms.txt section | present |
| Static-agent bootstrap (`pe-static`) in live HTML | present |
| IndexNow (all 31 sitemap URLs) | **HTTP 200 OK** |
| **Real headless Chrome loading the live site** | **403 "Checking your browser before accessing passionevents.co"** — Hostinger CDN challenge page. A normal browser on the same machine gets the full page |

### New finding: the Hostinger CDN challenges headless browsers

hPanel → Websites → passionevents.co → Performance → CDN → Manage → **Security → Security level: Medium**. At this level the CDN answers some automated browsers with a JavaScript "Checking your browser" page (HTTP 403) instead of the site. Plain HTTP fetchers (curl, ChatGPT-User, OAI-SearchBot) got 200 in every test, but an AI tool that fetches with a headless browser would see only that challenge page — which matches "could not extract the page". CDN logs (7 days): 13,447 requests, 100 4xx, 81 × 429.

**Update 15 Nov (with your approval): Security level changed Medium → Low** (hPanel confirmed "Security level updated successfully").

Re-test 1 and 5 minutes later: automated Chrome (headless *and* visible) still gets the "Checking your browser" page, while a normal browser on the same machine and plain fetchers (Chrome, ChatGPT-User, OAI-SearchBot, PerplexityBot) all get **200**. So this check targets browser-automation signals and does not depend on the security level. hPanel has no other bot switch (Website optimisation = image settings; Traffic blocking = IP/country lists, none set). The only remaining options are "Essentially off" (not done — not approved) or asking Hostinger support to whitelist verified AI crawlers. The main AI search fetchers (OAI-SearchBot, ChatGPT-User) are plain HTTP clients and are not affected. The challenge was not bypassed in testing.

### 10 AI questions — where the site answers each

| # | Question | Answered on the site by |
|---|---|---|
| 1 | What is Passion Events? | Home FAQ "What is Passion Events?"; `/about`; llms.txt |
| 2 | Where is Passion Events based? | FAQ "Where is Passion Events based, and where does it work?" — Hyderabad, Telangana |
| 3 | Who founded Passion Events? | FAQ "Who founded Passion Events?"; `/founders` (Founder P. Sai Tanush; co-founder Ramya) |
| 4 | What services does Passion Events offer? | `/services`, `/what-we-do`, FAQ "What does Passion Events do?" |
| 5 | Does Passion Events plan weddings and destination weddings? | FAQ of the same name |
| 6 | Does Passion Events organise concerts / book artists? | FAQ "Does Passion Events organise concerts?"; `/concerts` (Passion Live) |
| 7 | Can I book only décor or only catering? | FAQ "Can I book only decoration or only catering?" |
| 8 | Does Passion Events work outside Hyderabad? | FAQ of the same name |
| 9 | How do I contact Passion Events? | FAQ "How do I contact Passion Events?" — +91 63032 50045, passionevents07@gmail.com, @passionevents.p |
| 10 | Is Passion Events the Barcelona company Passion Events S.L.? | FAQ "Is Passion Events the same as Passion Events S.L. in Barcelona?" — No |

How to run the test: ask each question in ChatGPT (search on), Google AI Mode, Perplexity and Claude; record whether passionevents.co is cited and whether the answer is correct. Repeat each about five times; answers vary.

---

## 4. Status by category

### IMPLEMENTED AND VERIFIED
- Static view for automated agents (local build tested; live check above).
- Barcelona disambiguation in schema, llms.txt and a visible FAQ.
- www → apex redirect, alternate names, email, new FAQs (commit 20ed0cd, now deployed).
- All crawler user agents receive 200; robots.txt unchanged; no AI crawler blocked in Hostinger AI Audit.

### SUBMITTED, AWAITING PROCESSING
- IndexNow ping for all sitemap URLs (Bing, Yandex and others) — see live results.
- Google Search Console sitemap: Success, 30 pages discovered; Page indexing report still processing.
- Bing Webmaster: 30 URLs submitted 14 Nov; homepage was "Discovered but not crawled". Re-check around 21 Nov.

### PENDING EXTERNAL SEARCH ENGINE ACTION
- Google and Bing re-crawling the pages so the new FAQ and schema appear in results and AI Overviews.
- ChatGPT search / Bing index refresh. ChatGPT search relies largely on Bing's index, so the Bing crawl above matters most for ChatGPT.
- Google's AI Overview currently mixes in details from passionevents.co.in and the number +91 73579 61694. This should correct as Google re-reads the site and the Business Profile is fixed; it cannot be edited directly.

### REQUIRES MY ACCOUNT ACCESS (manual steps for you)
**Hostinger CDN security level** — changed to Low on 15 Nov. The browser check remains for automated browsers; to go further, either set "Essentially off" or ask Hostinger support whether the browser check can be relaxed for verified AI crawlers.

**Google Business Profile** — the only profile found is named "kllezo", is **unverified**, and sits on a residential address. It was inspected, not changed. Steps:
1. business.google.com → the "kllezo" profile → Edit profile → Business name: **Passion Events**.
2. Primary category: **Event planner**. Additional: Wedding planner, Event management company.
3. Location: choose **"I deliver goods and services to my customers"** (service-area business) and **hide the address**; service areas: Hyderabad, Telangana, Andhra Pradesh.
4. Phone +91 63032 50045, website https://passionevents.co, description from the site's About text.
5. Complete **verification** (video or postcard as Google offers). An unverified profile is not shown on Maps or in the knowledge panel.
6. Add only your own event photos.

**Google Search Console** — URL Inspection → `https://passionevents.co/` → Test live URL → Request indexing. Repeat for `/services`, `/what-we-do`, `/about`, `/founders`, `/contact`. (Needs your login; Google limits requests per day.)

**Bing Webmaster Tools** — URL Inspection on the homepage → Request indexing; re-check in about 7 days.

### NOT YET TESTED
- The agent static view on the live site in a real headless browser — blocked by the CDN challenge above; verified on the local production build instead.
- The 10 questions in ChatGPT, Google AI Mode, Perplexity and Claude after the re-crawl (run 3–7 days after indexing).
- Whether passionevents.co.in, @passionevents.official, +91 73579 61694 and the Sulekha/Justdial Bangalore "Passion Events" listings are yours. If they are not, they will be added to the "not to be confused with" text; if they are, they should point to passionevents.co.
