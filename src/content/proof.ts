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
];

export const instagramUrl = "https://www.instagram.com/passionevents.p/";
