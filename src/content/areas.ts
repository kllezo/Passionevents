/**
 * AREAS WE SERVE — three regional pages (/event-management/<region>).
 *
 * Why regions, not one page per city: near-identical city pages are "doorway
 * pages" under Google's spam policies. Each region page has a genuinely
 * different section per city instead.
 *
 * Facts:
 *  - Service area "across Andhra Pradesh & Telangana" — the company's own Instagram bio.
 *  - Verified work (reels / published shows): weddings in Nandigama, Jaggayyapeta
 *    (NTR district, AP) and Hyderabad; concerts at Illuzion Club, Hyderabad and in Bengaluru.
 *  - City descriptions are general, well-known context about each place — never
 *    claims of past Passion Events work there unless listed under `work`.
 * Add real events to `work` as they happen.
 */

export type CityBlock = {
  id: string;
  name: string;
  /** Other spellings people search. */
  aka?: string[];
  intro: string;
  events: string[];
  note?: string;
};

export type AreaFaq = { q: string; a: string };

export type Area = {
  slug: "andhra-pradesh" | "telangana" | "bengaluru";
  name: string;
  title: string; // <title>, under 60 characters
  h1: string;
  description: string; // meta description, under 155 characters
  summary: string;
  work: { label: string; detail: string; reel?: string }[];
  cities: CityBlock[];
  faqs: AreaFaq[];
};

