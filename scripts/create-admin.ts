/**
 * Creates (or resets the password of) an admin user.
 *
 *   npm run admin:create                      # uses ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env
 *   npm run admin:create -- owner@x.com "S3cure-passphrase" "Owner Name"
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const [argEmail, argPassword, argName] = process.argv.slice(2);
  const email = (argEmail || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = argPassword || process.env.ADMIN_PASSWORD || "";
  const name = argName || process.env.ADMIN_NAME || "Admin";

  if (!email || !email.includes("@")) throw new Error("Provide an admin email (argument or ADMIN_EMAIL).");
  if (password.length < 10) throw new Error("Admin password must be at least 10 characters.");

  const db = new PrismaClient();
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });
  console.log(`Admin ready: ${user.email}`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
