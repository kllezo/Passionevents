/**
 * Build-time admin bootstrap (runs where DATABASE_URL exists: Hostinger and
 * Vercel builds).
 *
 * If ADMIN_EMAIL and ADMIN_PASSWORD_HASH (a bcrypt hash, never a plain
 * password) are set and no admin with that email exists yet, it is created.
 * An existing admin is left unchanged, unless ADMIN_PASSWORD_RESET=true, in
 * which case its password is set to ADMIN_PASSWORD_HASH (use this to change a
 * password, then remove the variable).
 *
 * Never fails the build: any problem is logged and the build carries on.
 */
import { PrismaClient } from "@prisma/client";

const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";
const name = process.env.ADMIN_NAME || "Admin";
const reset = /^(1|true|yes)$/i.test(process.env.ADMIN_PASSWORD_RESET || "");

if (!email || !passwordHash) {
  console.log("[ensure-admin] ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set — skipping.");
  process.exit(0);
}
if (!/^\$2[aby]\$\d{2}\$.{53}$/.test(passwordHash)) {
  console.error("[ensure-admin] ADMIN_PASSWORD_HASH is not a bcrypt hash — skipping.");
  process.exit(0);
}
if (!process.env.DATABASE_URL) {
  console.log("[ensure-admin] DATABASE_URL not available at build time — skipping.");
  process.exit(0);
}

const db = new PrismaClient();
try {
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (!existing) {
    await db.adminUser.create({ data: { email, name, passwordHash } });
    console.log(`[ensure-admin] Created admin ${email}.`);
  } else if (reset && existing.passwordHash !== passwordHash) {
    await db.adminUser.update({ where: { email }, data: { passwordHash } });
    console.log(`[ensure-admin] Password updated for ${email}.`);
  } else {
    console.log(`[ensure-admin] Admin ${email} already exists — unchanged.`);
  }
} catch (err) {
  console.error("[ensure-admin] Could not update the admin account — build continues.", err instanceof Error ? err.message : err);
} finally {
  await db.$disconnect().catch(() => {});
}
