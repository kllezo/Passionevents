import type { SiteImage } from "./media";

/**
 * Décor from Passion Events' own weddings, shown on /weddings.
 * Client-supplied photos (Google Photos album shared by Sai Tanush, 25 Nov 2026;
 * taken 11–20 April 2025). Files: public/media/sized/work-*.webp, made with
 * sharp at the same widths as the other sized images (480–1600 + a 24px preview).
 * Captions describe only what the photo shows; add the place or couple only
 * when the client confirms them.
 */
export type WorkPhoto = { image: SiteImage; title: string; caption: string; credit?: string };

const work = (name: string, alt: string): SiteImage => ({ src: `/media/sized/${name}.webp`, alt });

export const weddingWorkDate = "April 2025";

export const weddingWork: WorkPhoto[] = [
  {
    image: work("work-floral-stage", "Wedding reception stage by Passion Events with lavender drapes, a green floral canopy, chandeliers and a round floral backdrop"),
    title: "Floral reception stage",
    caption: "Lavender drapes, a hanging green canopy, chandeliers and a moon-gate backdrop framed in fresh flowers.",
  },
  {
    image: work("work-entrance-walkway", "Lit wedding entrance walkway by Passion Events with a draped fabric canopy, crystal chandeliers and a patterned runner"),
    title: "Entrance walkway",
    caption: "A lit fabric canopy, crystal chandeliers and a patterned runner leading guests in.",
  },
  {
    image: work("work-sunflower-haldi", "Haldi décor by Passion Events: a sunflower and greenery wall, marigold strings, a gold chair, brass urns and a flower rangoli"),
    title: "Sunflower haldi",
    caption: "A sunflower and greenery wall under marigold strings, with brass urns and a flower rangoli.",
  },
  {
    image: work("work-home-ceremony", "Wedding ceremony décor at home by Passion Events with gold chairs, banana leaves, jasmine strings and brass vases of flowers"),
    title: "Ceremony décor at home",
    caption: "Gold chairs, banana leaves, jasmine strings and brass vases, set up in the family's home.",
    credit: "Photo: 24 Frames Wedding Films",
  },
  {
    image: work("work-marigold-ritual", "Traditional ceremony setup by Passion Events with marigold pyramids, brass pots and a large flower rangoli"),
    title: "Marigold and brass setup",
    caption: "Marigold pyramids, brass pots and a flower rangoli for a traditional ceremony outdoors.",
  },
  {
    image: work("work-pastel-backdrop", "Pastel wedding function backdrop by Passion Events with coloured drapes, a cascade of flowers and a carved chair"),
    title: "Pastel floral backdrop",
    caption: "Pastel drapes under a cascade of flowers, for a function at home.",
  },
];
