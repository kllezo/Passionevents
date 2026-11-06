/**
 * Build-time admin bootstrap (runs inside Vercel, where DATABASE_URL exists).
 *
 * If ADMIN_EMAIL and ADMIN_PASSWORD_HASH (a bcrypt hash, never a plain password)
 * are set and no admin with that email exists yet, it is created. Existing
 * admins are never modified, so passwords reset later with
 * `npm run admin:create` are not overwritten by future builds.
 */
import { PrismaClient } from "@prisma/client";

const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";
const name = process.env.ADMIN_NAME || "Admin";

if (!email || !passwordHash) {
  console.log("[ensure-admin] ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set — skipping.");
  process.exit(0);
}
if (!/^\$2[aby]\$\d{2}\$.{53}$/.test(passwordHash)) {
  console.error("[ensure-admin] ADMIN_PASSWORD_HASH is not a bcrypt hash — skipping.");
  process.exit(0);
}

const db = new PrismaClient();
try {
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`[ensure-admin] Admin ${email} already exists — unchanged.`);
  } else {
    await db.adminUser.create({ data: { email, name, passwordHash } });
    console.log(`[ensure-admin] Created admin ${email}.`);
  }
} finally {
  await db.$disconnect();
}
