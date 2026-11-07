import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getSitemapEvents } from "@/lib/events";

const staticRoutes = [
  "/",
  "/about",
  "/services",
  "/weddings",
  "/corporate-events",
  "/private-events",
  "/destination-events",
  "/event-production",
  "/portfolio",
  "/founders",
  "/contact",
  "/concerts",
  "/concerts/events",
  "/concerts/about",
  "/concerts/partners",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getSitemapEvents().catch(() => []);
  return [
    ...staticRoutes.map((p) => ({
      url: `${site.url}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : p === "/concerts" ? 0.9 : 0.7,
    })),
    ...events.map((e) => ({
      url: `${site.url}${e.experience === "LIVE" ? "/concerts/events/" : "/portfolio/"}${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
