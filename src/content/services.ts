import { stock, type SiteImage } from "./media";
import { categories, type Category } from "./events";
import type { ENQUIRY_CATEGORIES } from "@/lib/constants";

/**
 * THE NINE SERVICES — the "What we do" experience (/what-we-do).
 *
 * Sources:
 *  [instagram] the company's bio: "Weddings · Corporate · Parties · Concerts —
 *              A to Z event services", plus its reels (concerts with Sameera
 *              Bharadwaj and Geetha Madhuri, weddings in Nandigama, Hyderabad
 *              and Jaggayyapeta)
 *  [site]      categories already published on this site (src/content/events.ts)
 *  [brief]     proposed in the client's restructuring brief — PLEASE CONFIRM
 *              before relying on them (College fests; Artist management as a
 *              stand-alone service)
 *
 * Photographs marked "Unsplash (temporary)" are mood imagery, never presented
 * as Passion Events' own work. Reel covers are the company's own.
 */
export type Service = {
  key: string;
  /** Used by /services/[slug]. */
  slug: string;
  index: string;
  title: string;
  /** Two-line display title for big typography. */
  lines: [string, string];
  script: string;
  /** Where every photograph of this service leads. */
  href: string;
  /** True when href is the dedicated category page rather than /services/[slug]. */
  hasCategoryPage: boolean;
  short: string;
  description: string;
  /** What Passion Events handles — shown as the service list. */
  handles: string[];
  image: SiteImage;
  gallery: SiteImage[];
  /** Instagram reel ids from content/reels.ts that show this work. */
  reels: string[];
  enquiryCategory: (typeof ENQUIRY_CATEGORIES)[number];
  live?: boolean;
  source: string;
};

const cat = (key: Category["key"]) => categories.find((c) => c.key === key)!;

