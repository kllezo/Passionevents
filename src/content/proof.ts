/**
 * VERIFIED PROOF POINTS — every line records where it came from.
 * Edit freely; remove anything the founders don't want public.
 *
 * Sources:
 *  [brief]     supplied directly by the client in the website brief
 *  [instagram] the public @passionevents.p profile (bio, posts, highlights), checked 2026-11-06
 */

export const proofStats = [
  { value: 50, suffix: "+", label: "Events executed", source: "[brief]" },
  { value: 10, suffix: "K+", label: "Followers on Instagram", source: "[instagram] 10.3K followers" },
  { value: 2, suffix: "", label: "Cities with Passion Live shows — Hyderabad & Bengaluru", source: "[instagram] Paatashala Band Live (Hyderabad), Geetha Madhuri (Bengaluru)" },
];

/** What the company says it does, in its own words (Instagram bio). */
export const ownWords = {
  line: "Your event is our passion.",
  scope: "Weddings · Corporate · Parties · Concerts — A to Z event services across Andhra Pradesh & Telangana.",
  source: "[instagram] bio",
};

/**
 * Artists featured in the company's Instagram highlights / shows.
 * Please confirm each one before launch. Names are shown exactly as published.
 */
export const featuredArtists = [
  { name: "Geetha Madhuri", source: "[instagram] highlight + 'Passion Events presents' concert poster" },
  { name: "Mohana Bhogaraju", source: "[instagram] highlight" },
  { name: "Capricio Band", source: "[instagram] highlight" },
  { name: "Band Amogh", source: "[instagram] highlight" },
  { name: "Paatashala Band", source: "[instagram] 'Paatashala Band Live' post with @bandpaatashala" },
  { name: "Sameera Bharadwaj", source: "[instagram] reels: live in Bengaluru (Oct 2026) and at Illuzion Club, Hyderabad" },
];

export const instagramUrl = "https://www.instagram.com/passionevents.p/";

/** The company's ticketing page on MeraEvents (confirmed as theirs by the client, 14 Nov 2026). */
export const meraEventsUrl = "https://www.meraevents.com/o/Passion-Events";

/**
 * Ticketed shows as listed on MeraEvents (checked 14 Nov 2026). Each links to
 * its public listing, so the date and venue can be verified independently.
 */
export const ticketedShows = [
  { title: "Sameera Bharadwaj — Live in Bengaluru", date: "2026-10-09", label: "9 Oct 2026", venue: "DND – The Venue, Bengaluru", url: "https://www.meraevents.com/events/sameera-bharadwaj-live-in-bengaluru" },
  { title: "Kalyan Babu DJ Night by Passion Events", date: "2026-09-01", label: "1 Sept 2026", venue: "HYP3 Nightclub", url: "https://www.meraevents.com/events/kalyan-babu-dj-night-by-passion-events" },
  { title: "Mohana Bhogaraju — Live at Illuzion", date: "2026-07-05", label: "5 Jul 2026", venue: "Illuzion Club & Kitchen, Hyderabad", url: "https://www.meraevents.com/events/mohana-bhogaraju-live-at-illuzion" },
];
