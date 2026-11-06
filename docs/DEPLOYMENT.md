# Deployment checklist

The app is a standard Next.js 16 server (`npm run build && npm start`, Node 20.9+). It needs three things that a laptop provides for free but production must provide explicitly:

## Vercel (current setup)

Project: `acm4/passionevents`. The build runs `npm run vercel-build` = `prisma generate && prisma migrate deploy && next build`.

| Need | Provided by | Env vars |
| --- | --- | --- |
| Database | Neon Postgres (Vercel Marketplace) | `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (migrations) |
| Uploads | Vercel Blob store `passionevents-uploads` | `BLOB_READ_WRITE_TOKEN` |
| Admin sessions | generated secret | `SESSION_SECRET` |

- Uploaded images go to Blob when `BLOB_READ_WRITE_TOKEN` is set; otherwise to `UPLOAD_DIR` on local disk.
- Vercel caps request bodies at ~4.5 MB, so the admin form resizes photos in the browser before upload.
- Local development uses the same Postgres: `vercel env pull .env.local`, then `npm run dev`.
- Create the first admin against production: pull env vars, then `npm run admin:create -- you@example.com "long passphrase" "Name"`.

## 1. A persistent database
Postgres is required (the schema uses `provider = "postgresql"`). Any Postgres works — set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` (same value if there is no pooler).

## 2. Persistent upload storage
Vercel Blob (above), or a mounted volume via `UPLOAD_DIR` on a VPS.

## 3. Secrets
`SESSION_SECRET` (required), plus any optional contact / Resend variables. Never commit `.env`.

## Recommended extras
- **Rate limiting** uses an in-memory map (`src/lib/rate-limit.ts`). With several instances, replace it with Redis/Upstash.
- **Email notifications**: verify a sending domain in Resend and set `RESEND_API_KEY`, `ENQUIRY_NOTIFY_TO`, `ENQUIRY_NOTIFY_FROM`.
- **Domain**: set `NEXT_PUBLIC_SITE_URL` to the final https URL before building so canonical URLs, sitemap and Open Graph tags are correct.
- **Search Console**: submit `https://your-domain/sitemap.xml`.

## Verified before handover
- `npm run build` succeeds (all routes partially prerendered or dynamic as intended).
- `npx tsc --noEmit` and `npx eslint src` are clean.
- Admin login/logout, wrong-password rejection, create draft, upload poster + gallery, draft hidden publicly (404), publish → visible on `/concerts`, `/concerts/events` and the detail page with artists + booking button, unpublish → hidden, delete → rows and files removed.
- Enquiry form: client validation, server validation, honeypot, success state, no-JavaScript POST fallback, admin status changes.
- Unauthenticated upload → 401; media path traversal → 404.
