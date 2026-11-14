/**
 * ALL site imagery in one place.
 *
 * Brand + founder images are client-supplied originals.
 * Everything under `stock` is TEMPORARY imagery used under the Unsplash License
 * (https://unsplash.com/license). It is used as mood / category imagery only and
 * is never presented as Passion Events' own work — the portfolio and Passion Live
 * galleries are powered exclusively by the admin dashboard.
 *
 * To replace: drop client photography in /public/media/... and change `src` below.
 */

export type SiteImage = {
  src: string;
  alt: string;
  credit?: string;
  /** object-position of the subject on tablet/desktop, e.g. "50% 70%". */
  focus?: string;
  /** object-position on phones when the crop is much narrower. */
  focusMobile?: string;
  /** True for placeholder stock that must be replaced with client photography. */
  temporary?: boolean;
};

/** Same stock photo, self-hosted in pre-sized files (scripts/build-sized-images.mjs). */
const sized = (name: string, alt: string, focus?: string, focusMobile?: string): SiteImage => ({
  src: `/media/sized/${name}.webp`,
  alt,
  credit: "Unsplash (temporary)",
  temporary: true,
  focus,
  focusMobile,
});

const u = (id: string, alt: string, focus?: string, focusMobile?: string): SiteImage => ({
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`,
  alt,
  credit: "Unsplash (temporary)",
  temporary: true,
  focus,
  focusMobile,
});

export const brand = {
  logo: { src: "/brand/logo-transparent-1400.webp", width: 1400, height: 1405, alt: "Passion Events — Big or small, we make it special. By Ramya & Tanush" },
  logoSmall: { src: "/brand/logo-transparent-320.webp", width: 320, height: 321, alt: "Passion Events" },
  logoSolid: { src: "/brand/logo-1400.webp", width: 1400, height: 1405, alt: "Passion Events logo" },
  mark: { src: "/brand/icon-192.png", width: 192, height: 192, alt: "Passion Events floral mark" },
};

export const founders = {
  saiTanush: {
    src: "/media/founders/sai-tanush-1800.webp",
    width: 1199,
    height: 1800,
    alt: "P. Sai Tanush, co-founder of Passion Events, smiling and leaning on a table at a live venue",
    credit: "Photograph: Phani Gogireddy / 24 Frames",
  },
  ramya: {
    src: "/media/founders/ramya-960.webp",
    width: 960,
    height: 1280,
    alt: "Ramya, co-founder of Passion Events, smiling, seated at a keyboard",
    focus: "50% 22%",
  },
};

export const stock = {
  // Passion Events — editorial / romantic
  heroCanopy: sized("hero-canopy", "A couple in traditional wedding attire seated beneath a floral canopy", "45% 68%", "48% 72%"),
  ceremonyStage: u("photo-1744805624954-a6686543c3ff", "A ceremony stage dressed with flowers and soft drapery", "50% 78%"),
  tableFloral: u("photo-1511795409834-ef04bbd61622", "An elegant table setting with a floral centrepiece"),
  vaseBloom: u("photo-1680491026542-a99730a0e235", "A vase of fresh flowers on a dressed table"),
  longTable: u("photo-1737682599438-319b61711b5f", "A long banquet table beneath a chandelier", "50% 62%"),
  receptionHall: u("photo-1665607437981-973dcd6a22bb", "A reception hall with tables set for a wedding"),

  weddingRitual: u("photo-1587271407850-8d438ca9fdf2", "A wedding ritual under a floral canopy in a ballroom", "50% 72%", "52% 78%"),
  weddingArch: sized("wedding-arch", "A couple celebrating under a floral arch with confetti", "50% 55%"),
  weddingOutdoor: u("photo-1772127822562-a898d9f5733c", "An outdoor wedding ceremony with elegant seating", "50% 62%"),
  weddingHands: u("photo-1756190564669-215843660e93", "A couple in traditional Indian wedding attire holding hands", "50% 42%"),

  corporateGala: u("photo-1773828755374-0ee802d9f44b", "A speaker addressing a full auditorium from a lit stage", "22% 50%", "14% 50%"),
  corporateKeynote: u("photo-1769755409781-9e8924c57362", "A speaker addressing a large audience in a dimly lit hall", "50% 42%"),
  corporateScreen: u("photo-1770140304098-46700a5c45c8", "A formal dining table set for a large corporate dinner", "50% 62%"),

  privateBalloons: u("photo-1741969494307-55394e3e4071", "A festive celebration decorated with balloons", "50% 58%"),
  privateSparklers: u("photo-1530800919758-f1f7b1e67cd8", "Candles and a sparkler on celebration cupcakes"),
  privateTable: u("photo-1653821355736-0c2598d0a63e", "A party table set with candles and flowers"),

  destinationPalace: u("photo-1695956353120-54ce5e91632b", "A lakeside palace at golden hour in Udaipur", "50% 58%", "62% 58%"),
  destinationReception: u("photo-1772127822525-7eda37383b9f", "An outdoor reception with a draped canopy and tables", "50% 60%"),
  destinationGazebo: u("photo-1523438885200-e635ba2c371e", "A garden gazebo framed by trees"),

  productionStage: u("photo-1670028514318-0ac718c0590d", "A production stage with a crowd in front", "50% 40%"),
  productionSpots: u("photo-1482285167985-9cef699a2ef5", "Rows of stage spotlights"),

  venueHall: u("photo-1736155983520-a0f7d5949d39", "A banquet hall set up for an event", "50% 60%"),
  catering: u("photo-1525441273400-056e9c7517b3", "A fine dining place setting"),
  decorArch: sized("decor-arch", "An ornate archway entrance with chandeliers", "50% 55%"),
  florals: u("photo-1590683673322-0f3fabd72169", "Pink and white roses in a glass vase"),
  stageDesign: u("photo-1708606811579-23b18fc48007", "A decorated stage with a chandelier", "50% 60%"),
  colourTents: u("photo-1744891470493-44321ef136a2", "A vibrant outdoor event decorated with colourful tents"),
  celebrationStage: u("photo-1745573673416-66e829644ae9", "A decorated stage ready for a celebration"),
  floralStage: u("photo-1591203281954-23fa2ff8ef18", "A floral stage with seating, dressed for a celebration"),

  // Passion Live — electric
  liveHero: u("photo-1470229722913-7c0e2dbbafd3", "Stage lights blazing in front of a concert audience", "50% 38%"),
  liveCrowd: sized("live-crowd", "A crowd facing a brightly lit stage", "50% 40%"),
  liveHands: u("photo-1506157786151-b8491531f063", "Concert-goers raising their hands", "50% 35%"),
  liveBand: u("photo-1524368535928-5b5e00ddc76b", "A band performing on stage in front of people", "50% 40%"),
  liveFrontRow: u("photo-1514525253161-7a46d19cd819", "A crowd gathered in front of the stage", "50% 40%"),
  liveConcert: u("photo-1459749411175-04bf5292ceea", "A concert stage lit in colour"),
  liveGuitarist: u("photo-1501962679900-bea61483313b", "A lead guitarist performing on stage", "55% 30%"),
  liveGuitarSpot: u("photo-1499424017184-418f6808abf9", "A guitarist under a single spotlight", "50% 30%"),
  liveDrummer: u("photo-1588032786045-59cefda005c0", "A drummer playing a kit on stage", "50% 45%"),
  liveDrumLight: u("photo-1690460814053-5906ac3e90cd", "A drum kit silhouetted by stage light", "50% 55%"),
  liveLaser: u("photo-1573339887617-d674bc961c31", "Laser light cutting through darkness"),
  liveField: u("photo-1533174072545-7a4b6ad7a6c3", "People gathered on an open-air concert field", "50% 45%"),
  liveSilhouette: u("photo-1610901056511-31de499995f0", "Silhouettes of people watching a concert"),
  liveSinger: u("photo-1583795311768-2ef98ac78740", "A singer performing on stage", "50% 30%"),
  liveHaze: u("photo-1600779547877-be592ef5aad3", "Instruments on a stage with blue spotlights and haze", "50% 60%"),
} as const;
