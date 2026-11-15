const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Prisma and sharp are native/server-only; keep them out of the bundle.
  serverExternalPackages: ["@prisma/client", "sharp", "bcryptjs", "@vercel/blob", "@vercel/oidc"],
  images: {
    qualities: [60, 75, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Temporary, Unsplash-licensed stock imagery. Replace with client photography
      // in src/content/media.ts â€” see docs/CONTENT.md.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" },
    ],
  },
  async redirects() {
    return [
      // One host only: www.passionevents.co → passionevents.co.
      { source: "/:path*", has: [{ type: "host", value: "www.passionevents.co" }], destination: "https://passionevents.co/:path*", permanent: true },
      { source: "/concerts/shows", destination: "/concerts/events", permanent: false },
      // Complete Event Management was retired as a separate service page.
      { source: "/services/complete-event-management", destination: "/what-we-do", permanent: true },
      // Concerts live on Passion Live; artist management was retired as a separate page.
      { source: "/services/concerts-and-live-entertainment", destination: "/concerts", permanent: true },
      { source: "/services/artist-and-entertainment-management", destination: "/what-we-do", permanent: true },
      { source: "/concerts/shows/:slug", destination: "/concerts/events/:slug", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The Vercel copy mirrors passionevents.co; keep it out of search results
      // so the real domain is the only one indexed.
      { source: "/:path*", has: [{ type: "host", value: "(?<sub>.+)\\.vercel\\.app" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