export const areas: Area[] = [
  {
    slug: "andhra-pradesh",
    name: "Andhra Pradesh",
    title: "Event Management in Andhra Pradesh | Passion Events",
    h1: "Event management in Andhra Pradesh",
    description: "Weddings, corporate events, concerts and parties in Vijayawada, Amaravati, Guntur, Vizag, Rajahmundry, Kurnool and Tirupati by Passion Events.",
    summary:
      "Passion Events plans and runs events across Andhra Pradesh, from family weddings in NTR district to corporate events, college fests and concerts. We bring the planning, décor, stage, sound, lighting and artists, work with trusted local vendors, and stay with you on the day.",
    work: [
      { label: "Engagement evening, Nandigama", detail: "April 2025", reel: "DIT7CNHzKqG" },
      { label: "Pelli kuthuru décor, Nandigama", detail: "April 2025", reel: "DIgArydzZwW" },
      { label: "Wedding day, Nandigama", detail: "April 2025", reel: "DIlOuTfIzG6" },
      { label: "Sunflower haldi, Jaggayyapeta", detail: "June 2025", reel: "DLImPaTz1bw" },
    ],
    cities: [
      {
        id: "vijayawada",
        name: "Vijayawada",
        aka: ["Bezawada", "NTR district"],
        intro:
          "Vijayawada is the closest big city to our recent weddings in Nandigama and Jaggayyapeta, both in NTR district. Families here often plan several functions over two or three days, so we design one look that carries from the engagement to the reception.",
        events: ["Weddings, engagements and receptions", "Haldi, pelli kuthuru and sangeet", "Corporate meets and launches", "Concerts and artist nights"],
      },
      {
        id: "amaravati",
        name: "Amaravati",
        aka: ["Andhra Pradesh capital region"],
        intro:
          "Amaravati and the capital region around it host official functions, inaugurations and large gatherings as well as family celebrations. We handle the stage, screens, sound, seating and guest flow that these events need, alongside décor and hospitality.",
        events: ["Inaugurations and official functions", "Conferences and award ceremonies", "Weddings and receptions", "Cultural programmes"],
      },
      {
        id: "guntur",
        name: "Guntur",
        intro:
          "Guntur sits next to Vijayawada and Amaravati, so we can run Guntur events with the same team and vendors as the rest of the capital region. Weddings, college events and business launches are the requests we plan for most here.",
        events: ["Weddings and engagements", "College fests and cultural nights", "Store and business launches", "Private parties"],
      },
      {
        id: "visakhapatnam",
        name: "Visakhapatnam (Vizag)",
        aka: ["Vizag", "Vishakapatnam"],
        intro:
          "Visakhapatnam's beaches and hill views make it a natural choice for destination weddings and offsites. We coordinate venues, guest travel and stays, and build décor and lighting that works outdoors as well as in banquet halls.",
        events: ["Destination and beach weddings", "Corporate offsites and conferences", "Concerts and live nights", "Anniversaries and birthdays"],
      },
      {
        id: "rajahmundry",
        name: "Rajahmundry",
        aka: ["Rajamahendravaram", "Rajamundry"],
        intro:
          "Rajahmundry, on the Godavari, is known for grand family weddings and riverside celebrations. We plan multi-day functions, traditional décor and guest hospitality so that the family can stay with their guests.",
        events: ["Traditional weddings", "Engagements and receptions", "Cultural and devotional events", "Private celebrations"],
      },
      {
        id: "kurnool",
        name: "Kurnool",
        intro:
          "For Kurnool events we bring planning and production from Hyderabad and combine it with local vendors, which keeps quality consistent without moving everything across the state.",
        events: ["Weddings and receptions", "Corporate and dealer meets", "College events", "Birthday and private parties"],
      },
      {
        id: "tirupati",
        name: "Tirupati",
        intro:
          "Many families plan weddings and celebrations around a visit to Tirumala. We take care of the parts around the ceremony, such as venues, travel, stays, décor and guest management, so the family can focus on the rituals.",
        events: ["Weddings planned around temple visits", "Receptions and family functions", "Corporate events", "Destination celebrations"],
      },
    ],
    faqs: [
      {
        q: "Do you plan weddings in Vijayawada and NTR district?",
        a: "Yes. Our recent weddings include an engagement, pelli kuthuru décor and a wedding in Nandigama, and a sunflower haldi in Jaggayyapeta. We plan every function, from décor and stage to sound, lighting and guest hospitality.",
      },
      {
        q: "Do you manage events in Visakhapatnam, Guntur, Rajahmundry, Kurnool and Tirupati?",
        a: "Yes. We plan events across Andhra Pradesh. Our team handles the planning and production and works with trusted local vendors in each city.",
      },
      {
        q: "Can you organise a concert or artist night in Andhra Pradesh?",
        a: "Yes. Through Passion Live we book artists, plan the venue, stage, sound and lighting, and run the show on the day.",
      },
      {
        q: "How do I get a quote for an event in Andhra Pradesh?",
        a: "Send an enquiry with your event type, date, city and guest count. Every quote is prepared for the specific event and city.",
      },
    ],
  },
  {
    slug: "telangana",
    name: "Telangana",
    title: "Event Management in Hyderabad & Telangana | Passion Events",
    h1: "Event management in Hyderabad and Telangana",
    description: "Passion Events is based in Hyderabad: weddings, corporate events, concerts and parties across Hyderabad, Warangal, Khammam and Telangana.",
    summary:
      "Hyderabad is home for Passion Events. Our team, vendors and production partners are here, which is why most of our weddings, corporate events and concerts start in the city. We also plan events across Telangana, including Warangal and Khammam.",
    work: [
      { label: "Sangeet night, Hyderabad", detail: "August 2025", reel: "DNyDrfV5tsF" },
      { label: "Sameera Bharadwaj at Illuzion Club, Hyderabad", detail: "Passion Live", reel: "DYs9l4Axp0j" },
      { label: "Paatashala Band live, Illuzion, Jubilee Hills", detail: "Passion Live" },
    ],
    cities: [
      {
        id: "hyderabad",
        name: "Hyderabad",
        aka: ["Secunderabad", "Cyberabad"],
        intro:
          "Hyderabad is where we are based, so every service is available here, from a single décor booking to complete management of a multi-day wedding, a corporate conference or a concert. Our live shows at Illuzion Club are part of Passion Live.",
        events: ["Weddings, sangeets and receptions", "Corporate conferences, launches and award nights", "Concerts and DJ nights", "College fests", "Birthdays and private parties"],
      },
      {
        id: "warangal",
        name: "Warangal",
        intro:
          "Warangal is within a few hours' drive of Hyderabad, so we run events there with our own Hyderabad team and production, from family weddings to college and cultural events.",
        events: ["Weddings and receptions", "College fests and cultural events", "Corporate events", "Private celebrations"],
      },
      {
        id: "khammam",
        name: "Khammam",
        intro:
          "Khammam sits between Hyderabad and NTR district, where our recent weddings took place. We plan Khammam weddings and functions with the same team and vendors.",
        events: ["Weddings and engagements", "Haldi and pelli kuthuru functions", "Store and business launches", "Birthday and private parties"],
      },
    ],
    faqs: [
      {
        q: "Where is Passion Events based?",
        a: "In Hyderabad, Telangana. Our team and production partners are here, and we travel for events across Telangana and Andhra Pradesh.",
      },
      {
        q: "What kinds of events do you manage in Hyderabad?",
        a: "Weddings, sangeets and receptions, corporate conferences and award nights, concerts and DJ nights, college fests, and birthdays and private parties, as a single service or complete event management.",
      },
      {
        q: "Do you organise concerts in Hyderabad?",
        a: "Yes. Passion Live has produced shows such as Sameera Bharadwaj at Illuzion Club and Paatashala Band live at Illuzion, Jubilee Hills.",
      },
      {
        q: "Do you plan events in Warangal and Khammam?",
        a: "Yes. Both are within a few hours of Hyderabad and are planned with our own team and production.",
      },
    ],
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    title: "Concerts & Event Management in Bengaluru | Passion Events",
    h1: "Concerts and event management in Bengaluru",
    description: "Passion Live concerts in Bengaluru, including Sameera Bharadwaj live and Geetha Madhuri live in concert, plus weddings and corporate events.",
    summary:
      "Bengaluru is where Passion Live has taken its biggest nights outside Hyderabad, including Sameera Bharadwaj live and Geetha Madhuri live in concert. We also plan weddings, corporate events and private celebrations in the city.",
    work: [
      { label: "Sameera Bharadwaj, live in Bengaluru", detail: "October 2026", reel: "DeTkSCHtGHK" },
      { label: "Geetha Madhuri, live in concert", detail: "Passion Live", reel: "DXletLRk1SB" },
    ],
    cities: [
      {
        id: "bengaluru",
        name: "Bengaluru",
        aka: ["Bangalore"],
        intro:
          "For Bengaluru concerts we handle the artist, venue, stage, sound, lighting, promotion and show-day crew. For weddings and corporate events we bring the same planning and production as in Hyderabad.",
        events: ["Concerts and artist nights", "Telugu artist shows for Bengaluru audiences", "Corporate events and launches", "Weddings and private celebrations"],
      },
    ],
    faqs: [
      {
        q: "Has Passion Events organised concerts in Bengaluru?",
        a: "Yes. Passion Live produced Sameera Bharadwaj live in Bengaluru and Geetha Madhuri live in concert.",
      },
      {
        q: "Can you plan a wedding or corporate event in Bengaluru?",
        a: "Yes. We plan weddings, corporate events and private celebrations in Bengaluru with the same team and production standards as in Hyderabad.",
      },
    ],
  },
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
export const allCities = areas.flatMap((a) => a.cities.map((c) => ({ ...c, region: a })));
