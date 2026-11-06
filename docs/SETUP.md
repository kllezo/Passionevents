# Setup & configuration

## 1. Environment variables (`.env`)

Copy `.env.example` to `.env`. Every variable is documented there.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | `file:./dev.db` locally. Use a hosted Postgres/MySQL URL in production (see DEPLOYMENT.md). |
| `SESSION_SECRET` | ✅ | ≥ 32 random characters. Signs admin session cookies. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public URL, e.g. `https://www.passionevents.in`. Used for canonical URLs, sitemap, Open Graph. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | once | Used by `npm run admin:create`. Password ≥ 10 characters. You can delete `ADMIN_PASSWORD` from the file afterwards. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional | Digits with country code, e.g. `919876543210`. Enables WhatsApp buttons. |
| `NEXT_PUBLIC_CONTACT_PHONE` | optional | Shown in footer / contact section. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | optional | Shown in footer / contact section. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | optional | Full Instagram profile URL. |
| `RESEND_API_KEY` + `ENQUIRY_NOTIFY_TO` | optional | Emails every new enquiry via [Resend](https://resend.com). `ENQUIRY_NOTIFY_FROM` must use a domain verified in Resend. |
| `UPLOAD_DIR` | optional | Where admin uploads are stored (default `./uploads`). Must be persistent storage in production. |

> Contact details are **not** hard-coded anywhere. Anything left blank is simply hidden on the site. The admin overview shows a setup checklist.

## 2. Admin account

```bash
npm run admin:create                                   # from ADMIN_* variables
npm run admin:create -- owner@example.com "Long-Pass-Phrase" "Owner Name"   # or explicit
```

Running it again for the same email resets that password. Sign in at `/admin`.

## 3. Managing content (no code needed)

**Events & shows → New event**

1. Choose where it appears:
   - **Passion Live show** → `/concerts` (upcoming if the date is today or later, otherwise *Past experiences*). Artist names entered here feed the public *Artists & performers* section.
   - **Passion Events portfolio** → `/portfolio` and the matching category page (Weddings, Corporate…).
2. Fill in details, date/time (India Standard Time), venue, city, booking URL (shows only).
3. Upload a poster/feature image, a cover image and gallery photos (JPG/PNG/WebP/AVIF ≤ 15 MB; they are resized and converted automatically). Add alt text for accessibility and SEO.
4. **Save draft** keeps it private. **Publish** makes it public immediately. You can also publish/unpublish from the list.

The *Book tickets* button only appears when a booking URL is present and the status isn't Sold out / Cancelled / Completed.

**Enquiries** lists every website form submission with contact details, services requested and a status (New → Contacted → Closed).

## 4. Regenerating brand assets

`assets-source/` holds the original logo and founder portrait. If they change:

```bash
npm run brand:assets     # needs Python 3 + Pillow
```

This regenerates the transparent logo, favicons (cropped from the floral ring), Apple touch icon, manifest icons, Open Graph images and founder image sizes.
