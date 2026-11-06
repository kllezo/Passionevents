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
    role: "Co-founder · Passion Events & Passion Live",
    image: founderImages.saiTanush,
    bio: [
      "Sai Tanush co-founded Passion Events with Ramya around one simple promise — big or small, every event deserves to feel special.",
      "He is the first conversation for most of our clients: listening to what a celebration needs to feel like, then bringing venues, vendors, artists and production together to make it happen.",
      "Alongside weddings and private celebrations, Tanush leads the company's work in concerts and live entertainment under Passion Live.",
    ],
    focus: ["Client relationships", "Event planning & execution", "Concerts & artist coordination"],
  },
  {
    id: "ramya",
    name: "Ramya",
    displayName: "Ramya",
    role: "Co-founder · Passion Events",
    image: null, // Add a portrait in /public/media/founders and reference it here.
    bio: [
      "Ramya co-founded Passion Events with Sai Tanush. Together they sign every celebration — “By Ramya & Tanush”.",
    ],
    focus: [],
  },
];
