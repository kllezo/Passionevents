import "server-only";
import { connection } from "next/server";
import { db } from "@/lib/db";
import type { Event, Media } from "@prisma/client";

export type PublicEvent = Event & { media: Media[] };

/**
 * Public read layer. Every query is hard-filtered to status = PUBLISHED so draft
 * content can never leak. `connection()` marks these reads as request-time so
 * public pages reflect publish/unpublish immediately under Cache Components.
 */
const published = { status: "PUBLISHED" } as const;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getUpcomingLiveEvents(limit = 24): Promise<PublicEvent[]> {
  await connection();
  return db.event.findMany({
    where: {
      ...published,
      experience: "LIVE",
      OR: [{ startsAt: { gte: startOfToday() } }, { startsAt: null }],
      NOT: { eventStatus: "COMPLETED" },
    },
    orderBy: [{ startsAt: "asc" }],
    include: { media: { orderBy: { sortOrder: "asc" } } },
    take: limit,
  });
}

export async function getPastLiveEvents(limit = 24): Promise<PublicEvent[]> {
  await connection();
  return db.event.findMany({
    where: {
      ...published,
      experience: "LIVE",
      OR: [{ startsAt: { lt: startOfToday() } }, { eventStatus: "COMPLETED" }],
    },
    orderBy: [{ startsAt: "desc" }],
    include: { media: { orderBy: { sortOrder: "asc" } } },
    take: limit,
  });
}

export async function getPortfolioEvents(category?: string): Promise<PublicEvent[]> {
  await connection();
  return db.event.findMany({
    where: { ...published, experience: "EVENTS", ...(category ? { category } : {}) },
    orderBy: [{ featured: "desc" }, { startsAt: "desc" }, { publishedAt: "desc" }],
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getPublishedEventBySlug(slug: string, experience: "EVENTS" | "LIVE") {
  await connection();
  return db.event.findFirst({
    where: { ...published, slug, experience },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });
}

export type VerifiedArtist = {
  name: string;
  image: string | null;
  events: { slug: string; title: string }[];
};

/** Artists are only ever derived from names the admin entered on published LIVE events. */
export async function getVerifiedArtists(): Promise<VerifiedArtist[]> {
  await connection();
  const rows = await db.event.findMany({
    where: { ...published, experience: "LIVE", NOT: { artists: "" } },
    select: { artists: true, slug: true, title: true, posterUrl: true, coverUrl: true },
    orderBy: { startsAt: "desc" },
  });
  const map = new Map<string, VerifiedArtist>();
  for (const r of rows) {
    for (const raw of r.artists.split(",")) {
      const name = raw.trim();
      if (!name) continue;
      const key = name.toLowerCase();
      const entry = map.get(key) ?? { name, events: [], image: r.posterUrl ?? r.coverUrl };
      entry.events.push({ slug: r.slug, title: r.title });
      map.set(key, entry);
    }
  }
  return [...map.values()];
}

export async function getSitemapEvents() {
  await connection();
  return db.event.findMany({
    where: published,
    select: { slug: true, experience: true, updatedAt: true },
  });
}

export { artistList } from "./event-format";
