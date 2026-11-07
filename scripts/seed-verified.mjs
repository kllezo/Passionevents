/**
 * One-off seed of shows verified on the public @passionevents.p profile.
 * Runs only when SEED_VERIFIED_EVENTS=1. Create-only: an existing slug is never
 * touched, so admin edits are preserved. Remove the env var after one deploy so
 * a show deleted in the admin is not re-created.
 */
import { PrismaClient } from "@prisma/client";

if (process.env.SEED_VERIFIED_EVENTS !== "1") {
  console.log("[seed-verified] SEED_VERIFIED_EVENTS not set — skipping.");
  process.exit(0);
}

const events = [
  {
    slug: "geetha-madhuri-live-in-concert-bengaluru",
    experience: "LIVE",
    status: "PUBLISHED",
    eventStatus: "ON_SALE",
    category: "CONCERT",
    title: "Geetha Madhuri — Live in Concert",
    artists: "Geetha Madhuri",
    summary: "Passion Events presents Geetha Madhuri live in concert — her first show in Bengaluru.",
    description:
      "Passion Events brings Geetha Madhuri to Bengaluru for her first live concert in the city, at DND – The Venue.\n\nTickets are available on BookMyShow and District.",
    venue: "DND – The Venue",
    city: "Bengaluru",
    // Date as announced; time not yet published (midnight IST = date only).
    startsAt: new Date("2026-12-12T00:00:00+05:30"),
    bookingUrl: "https://in.bookmyshow.com/events/geetha-madhuri-telugu-live-concert/ET00525092",
  },
  {
    slug: "paatashala-band-live-hyderabad",
    experience: "LIVE",
    status: "PUBLISHED",
    eventStatus: "COMPLETED",
    category: "CONCERT",
    title: "Paatashala Band Live",
    artists: "Paatashala Band",
    summary: "Paatashala Band live at Illuzion, Jubilee Hills, Hyderabad.",
    description: "A live night with Paatashala Band at Illuzion, Road No. 10, Jubilee Hills, Hyderabad.",
    venue: "Illuzion, Jubilee Hills",
    city: "Hyderabad",
    startsAt: null,
    bookingUrl: null,
  },
];

const db = new PrismaClient();
try {
  for (const e of events) {
    const exists = await db.event.findUnique({ where: { slug: e.slug }, select: { id: true } });
    if (exists) {
      console.log(`[seed-verified] ${e.slug} exists — unchanged.`);
      continue;
    }
    await db.event.create({ data: { ...e, publishedAt: new Date() } });
    console.log(`[seed-verified] created ${e.slug}`);
  }
} finally {
  await db.$disconnect();
}
