import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";

const COOKIE = "pe_admin_session";

const globalForPrisma = globalThis as unknown as { proxyPrisma?: PrismaClient };
const db = globalForPrisma.proxyPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.proxyPrisma = db;

/**
 * 1. Optimistic gate for /admin (real authorisation happens server-side in
 *    every admin page, action and API route — src/lib/auth/dal.ts).
 * 2. Real HTTP 404s for unknown or unpublished portfolio stories and shows.
 *    With Partial Prerendering the static shell is sent with 200 before the
 *    page can call notFound(), so the existence check has to happen here.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const detail = pathname.match(/^\/(portfolio|concerts\/events)\/([^/]+)\/?$/);
  if (detail) {
    const experience = detail[1] === "portfolio" ? "EVENTS" : "LIVE";
    try {
      const found = await db.event.findFirst({
        where: { slug: decodeURIComponent(detail[2]), experience, status: "PUBLISHED" },
        select: { id: true },
      });
      if (!found) return NextResponse.rewrite(new URL("/_missing", req.url), { status: 404 });
    } catch (err) {
      // Database unavailable: let the page handle it rather than blocking a valid URL.
      console.error("[proxy] detail lookup failed", err);
    }
    return NextResponse.next();
  }

  const isLogin = pathname === "/admin/login";
  const token = req.cookies.get(COOKIE)?.value;
  let valid = false;
  if (token && process.env.SESSION_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET), { algorithms: ["HS256"] });
      valid = true;
    } catch {
      valid = false;
    }
  }
  if (!valid && !isLogin) return NextResponse.redirect(new URL("/admin/login", req.url));
  if (valid && isLogin) return NextResponse.redirect(new URL("/admin", req.url));
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/portfolio/:slug", "/concerts/events/:slug"],
};
