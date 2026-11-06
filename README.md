# Passion Events — Dual-Experience Platform

Two digital universes for one brand:

| Universe | Routes | Language |
| --- | --- | --- |
| **Passion Events** — luxury editorial | `/`, `/about`, `/services`, `/weddings`, `/corporate-events`, `/private-events`, `/destination-events`, `/portfolio`, `/portfolio/[slug]`, `/founders`, `/contact` | Ivory, rose, coral, mint · Cormorant Garamond + Manrope + script accents · botanical line-drawing, clip-path editorial reveals, Lenis smooth scroll |
| **Passion Live** — futuristic concerts | `/concerts`, `/concerts/events`, `/concerts/events/[slug]`, `/concerts/about`, `/concerts/partners` | Void black, neon volt/violet/laser · Anton + Space Grotesk · canvas stage lighting, waveform system, interactive guitar & drums, kinetic type |
| **Studio admin** | `/admin` (login, overview, events & shows, enquiries) | Secure dashboard for non-technical owners |

## Quick start

```bash
npm install
cp .env.example .env          # then fill SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
vercel env pull .env.local    # Postgres + Blob credentials from Vercel (or set your own)
npx prisma migrate deploy     # applies migrations
npm run admin:create          # creates the admin from ADMIN_* env vars
npm run dev                   # http://localhost:3000
```

Production: `npm run build && npm start`. See **[docs/SETUP.md](docs/SETUP.md)**, **[docs/CONTENT.md](docs/CONTENT.md)** and **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.

## Stack

Next.js 16 (App Router, Cache Components, Turbopack) · TypeScript · Tailwind CSS v4 · GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG) · Lenis · Prisma 6 + PostgreSQL (Neon) · Vercel Blob · Zod · jose (signed session cookies) · bcryptjs · sharp · lucide-react.

Three.js was deliberately **not** added: every 3D-feeling effect (guitar, stage beams, lasers) is SVG/Canvas 2D, which keeps the bundle small and mobile-friendly.

## Architecture

```
src/
  app/
    (events)/          Passion Events universe (layout = ivory nav, footer, cursor)
    concerts/          Passion Live universe (layout = dark nav, sound provider)
    admin/             login + (dashboard) group, server actions in actions.ts
    api/enquiries      public enquiry endpoint (JSON + no-JS form fallback)
    api/admin/upload   authenticated image upload (sharp → WebP)
    api/media/[...]    serves uploaded images from UPLOAD_DIR
    sitemap.ts robots.ts manifest.ts not-found.tsx error.tsx
  components/
    events/            editorial components, botanical SVG system, home sections
    live/              stage canvas, waveform, guitar, drums, posters, sections
    shared/            universe transition, enquiry form, JSON-LD, media image
    admin/             event form, login form
  motion/              GSAP setup, Lenis, RevealText, ImageReveal, Magnetic, Counter…
  content/             ALL editable copy & imagery (media.ts, events.ts, founders.ts, live.ts)
  lib/                 db, auth (session + DAL), validation (zod), uploads, SEO, site config
prisma/                schema + migrations
scripts/               create-admin.ts, generate-brand-assets.py
assets-source/         original client logo + founder photo (never modified)
```

### Key decisions
- **One event model powers both listings.** `experience = EVENTS` → portfolio; `experience = LIVE` → concerts (upcoming / past / artists). Public queries are hard-filtered to `status = PUBLISHED`.
- **Nothing is invented.** Portfolio, shows, past experiences and artists render only admin-published data, with designed empty states otherwise. Contact channels render only when configured.
- **Security.** Signed httpOnly session cookie (8h), optimistic `proxy.ts` gate, plus server-side `requireAdmin()` in every admin page, server action and API route. bcrypt hashes, login + enquiry rate limits, honeypot, image re-encoding (strips EXIF, rejects non-images), path-traversal-safe media serving.
- **Motion.** GSAP `matchMedia` gates every animation on `prefers-reduced-motion`; canvases pause off-screen and in hidden tabs; particle counts are capped and reduced on mobile; custom cursor only on fine pointers; no audio ever autoplays (guitar/drum sound is opt-in synthesis).
