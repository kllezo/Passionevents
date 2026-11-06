# Deployment checklist

The app is a standard Next.js 16 server (`npm run build && npm start`, Node 20.9+). It needs three things that a laptop provides for free but production must provide explicitly:

## 1. A persistent database
SQLite (`prisma/dev.db`) is fine on a single VPS with a persistent disk. For serverless/multi-instance hosting use Postgres:

1. In `prisma/schema.prisma` set `provider = "postgresql"`.
2. Set `DATABASE_URL` to the hosted URL (Neon, Supabase, RDS…).
3. `npx prisma migrate deploy` (create a fresh migration first with `npx prisma migrate dev` against Postgres).
4. `npm run admin:create` once against the production database.

## 2. Persistent upload storage
Uploads are written to `UPLOAD_DIR` and served by `/api/media/...`.
- **VPS / Docker:** mount a volume and point `UPLOAD_DIR` at it.
- **Serverless (e.g. Vercel):** the filesystem is ephemeral — swap `storeImage` / `readUpload` in `src/lib/uploads.ts` for an object store (S3, Cloudflare R2, Vercel Blob). Both functions are isolated so only that file changes.

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
