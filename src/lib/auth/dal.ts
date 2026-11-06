import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SESSION_COOKIE, decryptSession } from "./session";

export type AdminIdentity = { id: string; email: string; name: string };

/** Returns the signed-in admin or null. Verifies the token AND that the user still exists. */
export const getAdmin = cache(async (): Promise<AdminIdentity | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);
  if (!session) return null;
  const user = await db.adminUser.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, name: true },
  });
  return user;
});

/** Server-side authorisation gate for every admin page and action. */
export async function requireAdmin(): Promise<AdminIdentity> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
