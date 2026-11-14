import type { PublicEvent } from "@/lib/events";

/**
 * Past Passion Live shows with the photographer's pictures, kept in code
 * (the admin dashboard holds the other shows). Dates and places as given by
 * the client (14 Nov 2026); photographs by 24 Frames Photography, chosen from
 * the client's own galleries. Only facts — no invented attendance or quotes.
 */
export type ShowPhoto = {
  /** base name in /public/media/sized (files <name>-{24,480,...,1600}.webp) */
  name: string;
  alt: string;
  /** width / height of the original */
  ratio: number;
  /** object-position when a crop is needed */
  focus?: string;
};

export type PastShow = {
  slug: string;
  title: string;
  artist: string;
  /** YYYY-MM-DD (India) */
  date: string;
  venue: string;
  area: string;
  city: string;
  summary: string;
  description: string;
  /** first photo is the poster/cover */
  photos: ShowPhoto[];
  /** gallery rows (indexes into photos); every row is drawn at the same height */
  rows: number[][];
  credit: string;
  ticketsUrl?: string;
  reel?: string;
};

export const pastShows: PastShow[] = [
  {
    slug: "mohana-bhogaraju-live-hyderabad",
    title: "Mohana Bhogaraju — Live at Illuzion",
    artist: "Mohana Bhogaraju",
    date: "2026-07-05",
    venue: "Illuzion 2.0",
    area: "Jubilee Hills",
    city: "Hyderabad",
    summary: "Mohana Bhogaraju live with her band at Illuzion 2.0, Hyderabad — presented by Passion Events.",
    description:
      "Passion Live brought Mohana Bhogaraju and her live band to Illuzion 2.0 in Jubilee Hills, Hyderabad, on 5 July 2026: her name on the LED wall, cold sparks on the big moments and a full room singing along.\n\nProduced by Passion Events — artist coordination, stage, sound and lighting, and the night on the ground.",
    photos: [
      { name: "mohana-hyd-stage", alt: "Mohana Bhogaraju and her band on stage at Illuzion 2.0, Hyderabad, with Passion Events on the LED wall and cold sparks", ratio: 8256 / 5504 },
      { name: "mohana-hyd-peacock", alt: "Mohana Bhogaraju singing in front of a peacock-feather LED wall with her name, Illuzion 2.0", ratio: 5148 / 7722 },
      { name: "mohana-hyd-sparks", alt: "Sparklers in front of the Mohana Bhogaraju name on the stage screen at Illuzion 2.0", ratio: 8256 / 5504 },
      { name: "mohana-hyd-crowd", alt: "The crowd at Illuzion 2.0 under purple lights during the Mohana Bhogaraju show", ratio: 5504 / 8256 },
      { name: "mohana-hyd-beam", alt: "Mohana Bhogaraju caught in a violet stage beam", ratio: 5504 / 8256 },
    ],
    rows: [
      [0, 1],
      [3, 2, 4],
    ],
    credit: "24 Frames Photography",
    ticketsUrl: "https://www.meraevents.com/events/mohana-bhogaraju-live-at-illuzion",
  },
  {
    slug: "sameera-bharadwaj-live-hyderabad",
    title: "Sameera Bharadwaj — Live in Hyderabad",
    artist: "Sameera Bharadwaj",
    date: "2026-05-23",
    venue: "Illuzion 2.0",
    area: "Jubilee Hills",
    city: "Hyderabad",
    summary: "Sameera Bharadwaj live at Illuzion 2.0, Hyderabad — a Passion Events night.",
    description:
      "Passion Live presented Sameera Bharadwaj at Illuzion 2.0 in Jubilee Hills, Hyderabad, on 23 May 2026 — Passion Events on the LED wall, beams sweeping the room and Sameera's name lighting up the stage.\n\nProduced by Passion Events — artist coordination, stage, sound and lighting, and the night on the ground.",
    photos: [
      { name: "sameera-hyd-stage", alt: "Sameera Bharadwaj on stage at Illuzion 2.0, Hyderabad, under crossed blue beams with Passion Events on the LED wall", ratio: 4800 / 6400 },
      { name: "sameera-hyd-live", alt: "Sameera Bharadwaj singing with her name glowing on the screen behind her", ratio: 4200 / 5600 },
      { name: "sameera-hyd-wide", alt: "Wide view of the stage at Illuzion 2.0 — Sameera Bharadwaj Live", ratio: 4800 / 6400 },
      { name: "sameera-hyd-spotlight", alt: "Sameera Bharadwaj performing under a single spotlight", ratio: 4200 / 5600 },
      { name: "sameera-hyd-portrait", alt: "Sameera Bharadwaj in front of the Illuzion wall before the show", ratio: 4800 / 6400 },
    ],
    rows: [
      [0, 1, 2],
      [3, 4],
    ],
    credit: "24 Frames Photography",
    reel: "DYs9l4Axp0j",
  },
];

export const pastShowBySlug = (slug: string) => pastShows.find((s) => s.slug === slug);

export const showPhotoSrc = (name: string, width = 1080) => `/media/sized/${name}-${width}.webp`;

/** The show at midnight India time (date only, no door time). */
export const showDate = (s: PastShow) => new Date(`${s.date}T00:00:00+05:30`);

/** Shape a show like a published event so the shared listings can show it. */
export function pastShowAsEvent(s: PastShow): PublicEvent {
  const startsAt = showDate(s);
  const now = new Date(0);
  return {
    id: `show-${s.slug}`,
    slug: s.slug,
    experience: "LIVE",
    status: "PUBLISHED",
    eventStatus: "COMPLETED",
    category: "CONCERT",
    title: s.title,
    artists: s.artist,
    summary: s.summary,
    description: s.description,
    venue: s.venue,
    city: s.city,
    startsAt,
    endsAt: null,
    posterUrl: null,
    coverUrl: showPhotoSrc(s.photos[0].name),
    bookingUrl: null,
    featured: false,
    publishedAt: startsAt,
    createdAt: now,
    updatedAt: now,
    media: s.photos.slice(1).map((p, i) => ({
      id: `show-${s.slug}-${i}`,
      eventId: `show-${s.slug}`,
      url: showPhotoSrc(p.name),
      alt: p.alt,
      width: null,
      height: null,
      sortOrder: i,
      createdAt: now,
    })) as unknown as PublicEvent["media"],
  } as PublicEvent;
}
