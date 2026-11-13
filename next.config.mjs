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
      // in src/content/media.ts — see docs/CONTENT.md.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" },
    ],
  },
  async redirects() {
    return [
      { source: "/concerts/shows", destination: "/concerts/events", permanent: false },
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