export const services: Service[] = [
  {
    key: "weddings",
    slug: "weddings-and-celebrations",
    index: "01",
    title: "Weddings & Celebrations",
    lines: ["Weddings &", "celebrations"],
    script: "forever",
    href: "/weddings",
    hasCategoryPage: true,
    short: "Engagements, haldis, sangeets, receptions — every ritual, styled and run.",
    description: cat("weddings").description,
    handles: ["Wedding planning", "Engagements", "Receptions", "Traditional celebrations", "Wedding decoration", "Floral styling", "Complete wedding execution"],
    image: stock.weddingRitual,
    gallery: [stock.weddingArch, stock.ceremonyStage, stock.weddingHands, stock.florals],
    reels: ["DIT7CNHzKqG", "DNyDrfV5tsF", "DLImPaTz1bw", "DIlOuTfIzG6", "DIgArydzZwW"],
    enquiryCategory: "Wedding",
    source: "[instagram] wedding reels · [site]",
  },
  {
    key: "corporate",
    slug: "corporate-events",
    index: "02",
    title: "Corporate Events",
    lines: ["Corporate", "events"],
    script: "brilliant",
    href: "/corporate-events",
    hasCategoryPage: true,
    short: "Conferences, launches and award nights — on brand and on time.",
    description: cat("corporate").description,
    handles: ["Corporate conferences", "Annual celebrations", "Business launches", "Award ceremonies", "Corporate entertainment", "Professional event production"],
    image: stock.corporateGala,
    gallery: [stock.corporateKeynote, stock.corporateScreen, stock.longTable],
    reels: [],
    enquiryCategory: "Corporate Event",
    source: "[instagram] bio · [site]",
  },
  {
    key: "concerts",
    slug: "concerts-and-live-entertainment",
    index: "03",
    title: "Concerts & Live Entertainment",
    lines: ["Concerts &", "live nights"],
    script: "electric",
    href: "/services/concerts-and-live-entertainment",
    hasCategoryPage: false,
    short: "Live concerts and artist nights, produced end to end under Passion Live.",
    description:
      "Under our Passion Live banner we produce concerts and live nights — from Sameera Bharadwaj live in Bengaluru to Geetha Madhuri in concert. We bring the artist, the venue, the stage, the sound and the crowd together, and run the night from soundcheck to encore.",
    handles: ["Live concerts", "Music festivals", "Artist performances", "DJ events", "Live bands", "Stage production"],
    image: stock.liveCrowd,
    gallery: [stock.liveBand, stock.liveSinger, stock.liveHaze, stock.liveHands],
    reels: ["DeTkSCHtGHK", "DYs9l4Axp0j", "DXletLRk1SB"],
    enquiryCategory: "Concert",
    live: true,
    source: "[instagram] concert reels and posters",
  },
  {
    key: "college",
    slug: "college-fests-and-cultural-events",
    index: "04",
    title: "College Fests & Cultural Events",
    lines: ["College fests", "& culture"],
    script: "loud",
    href: "/services/college-fests-and-cultural-events",
    hasCategoryPage: false,
    short: "Campus festivals and cultural nights with real production behind them.",
    description:
      "Fests and cultural nights need the energy of a concert and the planning of a conference. We help student committees and institutions with stages, sound and lighting, artist and celebrity appearances, and the crowd flow that keeps a campus night safe and unforgettable.",
    handles: ["College festivals", "University events", "Cultural performances", "Student entertainment", "Celebrity appearances", "Large-scale campus productions"],
    image: stock.liveField,
    gallery: [stock.liveFrontRow, stock.liveHands, stock.liveLaser, stock.liveSilhouette],
    reels: [],
    enquiryCategory: "Other",
    source: "[brief] — please confirm",
  },
  {
    key: "private",
    slug: "private-events",
    index: "05",
    title: "Private Events",
    lines: ["Private", "events"],
    script: "joyful",
    href: "/private-events",
    hasCategoryPage: true,
    short: "Birthdays, anniversaries and parties made personal.",
    description: cat("private").description,
    handles: ["Birthday celebrations", "Private parties", "Anniversaries", "Special occasions", "Personalised celebrations"],
    image: stock.privateBalloons,
    gallery: [stock.privateSparklers, stock.privateTable, stock.vaseBloom],
    reels: [],
    enquiryCategory: "Private Celebration",
    source: "[instagram] bio (parties) · [site]",
  },
  {
    key: "destination",
    slug: "destination-events",
    index: "06",
    title: "Destination Events",
    lines: ["Destination", "events"],
    script: "wanderlust",
    href: "/destination-events",
    hasCategoryPage: true,
    short: "Travel, stays and venues handled — your guests simply arrive.",
    description: cat("destination").description,
    handles: ["Destination weddings", "Travel coordination", "Venue arrangements", "Guest accommodation", "Complete destination event management"],
    image: stock.destinationPalace,
    gallery: [stock.destinationReception, stock.destinationGazebo, stock.colourTents],
    reels: [],
    enquiryCategory: "Destination Event",
    source: "[site]",
  },
  {
    key: "artists",
    slug: "artist-and-entertainment-management",
    index: "07",
    title: "Artist & Entertainment Management",
    lines: ["Artists &", "entertainment"],
    script: "spotlight",
    href: "/services/artist-and-entertainment-management",
    hasCategoryPage: false,
    short: "Singers, bands, DJs and performers — booked, briefed and looked after.",
    description:
      "We book and manage the talent that makes a night: playback singers, live bands, DJs, anchors and performers. Riders, travel, rehearsals, run-of-show and on-stage cues — handled by one team, for weddings, corporate nights and concerts alike.",
    handles: ["Artist coordination", "Singer bookings", "DJ bookings", "Celebrity appearances", "Performer management", "Entertainment programming"],
    image: stock.liveSinger,
    gallery: [stock.liveGuitarist, stock.liveDrummer, stock.liveGuitarSpot],
    reels: ["DeTkSCHtGHK", "DXletLRk1SB"],
    enquiryCategory: "Concert",
    source: "[instagram] artist highlights · [brief] stand-alone service — please confirm",
  },
  {
    key: "production",
    slug: "event-design-and-production",
    index: "08",
    title: "Event Design & Production",
    lines: ["Design &", "production"],
    script: "seamless",
    href: "/event-production",
    hasCategoryPage: true,
    short: "Stages, light, sound, screens and florals — designed and built.",
    description: cat("production").description,
    handles: ["Stage design", "Lighting", "Sound", "LED screens", "Floral installations", "Decoration", "Technical production"],
    image: stock.productionStage,
    gallery: [stock.stageDesign, stock.productionSpots, stock.floralStage, stock.liveHaze],
    reels: ["DLImPaTz1bw", "DIgArydzZwW"],
    enquiryCategory: "Other",
    source: "[instagram] décor reels · [site]",
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
