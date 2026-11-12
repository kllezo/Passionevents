import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getSitemapEvents } from "@/lib/events";
import { services } from "@/content/services";

// Service detail pages that are their own page (the other five redirect to
// the category pages already listed below).
const servicePages = services.filter((s) => !s.hasCategoryPage).map((s) => s.href);

const staticRoutes = [
  "/",
  "/what-we-do",
  "/about",
  "/services",
  "/weddings",
  "/corporate-events",
  "/private-events",
  "/destination-events",
  "/event-production",
  "/portfolio",
  "/founders",
  "/reels",
  "/contact",
  "/concerts",
  "/concerts/events",
  "/concerts/about",
  "/concerts/partners",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getSitemapEvents().catch(() => []);
  return [
    ...[...staticRoutes, ...servicePages].map((p) => ({
      url: `${site.url}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : p === "/concerts" || p === "/what-we-do" ? 0.9 : 0.7,
    })),
    ...events.map((e) => ({
      url: `${site.url}${e.experience === "LIVE" ? "/concerts/events/" : "/portfolio/"}${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
