import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "pe_admin_session";

/**
 * Optimistic gate for /admin: bounces visitors without a valid session token
 * to the login page. Real authorisation happens server-side in every admin
 * page, server action and API route (src/lib/auth/dal.ts).
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
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
  matcher: ["/admin", "/admin/:path*"],
};
