/**
 * REELS — the company's own Instagram reels (@passionevents.p).
 *
 * Every entry was supplied by the client as a link. Titles, places and dates
 * come from each reel's public caption. Covers in /public/media/reels are the
 * preview images Instagram publishes for each reel (they carry Instagram's
 * play mark).
 *
 * Embedding is switched off on these reels, so they open on Instagram.
 * To add a reel: append an entry and drop its cover at
 * /public/media/reels/<id>.webp (any size; portrait 9:16 looks best).
 */

export type ReelCategory = "Weddings" | "Décor" | "Concerts" | "Behind the scenes";

export type Reel = {
  id: string;
  title: string;
  place?: string;
  date?: string;
  category: ReelCategory;
  /** Landscape covers are shown letterboxed inside the vertical frame. */
  landscape?: boolean;
  /** Publish date from the Instagram post, when the caption shows one. */
  published?: string;
};

export const reels: Reel[] = [
  { id: "DeTkSCHtGHK", published: "2026-10-10", title: "Sameera Bharadwaj, live", place: "Bengaluru", date: "Oct 2026", category: "Concerts" },
  { id: "DIT7CNHzKqG", published: "2025-04-11", title: "An engagement evening", place: "Nandigama", date: "Apr 2025", category: "Weddings" },
  { id: "DXmBXWMkzwd", published: "2026-04-26", title: "From vision to vibe — the founder behind the scenes", date: "Apr 2026", category: "Behind the scenes" },
  { id: "DNyDrfV5tsF", published: "2025-08-25", title: "Sangeet vibes", place: "Hyderabad", date: "Aug 2025", category: "Weddings" },
  { id: "DXletLRk1SB", title: "Geetha Madhuri, live in concert", category: "Concerts", landscape: true },
  { id: "DLImPaTz1bw", published: "2025-06-20", title: "A sunflower haldi", place: "Jaggayyapeta", date: "Jun 2025", category: "Décor" },
  { id: "DYs9l4Axp0j", title: "Sameera Bharadwaj at Illuzion Club", place: "Hyderabad", category: "Concerts" },
  { id: "DIgArydzZwW", published: "2025-04-16", title: "Pelli kuthuru décor", place: "Nandigama", date: "Apr 2025", category: "Décor" },
  { id: "DIlOuTfIzG6", published: "2025-04-18", title: "A wedding day", place: "Nandigama", date: "Apr 2025", category: "Weddings" },
  { id: "DITK04ATEeA", published: "2025-04-11", title: "A little film for the bride & groom", date: "Apr 2025", category: "Weddings" },
];

export const reelUrl = (id: string) => `https://www.instagram.com/reel/${id}/`;
export const reelCover = (id: string) => `/media/reels/${id}.webp`;

export const reelsBy = (...cats: ReelCategory[]) => reels.filter((r) => cats.includes(r.category));
export const reelById = (id: string) => reels.find((r) => r.id === id);
