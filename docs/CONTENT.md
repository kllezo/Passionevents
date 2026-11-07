# Editing copy & imagery

All static content lives in `src/content/` — no component changes needed.

| File | What it controls |
| --- | --- |
| `media.ts` | Every image on the site: brand logo variants, founder portrait, and the temporary stock imagery. |
| `events.ts` | The six "What we do" categories (copy, services, images), individually bookable service groups, the Discover → Plan → Create → Execute approach, "Why Passion Events" points and FAQs. |
| `categoryStories.ts` | Page-specific signature content: wedding rituals, the corporate run sheet (illustrative), private occasions, the destination journey and the production build steps. |
| `founders.ts` | Founder names, roles, biographies, focus areas and portraits. |
| `live.ts` | Passion Live "What we handle" items and collaboration cards. |
| `../lib/site.ts` | Business name, tagline, base city, contact person, the "50+ events executed" figure. |

## Imagery policy

- **Client-supplied:** the Passion Events logo and the portrait of P. Sai Tanush (credit: Phani Gogireddy / 24 Frames — shown under the photo).
- **Temporary stock:** everything under `stock` in `media.ts` comes from Unsplash under the [Unsplash License](https://unsplash.com/license). It is used only as mood/category imagery (hero, category pages, "Moodboard" sections) and is **never** presented as Passion Events' own work.
- **Real work:** the portfolio, Passion Live shows, past experiences and artist imagery come exclusively from the admin dashboard uploads.

### Replacing stock with your photography

1. Put optimised JPG/WebP files in `public/media/<section>/…` (2000px on the long edge is plenty).
2. In `src/content/media.ts`, change the entry, e.g.
   ```ts
   heroCanopy: { src: "/media/home/hero.jpg", alt: "Describe the photo" },
   ```
3. Keep alt text descriptive — it's used for accessibility and SEO.

## Founder information

`founders.ts` only contains facts provided so far (names, co-founder roles, Tanush as the client contact, the "By Ramya & Tanush" signature). **Please review the biography wording** and add anything you'd like — milestones, background, Ramya's portrait (`image: { src, width, height, alt }`).

## Things intentionally left for the client

- Phone, email, WhatsApp, Instagram → environment variables (see SETUP.md).
- Real event photography, concerts, artists, sponsors, testimonials → publish through `/admin` when available. No placeholders pretend to be real.
- Business address / registration details → not shown anywhere until provided.
