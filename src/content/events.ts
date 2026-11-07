import { stock, type SiteImage } from "./media";
import type { ENQUIRY_CATEGORIES } from "@/lib/constants";

/** The six "What we do" categories. Each one has its own landing page. */
export type Category = {
  key: "weddings" | "corporate" | "private" | "destination" | "concerts" | "production";
  index: string;
  title: string;
  script: string;
  href: string;
  short: string;
  description: string;
  services: string[];
  image: SiteImage;
  gallery: SiteImage[];
  enquiryCategory: (typeof ENQUIRY_CATEGORIES)[number];
};

export const categories: Category[] = [
  {
    key: "weddings",
    index: "01",
    title: "Weddings",
    script: "forever",
    href: "/weddings",
    short: "Ceremonies, receptions and every ritual in between.",
    description:
      "From the first haldi to the final farewell, we design and manage weddings that feel personal at every scale — whether it is a family gathering at home or a multi-day celebration for a thousand guests.",
    services: ["Venue & mandap design", "Floral styling & decor", "Catering coordination", "Photography & videography", "Sangeet & entertainment", "Guest hospitality"],
    image: stock.weddingRitual,
    gallery: [stock.weddingArch, stock.weddingOutdoor, stock.weddingHands, stock.ceremonyStage],
    enquiryCategory: "Wedding",
  },
  {
    key: "corporate",
    index: "02",
    title: "Corporate Events",
    script: "brilliant",
    href: "/corporate-events",
    short: "Launches, conferences, offsites and award nights.",
    description:
      "Polished, on-brand and precisely run. We handle the stage, the screens, the speakers and the schedule, so your team can focus on the people in the room.",
    services: ["Conferences & summits", "Product launches", "Award nights & galas", "Offsites & team experiences", "Stage, AV & lighting", "Branding & signage"],
    image: stock.corporateGala,
    gallery: [stock.corporateKeynote, stock.corporateScreen, stock.longTable],
    enquiryCategory: "Corporate Event",
  },
  {
    key: "private",
    index: "03",
    title: "Private Celebrations",
    script: "joyful",
    href: "/private-events",
    short: "Birthdays, anniversaries and milestone moments.",
    description:
      "The celebrations closest to the heart deserve the same care as the grandest ones. Intimate dinners, surprise parties and milestone birthdays — thoughtfully styled and quietly managed.",
    services: ["Birthdays & anniversaries", "Engagements & baby showers", "Theme & concept design", "Private dining", "Entertainment & artists", "Return gifts & favours"],
    image: stock.privateBalloons,
    gallery: [stock.privateSparklers, stock.privateTable, stock.vaseBloom],
    enquiryCategory: "Private Celebration",
  },
  {
    key: "destination",
    index: "04",
    title: "Destination Events",
    script: "wanderlust",
    href: "/destination-events",
    short: "Palaces, beaches and hill retreats across India.",
    description:
      "We take care of the travel, the stays and the logistics so that your guests arrive somewhere beautiful and simply enjoy it. One team, coordinating every vendor, wherever the celebration takes you.",
    services: ["Destination scouting", "Hotels & accommodation", "Guest travel & transfers", "Local vendor management", "Welcome experiences", "Multi-day itineraries"],
    image: stock.destinationPalace,
    gallery: [stock.destinationReception, stock.destinationGazebo, stock.colourTents],
    enquiryCategory: "Destination Event",
  },
  {
    key: "concerts",
    index: "05",
    title: "Concerts & Live Entertainment",
    script: "electric",
    href: "/concerts",
    short: "Artist bookings, live shows and concert production.",
    description:
      "Passion Live is our concert and live-entertainment experience — artist bookings, venue coordination, stage, sound and lighting, promotion and complete show-day execution.",
    services: ["Artist & singer bookings", "Live bands", "Concert planning", "Stage, sound & lighting", "Promotion", "Audience experience"],
    image: stock.liveCrowd,
    gallery: [stock.liveBand, stock.liveGuitarist],
    enquiryCategory: "Concert",
  },
  {
    key: "production",
    index: "06",
    title: "Event Production & Management",
    script: "seamless",
    href: "/services",
    short: "The people, plans and production behind the moment.",
    description:
      "Need a production partner rather than a planner? We supply and run stages, sound, lighting, decor fabrication and on-ground teams, or manage your event end to end.",
    services: ["Stage design & fabrication", "Sound & lighting", "On-ground event teams", "Vendor coordination", "Run-of-show management", "Complete event management"],
    image: stock.productionStage,
    gallery: [stock.productionSpots, stock.stageDesign],
    enquiryCategory: "Other",
  },
];

