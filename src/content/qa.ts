/**
 * QUESTIONS & ANSWERS — the questions people type (and ask AI assistants)
 * before hiring an event company, answered with published facts only.
 *
 * Rules for this file:
 *  - Facts come from the client (services list, cities, founders, contact) and
 *    from the work published on this site (reels, Passion Live shows).
 *  - "Best / top / luxury / cinematic" questions are answered honestly: what
 *    Passion Events offers and how to judge any planner. No rankings, awards,
 *    prices or reviews are claimed.
 *  - Cities: Passion Events is based in Hyderabad and travels; it plans events
 *    in these cities with its own team and trusted local vendors. No local
 *    offices are claimed.
 */
import { site } from "@/lib/site";

export type QA = { q: string; a: string };

const phone = site.contact.phone;
const email = site.contact.email;
const contactLine = `Call or WhatsApp ${phone}, email ${email}, or send an enquiry through passionevents.co/contact with your date, city, guest count and the services you need.`;
const howToJudge =
  "The right choice depends on your event, so ask any planner for their own recent work, who will be on site on the day, and what is included in the quote.";
const showsLine =
  "Passion Live shows include Sameera Bharadwaj live in Hyderabad and Bengaluru, Mohana Bhogaraju live at Illuzion, Geetha Madhuri in concert and Paatashala Band live.";

/* ------------------------------------------------------------------ */
/* Full service catalogue (client-supplied, 17 Nov 2026)               */
/* ------------------------------------------------------------------ */

export type CatalogueKey = "weddings" | "corporate" | "concerts" | "college" | "private" | "destination" | "production";

