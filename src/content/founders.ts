import { founders as founderImages, type SiteImage } from "./media";

/**
 * Founder profiles — EDIT FREELY.
 * Copy here is limited to facts supplied by the client (names, roles, contact
 * person, the brand byline). Add biographies, milestones and photos only when
 * the founders provide them.
 */
export type Founder = {
  id: string;
  name: string;
  displayName: string;
  /** Other ways the name is written or searched (shown to search engines, not on the page). */
  alternateNames: string[];
  role: string;
  image: (SiteImage & { width: number; height: number }) | null;
  bio: string[];
  focus: string[];
};

export const foundersList: Founder[] = [
  {
    id: "sai-tanush",
    name: "Pabbathi Sai Tanush",
    displayName: "P. Sai Tanush",
    alternateNames: ["P. Sai Tanush", "Sai Tanush", "Pabbati Sai Thanush", "Sai Thanush"],
    role: "Founder · Passion Events & Passion Live",
    image: founderImages.saiTanush,
    bio: [
      "Sai Tanush founded Passion Events with Ramya around one simple promise — big or small, every event deserves to feel special.",
      "He is the first conversation for most of our clients: listening to what a celebration needs to feel like, then bringing venues, vendors, artists and production together to make it happen.",
      "Alongside weddings and private celebrations, Tanush leads the company's work in concerts and live entertainment under Passion Live.",
    ],
    focus: ["Client relationships", "Event planning & execution", "Concerts & artist coordination"],
  },
  {
    id: "ramya",
    name: "Ramya",
    displayName: "Ramya",
    alternateNames: [],
    role: "Co-founder · Passion Events",
    image: founderImages.ramya,
    // General lines written for the site (client asked for filler copy) — replace
    // or extend with Ramya's own biography when it arrives.
    bio: [
      "Ramya co-founded Passion Events with Sai Tanush. Together they sign every celebration — “By Ramya & Tanush”.",
      "For Ramya, an event is remembered for how it made people feel: the welcome at the door, the colours of the room, the moment a family sees everything come together.",
      "She shares the promise the company was built on — big or small, we make it special — and the belief that no detail is too small to get right.",
    ],
    focus: ["Celebrations & weddings", "Client care", "Details & finishing touches"],
  },
];
