import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import { services } from "@/content/services";
import { areas } from "@/content/areas";
import { posts } from "@/content/blog";
import { pastShows } from "@/content/shows";

const SERVICE_SLUGS = new Set(services.map((s) => s.slug));
const AREA_SLUGS = new Set<string>(areas.map((a) => a.slug));
const POST_SLUGS = new Set(posts.map((p) => p.slug));
const SHOW_SLUGS = new Set(pastShows.map((s) => s.slug));

const COOKIE = "pe_admin_session";

const globalForPrisma = globalThis as unknown as { proxyPrisma?: PrismaClient };
const db = globalForPrisma.proxyPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.proxyPrisma = db;

/**
 * 1. Optimistic gate for /admin (real authorisation happens server-side in
 *    every admin page, action and API route — src/lib/auth/dal.ts).
 * 2. Real HTTP 404s for unknown services, and for unknown or unpublished
 *    portfolio stories and shows.
 *    With Partial Prerendering the static shell is sent with 200 before the
 *    page can call notFound(), so the existence check has to happen here.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const area = pathname.match(/^\/event-management\/([^/]+)\/?$/);
  if (area) {
    if (!AREA_SLUGS.has(decodeURIComponent(area[1]))) return NextResponse.rewrite(new URL("/_missing", req.url), { status: 404 });
    return NextResponse.next();
  }

  const post = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (post) {
    if (!POST_SLUGS.has(decodeURIComponent(post[1]))) return NextResponse.rewrite(new URL("/_missing", req.url), { status: 404 });
    return NextResponse.next();
  }

  const service = pathname.match(/^\/services\/([^/]+)\/?$/);
  if (service) {
    if (!SERVICE_SLUGS.has(decodeURIComponent(service[1]))) return NextResponse.rewrite(new URL("/_missing", req.url), { status: 404 });
    return NextResponse.next();
  }

  const detail = pathname.match(/^\/(portfolio|concerts\/events)\/([^/]+)\/?$/);
  if (detail) {
    const experience = detail[1] === "portfolio" ? "EVENTS" : "LIVE";
    // Shows kept in code (src/content/shows.ts) exist without a database row.
    if (experience === "LIVE" && SHOW_SLUGS.has(decodeURIComponent(detail[2]))) return NextResponse.next();
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
  matcher: ["/admin", "/admin/:path*", "/portfolio/:slug", "/concerts/events/:slug", "/services/:slug", "/event-management/:slug", "/blog/:slug"],
};
