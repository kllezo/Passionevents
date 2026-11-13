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
    href: "/event-production",
    short: "The people, plans and production behind the moment.",
    description:
      "Need a production partner rather than a planner? We supply and run stages, sound, lighting, decor fabrication and on-ground teams, or manage your event end to end.",
    services: ["Stage design & fabrication", "Sound & lighting", "On-ground event teams", "Vendor coordination", "Run-of-show management", "Complete event management"],
    image: stock.productionStage,
    gallery: [stock.productionSpots, stock.stageDesign, stock.liveHaze, stock.celebrationStage],
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
  { step: "Conceptualise", index: "01", text: "We understand the occasion, the audience and what you want the day to feel like, and shape the idea around it." },
  { step: "Plan", index: "02", text: "Schedule, budget, venues, vendors and timelines, agreed up front." },
  { step: "Design", index: "03", text: "Theme, décor, stage and the guest experience, designed as one look." },
  { step: "Produce", index: "04", text: "Stage, sound, lighting, screens and artists, built and rehearsed before the day." },
  { step: "Execute", index: "05", text: "On the day our team coordinates every vendor, artist and guest and runs the event to plan." },
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

/**
 * Plain questions people (and AI assistants) ask about Passion Events, each
 * answered only with published facts. Shown on /what-we-do and in /llms.txt.
 */
export const geoFaqs = [
  {
    q: "What does Passion Events do?",
    a: "Passion Events is an event management company from Hyderabad offering A to Z event services: weddings and celebrations, corporate events, concerts and live entertainment, college fests and cultural events, private events, destination events, artist and entertainment management, event design and production, and complete event management.",
  },
  {
    q: "Where is Passion Events based, and where does it work?",
    a: "Passion Events is based in Hyderabad, Telangana. It works across Andhra Pradesh and Telangana — with weddings in places like Nandigama and Jaggayyapeta — and plans destination events and concerts elsewhere in India, including Bengaluru.",
  },
  {
    q: "Who founded Passion Events?",
    a: "Passion Events was founded by Ramya and P. Sai Tanush (Pabbathi Sai Tanush). Every event carries their signature, “By Ramya & Tanush”.",
  },
  {
    q: "Does Passion Events organise concerts?",
    a: "Yes. Its concert and live-entertainment brand, Passion Live, has produced nights such as Sameera Bharadwaj live in Bengaluru and at Illuzion Club, Hyderabad, and Geetha Madhuri live in concert.",
  },
  {
    q: "How many events has Passion Events executed?",
    a: "More than 50 events, from intimate family celebrations to concerts.",
  },
  {
    q: "Can Passion Events manage my whole event, or just part of it?",
    a: "Either. You can book a single service — such as decor, catering coordination, stage, sound and lighting, or artists — or hand over the complete event, from concept and planning to vendors, logistics, guests and on-site execution.",
  },
  {
    q: "How do I contact Passion Events?",
    a: "Send an enquiry through the contact page with your date, city, guest count and the services you need, or message @passionevents.p on Instagram.",
  },
];


/**
 * Home-page questions — what people search before hiring an event company,
 * answered with published facts only. Rendered visibly on the home page with
 * matching FAQPage structured data.
 */
export const homeFaqs = [
  {
    q: "What is Passion Events?",
    a: "Passion Events is an event management company based in Hyderabad, founded by Ramya and P. Sai Tanush. It plans and runs weddings, corporate events, concerts, college fests, private parties and destination events, and offers A to Z event services from the first idea to the last guest leaving.",
  },
  {
    q: "Which cities does Passion Events work in?",
    a: "We are based in Hyderabad and plan events across Andhra Pradesh and Telangana, including Vijayawada, Amaravati, Guntur, Visakhapatnam, Rajahmundry, Kurnool, Tirupati, Warangal and Khammam. Our recent weddings were in Nandigama, Jaggayyapeta and Hyderabad, and Passion Live has produced concerts in Bengaluru.",
  },
  {
    q: "Is Passion Events an end-to-end event management company?",
    a: "Yes. You can hand us the whole event, covering concept, planning, vendors, décor, stage, sound and lighting, artists, logistics, guest management and on-site execution, or book a single service and run the rest yourself.",
  },
  {
    q: "Does Passion Events organise concerts and book artists?",
    a: "Yes. Through Passion Live we produce concerts and artist nights, such as Sameera Bharadwaj live in Bengaluru and at Illuzion Club in Hyderabad, and Geetha Madhuri live in concert. We also book singers, bands and DJs for weddings and corporate events.",
  },
  {
    q: "Can Passion Events manage corporate events?",
    a: "Yes. We plan conferences, product launches, award nights, annual celebrations and corporate entertainment, including stage, screens, sound, lighting and the run-of-show on the day.",
  },
  {
    q: "Do you plan birthday parties and private celebrations?",
    a: "Yes. Birthdays, anniversaries, engagements and other private parties are planned with the same care as a large production, from theme and décor to entertainment and guest hospitality.",
  },
  {
    q: "How early should I contact an event company?",
    a: "As early as you can. Popular wedding dates, venues, artists and décor teams get booked first, so share your date, city, guest count and the services you need, and we will tell you what is available.",
  },
  {
    q: "How do I get a quote from Passion Events?",
    a: "Send an enquiry from the contact page with your event type, date, city and guest count, or message @passionevents.p on Instagram. Every quote is prepared for the specific event, so we do not publish fixed packages.",
  },
];