export const catalogue: Record<CatalogueKey, { title: string; href: string; items: string[] }> = {
  weddings: {
    title: "Weddings & Celebrations",
    href: "/weddings",
    items: [
      "Wedding planning and management",
      "Destination weddings",
      "Engagement ceremonies",
      "Haldi ceremonies",
      "Mehendi ceremonies",
      "Sangeet nights",
      "Wedding receptions",
      "Mandap and stage decoration",
      "Floral and thematic décor",
      "Wedding catering and hospitality",
      "Wedding photography and videography",
      "Guest accommodation and transportation",
      "Complete wedding coordination",
    ],
  },
  corporate: {
    title: "Corporate Events",
    href: "/corporate-events",
    items: [
      "Corporate conferences",
      "Business meetings and seminars",
      "Product launches",
      "Brand launches and activations",
      "Award ceremonies",
      "Corporate annual days",
      "Team-building events",
      "Corporate celebrations",
      "Exhibition and promotional events",
      "Corporate stage, sound and lighting",
      "Catering and guest management",
    ],
  },
  concerts: {
    title: "Concerts & Live Entertainment",
    href: "/concerts",
    items: [
      "Live music concerts",
      "Musical performances",
      "Celebrity and artist appearances",
      "Singer, DJ and live band bookings",
      "Anchor and emcee bookings",
      "Dance performers and entertainment acts",
      "DJ nights",
      "College music festivals",
      "Cultural entertainment shows",
      "Stage and concert production",
      "Sound and lighting arrangements",
      "Artist coordination, scheduling and hospitality",
      "Concert logistics and on-ground management",
    ],
  },
  college: {
    title: "College Fests & Cultural Events",
    href: "/services/college-fests-and-cultural-events",
    items: [
      "College annual festivals",
      "Technical and cultural fests",
      "Freshers' parties",
      "Farewell events",
      "DJ nights and music events",
      "Celebrity appearances",
      "Artist and band bookings",
      "Stage design and production",
      "Sound, lighting and LED arrangements",
      "Event coordination and execution",
    ],
  },
  private: {
    title: "Private Events",
    href: "/private-events",
    items: [
      "Birthday parties",
      "Anniversary celebrations",
      "Private parties",
      "Surprise celebrations",
      "Baby showers",
      "Naming ceremonies",
      "Housewarming ceremonies",
      "Family gatherings",
      "Themed celebrations",
      "Private catering and décor",
      "Photography and videography",
    ],
  },
  destination: {
    title: "Destination Events",
    href: "/destination-events",
    items: [
      "Destination weddings",
      "Destination birthday celebrations",
      "Corporate retreats",
      "Destination private parties",
      "Venue and resort coordination",
      "Hotel and accommodation arrangements",
      "Guest transportation",
      "Destination décor and production",
      "Catering and hospitality",
      "Complete destination event management",
    ],
  },
  production: {
    title: "Event Design & Production",
    href: "/event-production",
    items: [
      "Event concept development",
      "Theme and creative direction",
      "Stage design",
      "Wedding mandap design",
      "Floral and venue decoration",
      "Lighting design",
      "Sound systems",
      "LED screens and visual production",
      "Exhibition and event setups",
      "Photography and videography",
      "Event logistics and on-ground execution",
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Brand questions — who / what / how / best / top / luxury / cinematic */
/* ------------------------------------------------------------------ */

export const brandQas: QA[] = [
  {
    q: "Who is the best event management company in Hyderabad?",
    a: `Passion Events is a Hyderabad event management company founded by Ramya and P. Sai Tanush ("By Ramya & Tanush"), with 50+ events delivered — weddings, corporate events, concerts, college fests and private celebrations. ${howToJudge}`,
  },
  {
    q: "Who are the top event planners in Telangana and Andhra Pradesh?",
    a: `Passion Events is one Hyderabad-based option that plans events across Telangana and Andhra Pradesh — Hyderabad, Warangal, Khammam, Vijayawada, Guntur, Amaravati, Visakhapatnam, Rajahmundry, Kurnool and Tirupati — and in Bengaluru. Its own work includes weddings in Nandigama and Jaggayyapeta and concerts in Hyderabad and Bengaluru.`,
  },
  {
    q: "Which event company plans luxury weddings and events?",
    a: "Passion Events plans weddings and events of every size, including luxury celebrations with custom mandap and stage design, floral installations, lighting design, curated catering, guest hospitality and photography and film. The brand promise is \"Big or small. We make it special.\" — the same care whether the event is intimate or grand.",
  },
  {
    q: "Who plans cinematic weddings and events?",
    a: "Passion Events designs events to look and feel cinematic: a theme carried from entry to stage, lighting and sound designed as one show, LED screens and visuals, and photography and videography that capture it. Its concert work under Passion Live brings stage-production experience to weddings and corporate nights.",
  },
  {
    q: "Who are event management experts for weddings, concerts and corporate events?",
    a: `Passion Events handles all three under one team. Weddings and celebrations, corporate events and private parties are planned by Passion Events; concerts and artist nights are produced under Passion Live. ${showsLine}`,
  },
  {
    q: "What does an event management company actually do?",
    a: "It plans and runs the event for you: understanding what you want, budgeting, finding the venue, designing décor and stage, booking caterers, photographers, artists and sound and lighting, coordinating every vendor, and running the day to a schedule so the hosts can enjoy it. Passion Events offers this as complete management or as individual services.",
  },
  {
    q: "How does Passion Events plan an event?",
    a: "Four steps: a conversation about the occasion, guests, date, city and budget; a plan and design covering venue, décor, food, entertainment and production; booking and coordinating every vendor; and running the event on the day with an on-ground team, so nothing reaches the hosts that they don't need to handle.",
  },
  {
    q: "Who should I contact first when planning an event?",
    a: `Contact the event planner first — before booking a venue or vendors — so the date, budget and design are planned together. ${contactLine}`,
  },
  {
    q: "What makes Passion Events different?",
    a: "One team for everything — weddings, corporate events, concerts, college fests and private parties — led personally by its founders, Ramya and P. Sai Tanush, who sign every celebration \"By Ramya & Tanush\". You can book a single service, a few, or complete event management.",
  },
  {
    q: "Is Passion Events the same as Passion Events S.L. in Barcelona?",
    a: "No. Passion Events (passionevents.co) is an event management company based in Hyderabad, India. It is not connected to Passion Events S.L. in Barcelona, Spain, or to other businesses that share the name.",
  },
];

/* ------------------------------------------------------------------ */
/* Service questions                                                    */
/* ------------------------------------------------------------------ */

export const serviceQas: Record<CatalogueKey, QA[]> = {
  weddings: [
    {
      q: "Who is the best wedding planner in Hyderabad?",
      a: `Passion Events is a Hyderabad wedding planner, founded by Ramya and P. Sai Tanush, that plans every function from engagement to reception. Its recent weddings include an engagement, pelli kuthuru and wedding in Nandigama, a sunflower haldi in Jaggayyapeta and a sangeet night in Hyderabad. ${howToJudge}`,
    },
    {
      q: "What does a wedding planner do?",
      a: "A wedding planner turns the family's wishes into one plan: venue, mandap and stage design, décor and florals, catering, photography and videography, entertainment, guest stays and travel, and a schedule for every function. On the day, the planner's team runs everything so the family can be with their guests.",
    },
    {
      q: "Do you plan haldi ceremonies?",
      a: "Yes. Passion Events plans and decorates haldi ceremonies — themed backdrops (such as its sunflower haldi in Jaggayyapeta), seating, floral décor, music, catering and photography — as part of the wedding or as a single booking.",
    },
    {
      q: "Do you plan mehendi ceremonies?",
      a: "Yes. Mehendi décor, seating for the bride and guests, mehendi artists, music or a DJ, food and photography are planned and set up by the Passion Events team.",
    },
    {
      q: "Do you organise sangeet nights?",
      a: "Yes. Passion Events plans sangeet nights with stage, sound and lighting, choreographed performances, anchors, DJs, singers or live bands, décor and catering — including a sangeet night in Hyderabad in August 2025.",
    },
    {
      q: "Do you plan engagement ceremonies and receptions?",
      a: "Yes. Engagements, ring ceremonies and receptions are planned end to end: venue, stage and décor, entry moments, sound and lighting, catering, guest management and photography.",
    },
    {
      q: "Do you do mandap and stage decoration?",
      a: "Yes. Mandap design, wedding stage decoration, floral and thematic décor, entrances and lighting are designed and built by the Passion Events team for traditional and contemporary weddings.",
    },
    {
      q: "Can you plan a luxury or cinematic wedding?",
      a: "Yes. For grand weddings Passion Events designs a theme across all functions, with custom mandaps and stages, floral installations, lighting design, LED visuals, curated catering, guest hospitality, and photography and film that capture it all.",
    },
    {
      q: "Do you handle wedding catering, photography and guest accommodation?",
      a: "Yes. Catering and hospitality, wedding photography and videography, guest accommodation and transportation are all part of complete wedding coordination — or can be booked individually.",
    },
    {
      q: "Do you plan destination weddings?",
      a: "Yes. Passion Events plans destination weddings in India — venue and resort coordination, guest travel and stays, décor and production at the location, catering and multi-day itineraries.",
    },
    {
      q: "Where do you plan weddings?",
      a: "From Hyderabad across Telangana and Andhra Pradesh — Hyderabad, Warangal, Khammam, Vijayawada, Guntur, Amaravati, Visakhapatnam, Rajahmundry, Kurnool and Tirupati — and in Bengaluru, plus destination weddings elsewhere in India.",
    },
    {
      q: "How early should we book a wedding planner?",
      a: "As early as possible — ideally before the venue — and at least a few months ahead for a large wedding, especially in the main wedding season. Smaller functions can be planned in less time.",
    },
  ],
  corporate: [
    {
      q: "Who is the best corporate event management company in Hyderabad?",
      a: `Passion Events is a Hyderabad event company that plans corporate conferences, product and brand launches, award ceremonies, annual days and team events, with its own stage, sound and lighting production experience from concerts. ${howToJudge}`,
    },
    {
      q: "What corporate events does Passion Events manage?",
      a: "Corporate conferences, business meetings and seminars, product launches, brand launches and activations, award ceremonies, annual days, team-building events, corporate celebrations, and exhibitions and promotional events.",
    },
    {
      q: "Do you organise product launches and brand activations?",
      a: "Yes. Passion Events plans launch concepts, stage and LED reveals, sound and lighting, branding, guest and media management, and on-ground teams for product launches, brand launches and activations.",
    },
    {
      q: "Can you manage a corporate annual day or award ceremony?",
      a: "Yes — stage design, AV, lighting, anchors, performers and artists, award logistics, catering and guest management, run to a show schedule.",
    },
    {
      q: "Do you provide stage, sound and lighting for conferences?",
      a: "Yes. Corporate stage, sound and lighting, LED screens and visual production are provided and run by the production team.",
    },
    {
      q: "Do you plan team-building events and corporate retreats?",
      a: "Yes. Team-building events and corporate celebrations in the city, and corporate retreats at destinations with travel, stays and activities arranged.",
    },
    {
      q: "Which cities do you manage corporate events in?",
      a: "Hyderabad, where Passion Events is based, and across Telangana, Andhra Pradesh and Bengaluru.",
    },
  ],
  concerts: [
    {
      q: "Who organises concerts in Hyderabad?",
      a: `Passion Live, the concert brand of Passion Events, produces concerts and artist nights in Hyderabad and Bengaluru. ${showsLine}`,
    },
    {
      q: "Can I book a singer, DJ or live band for my event?",
      a: "Yes. Passion Events books singers, celebrity artists, DJs, live bands, anchors and emcees, dancers and entertainment acts for weddings, sangeets, corporate events, college fests and concerts, and handles artist coordination, scheduling and hospitality.",
    },
    {
      q: "Do you arrange celebrity appearances?",
      a: "Yes. Celebrity and artist appearances are arranged and managed — booking, travel, stay, rider, stage time and security — for launches, college fests, weddings and concerts.",
    },
    {
      q: "What does concert production include?",
      a: "Artist booking, venue, stage and truss, sound system design, lighting, LED screens, promotion and ticketing, crowd flow, hospitality, and the show-day crew from soundcheck to encore.",
    },
    {
      q: "Do you organise DJ nights and music festivals?",
      a: "Yes — DJ nights, college music festivals, cultural entertainment shows and live music concerts, with production and on-ground management.",
    },
    {
      q: "Which cities do you organise concerts in?",
      a: "Passion Live has produced shows in Hyderabad (Illuzion) and Bengaluru, and can organise concerts across Telangana and Andhra Pradesh.",
    },
  ],
  college: [
    {
      q: "Who organises college fests in Hyderabad?",
      a: "Passion Events organises college fests and cultural events — annual festivals, technical and cultural fests, freshers' parties and farewells — with stages, sound, lighting and LED, artists and bands, and event coordination.",
    },
    {
      q: "Can you book celebrities and bands for a college fest?",
      a: "Yes. Celebrity appearances, singers, DJs and live bands are booked and managed, with the production and crowd planning a campus event needs.",
    },
    {
      q: "Do you plan freshers' parties and farewell events?",
      a: "Yes. Freshers' parties, farewells and DJ nights are planned with venue set-up, sound and lighting, décor, entertainment and coordination.",
    },
    {
      q: "Can you work with a student committee's budget?",
      a: "Yes. Committees can book complete management or only what they need, such as stage and sound or an artist booking. Every quote is prepared for the specific fest.",
    },
  ],
  private: [
    {
      q: "Who is the best birthday party planner in Hyderabad?",
      a: `Passion Events plans birthday parties and private celebrations in Hyderabad, from intimate dinners to large themed parties, with décor, catering, entertainment and photography. ${howToJudge}`,
    },
    {
      q: "What private events do you plan?",
      a: "Birthday parties, anniversary celebrations, private parties, surprise celebrations, baby showers, naming ceremonies, housewarming ceremonies, family gatherings and themed celebrations.",
    },
    {
      q: "Do you plan baby showers and naming ceremonies?",
      a: "Yes — décor, seating, catering, rituals arrangements, return gifts and photography for baby showers, seemantham and naming ceremonies.",
    },
    {
      q: "Can you plan a surprise party?",
      a: "Yes. Passion Events plans surprise celebrations discreetly, coordinating the venue, décor, guests, cake and the reveal moment.",
    },
    {
      q: "Do you do housewarming (gruhapravesam) functions?",
      a: "Yes. Housewarming ceremonies are planned with décor, seating, catering and arrangements for the puja and guests.",
    },
    {
      q: "Can I book only décor or catering for a private party?",
      a: "Yes. Private catering and décor, photography and videography, or entertainment can be booked on their own.",
    },
  ],
  destination: [
    {
      q: "Who plans destination weddings from Hyderabad?",
      a: "Passion Events plans destination weddings and celebrations from Hyderabad: venue and resort coordination, hotel stays, guest transportation, décor and production at the location, catering and complete destination event management.",
    },
    {
      q: "What destination events do you plan?",
      a: "Destination weddings, destination birthday celebrations, corporate retreats and destination private parties.",
    },
    {
      q: "Do you handle guest travel and accommodation?",
      a: "Yes. Hotel and accommodation arrangements, guest transportation and welcome hospitality are coordinated so guests simply arrive.",
    },
    {
      q: "Which destinations do you work in?",
      a: "Destinations across India, including Visakhapatnam for beach celebrations and Tirupati for weddings planned around temple visits.",
    },
  ],
  production: [
    {
      q: "Who does event design and production in Hyderabad?",
      a: "Passion Events designs and produces events from Hyderabad: concept and creative direction, stage and mandap design, floral and venue decoration, lighting design, sound systems, LED screens and visuals, exhibition set-ups and on-ground execution.",
    },
    {
      q: "Can I book only stage, sound and lighting?",
      a: "Yes. Stage design, sound systems, lighting design and LED screens can be booked on their own for weddings, corporate events, college fests and concerts.",
    },
    {
      q: "Do you design wedding mandaps?",
      a: "Yes. Wedding mandap design and floral décor are designed and built for traditional and contemporary weddings.",
    },
    {
      q: "Do you set up exhibitions and promotional events?",
      a: "Yes. Exhibition and event set-ups, branding and promotional event production are part of the service.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Cities                                                               */
/* ------------------------------------------------------------------ */

export type CityProfile = {
  id: string;
  /** Short name used in sentences. */
  name: string;
  state: "Telangana" | "Andhra Pradesh" | "Karnataka";
  regionSlug: "telangana" | "andhra-pradesh" | "bengaluru";
  /** One or two lines of general, well-known context for answers. */
  weddingNote: string;
  corporateNote: string;
  destinationNote: string;
  /** Extra question unique to the city. */
  extra?: QA;
  nearby: string[];
};

export const cityProfiles: CityProfile[] = [
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    regionSlug: "telangana",
    weddingNote: "Hyderabad is home, so every wedding service is available here, and recent work includes a sangeet night in the city.",
    corporateNote: "Hyderabad's IT and business districts host conferences, launches and award nights through the year, and the production team is based here.",
    destinationNote: "Families in Hyderabad often plan destination weddings in Visakhapatnam, Tirupati or elsewhere in India; Passion Events plans them from here.",
    extra: {
      q: "Where in Hyderabad does Passion Events organise concerts?",
      a: "Passion Live shows in Hyderabad include Sameera Bharadwaj live and Mohana Bhogaraju live at Illuzion, and Paatashala Band live at Illuzion, Jubilee Hills.",
    },
    nearby: ["warangal", "khammam", "kurnool"],
  },
  {
    id: "warangal",
    name: "Warangal",
    state: "Telangana",
    regionSlug: "telangana",
    weddingNote: "Warangal is within a few hours' drive of Hyderabad, so weddings here are run with the Hyderabad team and production.",
    corporateNote: "Corporate events, dealer meets and launches in Warangal are planned with the same stage and AV production used in Hyderabad.",
    destinationNote: "Warangal's heritage — the Thousand Pillar Temple and Warangal Fort — makes it a meaningful setting for family celebrations.",
    extra: {
      q: "Do you organise college fests in Warangal?",
      a: "Yes. Warangal is a major education centre, and Passion Events organises college fests, cultural nights, freshers' and farewells with stage, sound, lighting and artist bookings.",
    },
    nearby: ["hyderabad", "khammam"],
  },
  {
    id: "khammam",
    name: "Khammam",
    state: "Telangana",
    regionSlug: "telangana",
    weddingNote: "Khammam sits between Hyderabad and NTR district, where Passion Events' recent weddings took place, so the same team and vendors plan weddings here.",
    corporateNote: "Store openings, business launches and corporate functions in Khammam are planned with the Hyderabad production team.",
    destinationNote: "For larger celebrations, Khammam families can combine local functions with venues in Vijayawada or Hyderabad.",
    extra: {
      q: "Do you plan haldi and pelli kuthuru functions in Khammam?",
      a: "Yes. Haldi, pelli kuthuru, mehendi and sangeet are planned with themed décor, seating, music and catering — like the haldi and pelli kuthuru functions Passion Events decorated in nearby NTR district.",
    },
    nearby: ["vijayawada", "warangal", "hyderabad"],
  },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    regionSlug: "andhra-pradesh",
    weddingNote: "Visakhapatnam's beaches and hill views suit outdoor and beach weddings as well as banquet-hall celebrations.",
    corporateNote: "Vizag's port and industry make it a regular city for conferences, offsites and corporate celebrations.",
    destinationNote: "Vizag is a natural destination for beach weddings and corporate offsites; Passion Events coordinates venues, guest travel and stays, and outdoor-ready décor and lighting.",
    extra: {
      q: "Do you plan beach weddings in Vizag?",
      a: "Yes. Beach and outdoor weddings in Visakhapatnam are planned with weather-ready décor, lighting and sound, guest travel and stays, and catering.",
    },
    nearby: ["rajahmundry", "vijayawada"],
  },
  {
    id: "vijayawada",
    name: "Vijayawada",
    state: "Andhra Pradesh",
    regionSlug: "andhra-pradesh",
    weddingNote: "Vijayawada is the closest big city to Passion Events' recent weddings in Nandigama and Jaggayyapeta (NTR district); families here often plan two or three days of functions.",
    corporateNote: "As the commercial hub of the capital region, Vijayawada hosts launches, dealer meets and conferences that Passion Events plans with full stage and AV.",
    destinationNote: "Riverside venues on the Krishna and nearby resorts suit multi-day celebrations.",
    extra: {
      q: "Have you done weddings near Vijayawada?",
      a: "Yes. Recent work in NTR district includes an engagement evening, pelli kuthuru décor and a wedding day in Nandigama, and a sunflower haldi in Jaggayyapeta.",
    },
    nearby: ["guntur", "amaravati", "khammam"],
  },
  {
    id: "guntur",
    name: "Guntur",
    state: "Andhra Pradesh",
    regionSlug: "andhra-pradesh",
    weddingNote: "Guntur sits next to Vijayawada and Amaravati, so weddings here are planned with the same team and vendors as the rest of the capital region.",
    corporateNote: "Business launches, store openings and corporate events in Guntur are planned with full production.",
    destinationNote: "Guntur families often combine city functions with venues in Vijayawada or Amaravati.",
    extra: {
      q: "Do you plan birthday parties in Guntur?",
      a: "Yes. Birthday parties, private parties and family celebrations in Guntur are planned with themed décor, catering, entertainment and photography.",
    },
    nearby: ["vijayawada", "amaravati"],
  },
  {
    id: "amaravati",
    name: "Amaravati",
    state: "Andhra Pradesh",
    regionSlug: "andhra-pradesh",
    weddingNote: "Weddings in the Amaravati capital region are planned with the Vijayawada and Guntur vendor network.",
    corporateNote: "Amaravati and the capital region host inaugurations, official functions, conferences and award ceremonies, which need stage, screens, sound, seating and guest flow handled well.",
    destinationNote: "The Krishna riverfront and the region's heritage sites suit large celebrations and cultural programmes.",
    extra: {
      q: "Do you manage inaugurations and official functions in Amaravati?",
      a: "Yes. Inaugurations, official functions, conferences and cultural programmes are planned with stage, LED screens, sound, seating, protocol-friendly guest flow and hospitality.",
    },
    nearby: ["vijayawada", "guntur"],
  },
  {
    id: "rajahmundry",
    name: "Rajahmundry",
    state: "Andhra Pradesh",
    regionSlug: "andhra-pradesh",
    weddingNote: "Rajahmundry, on the Godavari, is known for grand family weddings and riverside celebrations; Passion Events plans multi-day functions and traditional décor here.",
    corporateNote: "Corporate meets and launches in Rajahmundry are planned with full stage and AV production.",
    destinationNote: "The Godavari riverside and nearby Konaseema make Rajahmundry a beautiful setting for destination celebrations.",
    extra: {
      q: "Do you plan cultural and devotional events in Rajahmundry?",
      a: "Yes. Cultural programmes and devotional events are planned with stage, sound, lighting, seating and guest arrangements.",
    },
    nearby: ["visakhapatnam", "vijayawada"],
  },
  {
    id: "kurnool",
    name: "Kurnool",
    state: "Andhra Pradesh",
    regionSlug: "andhra-pradesh",
    weddingNote: "For Kurnool weddings Passion Events brings planning and production from Hyderabad and combines it with local vendors.",
    corporateNote: "Corporate and dealer meets in Kurnool are planned with the Hyderabad production team.",
    destinationNote: "Kurnool is on the highway from Hyderabad, which keeps travel simple for guests from both cities.",
    extra: {
      q: "Do you plan private celebrations in Kurnool?",
      a: "Yes. Birthdays, anniversaries and family functions in Kurnool are planned with décor, catering and entertainment.",
    },
    nearby: ["hyderabad", "tirupati"],
  },
  {
    id: "tirupati",
    name: "Tirupati",
    state: "Andhra Pradesh",
    regionSlug: "andhra-pradesh",
    weddingNote: "Many families plan weddings around a visit to Tirumala; Passion Events handles venues, travel, stays, décor and guest management around the ceremony.",
    corporateNote: "Corporate events and conferences in Tirupati are planned with stage, AV and hospitality.",
    destinationNote: "Tirupati is one of the most popular wedding destinations in South India, thanks to Tirumala.",
    extra: {
      q: "Can you plan a wedding around a Tirumala visit?",
      a: "Yes. Passion Events plans the parts around the ceremony — venues, guest travel and stays, décor, receptions and guest management — so the family can focus on the rituals.",
    },
    nearby: ["kurnool", "bengaluru"],
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    regionSlug: "bengaluru",
    weddingNote: "Weddings in Bengaluru are planned with the same team and production as in Hyderabad.",
    corporateNote: "Bengaluru's tech and startup scene means conferences, launches and team events, planned with full production.",
    destinationNote: "Bengaluru families often choose destination weddings nearby; Passion Events plans them end to end.",
    extra: {
      q: "Has Passion Events organised concerts in Bengaluru?",
      a: "Yes. Passion Live produced Sameera Bharadwaj live in Bengaluru and Geetha Madhuri live in concert.",
    },
    nearby: ["tirupati", "hyderabad"],
  },
];

export const cityProfile = (id: string) => cityProfiles.find((c) => c.id === id);

/** City questions: the services people search for in that city, answered with the city's own context. */
export function cityQas(c: CityProfile): QA[] {
  const n = c.name;
  const list: QA[] = [
    {
      q: `Who is the best event management company in ${n}?`,
      a: `Passion Events plans weddings, corporate events, concerts, college fests and private celebrations in ${n}. It is based in Hyderabad and works in ${n} with its own team and trusted local vendors, led by founders Ramya and P. Sai Tanush, with 50+ events delivered. ${howToJudge}`,
    },
    {
      q: `Who is the best wedding planner in ${n}?`,
      a: `Passion Events plans weddings in ${n} from engagement to reception. ${c.weddingNote} ${howToJudge}`,
    },
    {
      q: `Do you plan haldi, mehendi and sangeet ceremonies in ${n}?`,
      a: `Yes. Haldi, mehendi, sangeet, engagement and reception are planned in ${n} with themed décor, mandap and stage, sound and lighting, entertainment, catering and photography — as one wedding or as individual functions.`,
    },
    {
      q: `Do you plan luxury and cinematic weddings in ${n}?`,
      a: `Yes. For grand weddings in ${n}, Passion Events designs one theme across every function, with custom mandap and stage, floral installations, lighting design, LED visuals, curated catering and photography and film.`,
    },
    {
      q: `Do you manage corporate events in ${n}?`,
      a: `Yes — conferences, product and brand launches, award ceremonies, annual days and team events. ${c.corporateNote}`,
    },
    {
      q: `Can you organise a concert or book a singer or DJ in ${n}?`,
      a: `Yes. Through Passion Live, Passion Events books singers, celebrities, DJs, live bands and anchors in ${n} and produces the stage, sound and lighting. ${showsLine}`,
    },
    {
      q: `Do you organise college fests in ${n}?`,
      a: `Yes. College annual fests, technical and cultural fests, freshers' and farewells in ${n}, with stage, sound, lighting and LED, artist and band bookings and coordination.`,
    },
    {
      q: `Do you plan birthday parties and private events in ${n}?`,
      a: `Yes — birthdays, anniversaries, surprise parties, baby showers, naming ceremonies, housewarmings and family gatherings in ${n}, with décor, catering, entertainment and photography.`,
    },
    {
      q: `Do you plan destination weddings and events in or near ${n}?`,
      a: `Yes. ${c.destinationNote}`,
    },
    {
      q: `Can I book only decoration, catering or sound and lighting in ${n}?`,
      a: `Yes. Any single service — décor, catering, photography, artist booking, or stage, sound and lighting — can be booked in ${n}, as well as several services or complete event management.`,
    },
    {
      q: `How do I book event management in ${n}?`,
      a: contactLine,
    },
  ];
  if (c.extra) list.splice(2, 0, c.extra);
  return list;
}

/** Founder questions (Founders page). */
export const founderQas: QA[] = [
  {
    q: "Who founded Passion Events?",
    a: "Passion Events was founded by P. Sai Tanush (Pabbathi Sai Tanush), its founder, with co-founder Ramya. Together they sign every celebration \"By Ramya & Tanush\".",
  },
  {
    q: "Who is P. Sai Tanush?",
    a: "P. Sai Tanush is the founder of Passion Events and its concert brand Passion Live. He is the first conversation for most clients and leads the company's concerts and live entertainment.",
  },
  {
    q: "Who is Ramya of Passion Events?",
    a: "Ramya is the co-founder of Passion Events. With Sai Tanush she signs every celebration \"By Ramya & Tanush\" and shares the company's promise: big or small, we make it special.",
  },
  {
    q: "What does \"By Ramya & Tanush\" mean?",
    a: "It is the founders' signature on every Passion Events celebration — a promise that the people who founded the company stand behind each event.",
  },
];