/** Individually bookable services (Section 5). */
export type ServiceGroup = { title: string; image: SiteImage; items: string[] };

export const serviceGroups: ServiceGroup[] = [
  { title: "Venue & Hospitality", image: stock.venueHall, items: ["Venue arrangements", "Hotels", "Accommodation", "Guest management"] },
  { title: "Food & Table", image: stock.catering, items: ["Catering", "Table styling", "Private dining"] },
  { title: "Design & Decor", image: stock.decorArch, items: ["Decoration", "Floral styling", "Stage design", "Theme concepts"] },
  { title: "Picture & Film", image: stock.weddingHands, items: ["Photography", "Videography", "Content & reels"] },
  { title: "Sound, Light & Stage", image: stock.liveHaze, items: ["Sound", "Lighting", "LED & AV", "Stage fabrication"] },
  { title: "Artists & Entertainment", image: stock.liveSinger, items: ["Artist bookings", "Singer bookings", "Live bands", "Anchors & performers"] },
  { title: "Travel & Movement", image: stock.destinationPalace, items: ["Transportation", "Car rentals", "Guest transfers"] },
  { title: "Complete Management", image: stock.celebrationStage, items: ["Complete event management", "Vendor coordination", "Run of show"] },
];

export const allServices = serviceGroups.flatMap((g) => g.items);

export const approach = [
  { step: "Discover", index: "01", text: "We understand the occasion, the audience, the requirements and what you expect the day to feel like." },
  { step: "Plan", index: "02", text: "We develop the concept, schedule, budget and coordination plan — venues, vendors and timelines agreed up front." },
  { step: "Create", index: "03", text: "Design, décor, stage and production elements come together, along with artists and the guest experience." },
  { step: "Execute", index: "04", text: "On the day our team coordinates every vendor, artist and guest and runs the event to plan." },
];

export const whyUs = [
  { title: "Attention to detail", text: "The napkin fold and the stage cue get the same care." },
  { title: "Personalised planning", text: "No templates. Every plan starts with your story." },
  { title: "Vendor coordination", text: "One point of contact for every vendor on the brief." },
  { title: "Multiple event categories", text: "Weddings, corporate, private, destination and live." },
  { title: "End-to-end execution", text: "From the first call to the last guest leaving." },
  { title: "Artist coordination", text: "Singers, bands and performers, booked and managed." },
  { title: "Experiences across India", text: "Based in Hyderabad, working wherever you celebrate." },
];

export const faqs = [
  {
    q: "Where is Passion Events based?",
    a: "We are based in Hyderabad and plan events across India, including destination celebrations.",
  },
  {
    q: "Can I book a single service instead of full planning?",
    a: "Yes. You can book individual services — venue, catering, decor, photography, sound and lighting, artists, transport and more — or hand us the complete event.",
  },
  {
    q: "What kinds of events do you manage?",
    a: "Weddings, corporate events, private celebrations, destination events, concerts and live entertainment, and event production for other organisers.",
  },
  {
    q: "Do you handle artist and singer bookings?",
    a: "Yes. Through Passion Live we coordinate artist bookings, live bands, concerts and complete show production.",
  },
  {
    q: "How do I start planning?",
    a: "Send an enquiry with your date, location, guest count and the services you need. We will get back to you to understand the event in detail.",
  },
];
