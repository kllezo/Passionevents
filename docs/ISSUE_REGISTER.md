# Issue register — redesign & audit pass (2026-11-13)

Found by rendering every main route in headless Chrome (Playwright, installed
Google Chrome) at 1366×768, 1440×900, 1920×1080, 768×1024 and 390×844, plus
code inspection. Status: ✅ fixed and verified · 🟡 implemented, needs assets or
client input · ⏸ not changed (reason given).

## P0 — Critical

| # | Issue | Status |
|---|---|---|
| P0-1 | Reels could not play on the site (every reel opened Instagram). Instagram's official embed is switched off for these reels (verified: the embed page says "The link to this photo or video may be broken"). | 🟡 In-site player built (`ReelPlayer`): play/pause, mute, volume, seekable progress, full screen, prev/next, keyboard. Plays any reel with a `video` file; reels marked `embed: true` use Instagram's official embed inside the viewer. Reels without a file show a clearly labelled fallback. **Needs the original MP4s** (or embedding turned on in Instagram). |
| P0-2 | Player bug: an interrupted `play()` (AbortError) was treated as "sound blocked" and muted the video. | ✅ Only `NotAllowedError` falls back to muted. |
| P0-3 | Player bug: videos without duration metadata broke the progress bar (max = Infinity). | ✅ Guarded. |

## P1 — Major functional / visual

| # | Issue | Status |
|---|---|---|
| P1-1 | Site looked zoomed in on desktop: display headings 100–150 px at 1366 px (vw-based clamps), 160 px section padding, long pinned scroll sections. Home page was ~33,000 px tall at 1366×768 and the hero headline ran below the fold. | ✅ Fluid display type −20 % (decorative giant words kept), section padding 160→128 px, pinned lengths shortened (fly-through 340→200 %, "Nine worlds" 440→256 %), Approach un-pinned, capability cards shorter. Home now ~23,000 px; hero (headline, text, CTAs) fits 1366×768. |
| P1-2 | Full-screen "Weddings" category hero with floating category panel (CinematicShowcase). | ✅ Removed from home; component deleted. |
| P1-3 | Green "Why Passion Events" section repeating services. | ✅ Removed (home + About). Its seven points kept, verbatim, as one horizontal "What you can count on" sequence inside How we work. |
| P1-4 | "Make some noise" crowd check (HypeMeter) on Passion Live. | ✅ Removed; soundtrack and player untouched. |
| P1-5 | Motto repeated 7 times (hero headline, fly-through, loading curtain, footer ×2, About, enquiry intro, founders). | ✅ Shown once, after the founder profiles. Hero now "From first idea / to the final / applause." |
| P1-6 | Founders side by side with a separate "Shared promise" block. | ✅ Stacked and alternating: Tanush (photo left), Ramya (photo right); motto as their shared philosophy. Portrait animation now soft-focus-to-sharp + arch opening, plays once, photo visible without JS. |
| P1-7 | Home portfolio block showed an empty "Our story book is being curated" panel (no published stories in production). | ✅ Hidden until the first story is published in the admin; reels section shows the real work. |
| P1-8 | Home order didn't match the brief; reels buried inside the studio intro. | ✅ Hero → studio → overview → capabilities → how we work → (portfolio) → reels → founders → answers → 50+ → enquiry. |
| P1-9 | Passion Live production capabilities: six identical cards in a pinned horizontal track. | ✅ Production portfolio grid: one dominant stage frame + five supporting frames of different sizes, wipe-in reveal, hover light sweep; text always visible on touch. Labelled as illustrative, links to the real concert reels. |
| P1-10 | Partner cards: static grid. | ✅ Expanding row (hover/focus widens a card, colour photo, text + CTA reveal; others contract). Tap-to-expand stack on phones/tablets. Mobile title/description overlap found in testing and fixed. |

## P2 — Performance, responsiveness, accessibility

| # | Issue | Status |
|---|---|---|
| P2-1 | Sound prompt stayed over the content for the whole Passion Live page (with the player bar and nav pill = three sound controls). | ✅ Prompt steps aside after the first screen or 15 s; the nav SOUND pill remains. |
| P2-2 | Live soundtrack kept playing under a reel with sound. | ✅ Soundtrack suspends while a reel plays with sound, resumes after. |
| P2-3 | Next.js 16 dev "params outside Suspense" insight on /services/[slug], /event-management/[region], /blog/[slug]. | ✅ `export const instant = false` (same as portfolio/[slug]); pages stay prerendered. |
| P2-4 | Horizontal overflow | ✅ None at any tested width (360–1920). |
| P2-6 | Passion Live nav: MENU button pushed past the screen edge on phones (logo + sound pill + menu wider than 360–390 px). | ✅ Smaller logo below 640 px, tighter gaps, icon-only menu button (name kept for screen readers), equaliser dots hidden below 420 px. Measured: fits at 360, 390, 430, 768. |
| P2-5 | Console errors / failed requests | ✅ None on any tested route after fixes. |

## P3 — Polish

| # | Issue | Status |
|---|---|---|
| P3-1 | Unused components (ExperienceExpand, FoundersJoin) | ✅ Deleted. |
| P3-2 | Stale comment claiming a cursor follow-spot | ✅ Corrected (no cursor-following code exists). |

## Checked and already in place (no change needed)

Standard cursor everywhere (no custom cursor code) · white SOUND ON/OFF pill in the Live nav · white "Return to Passion Events" pill with the floral logo · nine-section /what-we-do with per-service routes · procedural original soundtrack (no copyrighted audio) with honest SOUND ON/OFF state.

## Waiting on the client

- Reel MP4 files (or Instagram embedding turned on) — see `src/content/reels.ts`.
- Real event photography to replace the illustrative stock images.
- Portfolio stories published from the admin dashboard.
- Ramya's full biography; confirmation of College fests and Artist management as stand-alone services.
- Privacy page wording (analytics is live).
