/**
 * BLOG — practical guides from Passion Events.
 *
 * Rules for every article (see .seo-geo/publishing-and-safety-policy):
 *  - Only real Passion Events work is cited as ours (reels / published shows).
 *  - No invented statistics, prices, testimonials or authors. Author = the company.
 *  - General advice is written as advice, not as claimed first-hand anecdotes.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  | { type: "reels"; ids: string[] }
  | { type: "links"; items: { label: string; href: string }[] };

export type Post = {
  slug: string;
  title: string; // <title>, under 60 characters
  h1: string;
  description: string; // under 155 characters
  published: string; // ISO date
  updated: string;
  minutes: number;
  /** Reel id (content/reels.ts) whose cover is the article image: our own footage only. */
  cover: string;
  takeaways: string[];
  sections: { h2: string; blocks: Block[] }[];
  faqs: { q: string; a: string }[];
  tags: string[];
};

export const posts: Post[] = [
  {
    slug: "how-to-choose-an-event-management-company",
    title: "How to Choose an Event Management Company: 12 Questions",
    h1: "How to choose an event management company in Hyderabad, Andhra Pradesh and Telangana",
    description: "Twelve questions to ask before you book an event management company, what the quote should include, red flags, and who does what.",
    published: "2026-11-13",
    updated: "2026-11-13",
    minutes: 7,
    cover: "DXmBXWMkzwd",
    tags: ["Planning", "Weddings", "Corporate"],
    takeaways: [
      "An end-to-end event management company plans, coordinates and runs the whole event; a single-service vendor handles one part.",
      "Ask to see real work from the company's own events, not stock photos.",
      "Get a written quote that lists every inclusion, who is responsible on the day, and what happens if plans change.",
      "One point of contact for all vendors is the single biggest difference between a calm event and a stressful one.",
    ],
    sections: [
      {
        h2: "What does an event management company actually do?",
        blocks: [
          { type: "p", text: "An event management company turns an idea into a finished event. In practice that means planning the concept and budget, booking and coordinating vendors such as venues, décor, catering, sound, lighting and artists, managing logistics and guests, and running the event on the day so the host does not have to." },
          { type: "p", text: "Some companies only supply one service, for example décor or a sound system. Others, like Passion Events, offer both: you can book a single service, or hand over the whole event. Knowing which one you need is the first decision to make." },
        ],
      },
      {
        h2: "12 questions to ask before you book",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Can I see your own past events? Ask for photos, videos or reels from events the company actually ran, ideally similar to yours in size and type.",
              "What exactly is included? Ask for a list: planning, décor, stage, sound, lighting, screens, artists, catering coordination, guest management, on-site team.",
              "Who will be my single point of contact? You want one person who knows every detail and answers for every vendor.",
              "Who is on site on the day, and from what time? Ask how many team members will be present and who leads them.",
              "Do you work with your own vendors or mine? Both can work; what matters is who coordinates them and who is responsible if something slips.",
              "Have you worked in my city or venue before? If not, ask how they will handle local vendors, travel and setup time.",
              "How do you handle permissions and safety? For larger events, venue rules, power backup, fire safety and crowd flow should be part of the plan.",
              "What does the timeline look like? A good company can show you what gets decided first, such as date, venue and artists, and what can wait.",
              "How are changes and cancellations handled? Get the terms in writing before you pay an advance.",
              "How and when do I pay? Ask for the payment schedule and what each payment covers.",
              "Can you show me a run-of-show? A minute-by-minute plan for the day is a sign the company has done this before.",
              "What happens if something goes wrong on the day? Ask about backups for power, sound, rain and late arrivals.",
            ],
          },
        ],
      },
      {
        h2: "What should the quote and agreement include?",
        blocks: [
          {
            type: "list",
            items: [
              "Event date, city, venue and expected guest count.",
              "Every inclusion, itemised, so you can compare quotes fairly.",
              "Setup and teardown times, and who pays for overtime at the venue.",
              "Names or roles of the people responsible on the day.",
              "Payment schedule, change policy and cancellation terms.",
              "Anything excluded, so there are no surprises later.",
            ],
          },
        ],
      },
      {
        h2: "Red flags to watch for",
        blocks: [
          {
            type: "list",
            items: [
              "Only stock photos and no real work from their own events.",
              "No written quote, or a single total with no breakdown.",
              "Nobody can say who will be in charge on the day.",
              "Pressure to pay a large advance before terms are agreed.",
              "Vague answers about permissions, power backup or safety for big gatherings.",
            ],
          },
        ],
      },
      {
        h2: "Planner, venue or decorator: who does what?",
        blocks: [
          {
            type: "table",
            caption: "Typical responsibilities of an event management company, a venue and a decorator",
            head: ["Task", "Event management company", "Venue", "Decorator"],
            rows: [
              ["Concept and overall plan", "Yes", "No", "Partly (décor only)"],
              ["Coordinating all vendors", "Yes", "Sometimes, for in-house services", "No"],
              ["Stage, sound, lighting, screens", "Yes", "Sometimes basic in-house", "No"],
              ["Décor and florals", "Yes, or coordinates a decorator", "Sometimes basic", "Yes"],
              ["Artists and entertainment", "Yes", "No", "No"],
              ["Running the day (run-of-show)", "Yes", "Venue staff only", "Setup only"],
            ],
          },
        ],
      },
      {
        h2: "How Passion Events works",
        blocks: [
          { type: "p", text: "Passion Events is based in Hyderabad and plans events across Andhra Pradesh and Telangana. A typical project starts with an enquiry and a call to understand the event, followed by a written plan and quote, vendor and production planning, and a dedicated team on the day. You can book one service or complete event management." },
          {
            type: "links",
            items: [
              { label: "All eight services", href: "/what-we-do" },
              { label: "Event management in Andhra Pradesh", href: "/event-management/andhra-pradesh" },
              { label: "Event management in Hyderabad and Telangana", href: "/event-management/telangana" },
              { label: "Send an enquiry", href: "/contact#enquire" },
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "What is the difference between an event planner and an event management company?", a: "The terms overlap. An event planner usually focuses on planning and coordination, while an event management company also supplies and runs production such as stage, sound, lighting and on-site teams. Passion Events does both." },
      { q: "Should I book one service or full event management?", a: "If you already have a planner or a family member coordinating vendors, one service may be enough. If you want to enjoy the event rather than manage it, complete event management gives you one point of contact for everything." },
      { q: "What should I share in my first enquiry?", a: "Your event type, date, city, venue if known, guest count and the services you need. That is enough for a company to tell you what is available and prepare a quote." },
    ],
  },
  {
    slug: "telugu-wedding-planning-guide",
    title: "Telugu Wedding Planning: Every Function, Step by Step",
    h1: "Planning a Telugu wedding: every function, step by step",
    description: "Engagement, pellikuthuru, haldi, sangeet, muhurtham and reception: what each Telugu wedding function needs, with a simple planning order.",
    published: "2026-11-13",
    updated: "2026-11-13",
    minutes: 8,
    cover: "DIlOuTfIzG6",
    tags: ["Weddings", "Andhra Pradesh", "Telangana"],
    takeaways: [
      "Fix the muhurtham date and venue first; almost every other decision depends on them.",
      "Plan the functions as one story, so décor, colours and entries connect from engagement to reception.",
      "Each function has different needs: haldi wants open space and easy clean-up, sangeet needs sound and a stage, the muhurtham needs a clear view of the mandap.",
      "One coordinator for all functions avoids gaps between vendors across several days.",
    ],
    sections: [
      {
        h2: "Which functions are part of a Telugu wedding?",
        blocks: [
          { type: "p", text: "Customs vary between families and regions, but many Telugu weddings across Andhra Pradesh and Telangana include some or all of these functions:" },
          {
            type: "list",
            items: [
              "Nischitartham (engagement), where the families formally agree the match.",
              "Pellikuthuru and pellikoduku, where the bride and groom are dressed and blessed as bride-to-be and groom-to-be.",
              "Haldi or mangala snanam, the turmeric ceremony before the wedding.",
              "Mehendi and sangeet, music and dance evenings that many families now add.",
              "The wedding (muhurtham), with rituals such as jeelakarra-bellam and talambralu at the auspicious time.",
              "The reception, a celebration for the wider circle of guests.",
            ],
          },
        ],
      },
      {
        h2: "Engagement (nischitartham): what to plan",
        blocks: [
          { type: "p", text: "The engagement sets the tone for everything that follows. Plan the stage or seating for the families, a welcome area, lighting for photos and video, and sound for announcements and music. A themed entry for the couple has become a highlight at many engagements." },
          { type: "p", text: "Example from our work: an engagement evening in Nandigama (April 2025), with a lit entrance walkway and a welcome board for the couple." },
          { type: "reels", ids: ["DIT7CNHzKqG"] },
        ],
      },
      {
        h2: "Pellikuthuru and pellikoduku: what to plan",
        blocks: [
          { type: "p", text: "These are intimate, family-centred functions, so the décor should feel personal: a backdrop for the bride or groom, floral details, seating for elders, and good light for photographs. Keep the space easy to move around in, because family members come and go through the ceremony." },
          { type: "p", text: "Example from our work: pelli kuthuru décor in Nandigama (April 2025)." },
          { type: "reels", ids: ["DIgArydzZwW"] },
        ],
      },
      {
        h2: "Haldi: what to plan",
        blocks: [
          { type: "p", text: "Haldi is joyful and messy, so plan for that. Choose an open or semi-open space, materials that can handle turmeric and water, bright florals, and seating for the couple at the centre. Arrange towels, washing points and a change area close by." },
          { type: "p", text: "Example from our work: a sunflower-themed haldi in Jaggayyapeta (June 2025)." },
          { type: "reels", ids: ["DLImPaTz1bw"] },
        ],
      },
      {
        h2: "Sangeet: what to plan",
        blocks: [
          { type: "p", text: "A sangeet needs a stage, a proper sound system, stage lighting and a clear running order for performances. Decide early whether you want a DJ, live singers or a band, and leave time for rehearsals if family members are performing." },
          { type: "p", text: "Example from our work: a sangeet night in Hyderabad (August 2025)." },
          { type: "reels", ids: ["DNyDrfV5tsF"] },
        ],
      },
      {
        h2: "The wedding day (muhurtham): what to plan",
        blocks: [
          { type: "p", text: "Everything on the wedding day revolves around the muhurtham time. Build the schedule backwards from it: guest arrival, the groom's entry, rituals, and meals. Make sure guests can see the mandap clearly, plan sound so the priest and rituals can be heard, and keep a calm space for the families close to the stage." },
          { type: "reels", ids: ["DIlOuTfIzG6"] },
        ],
      },
      {
        h2: "Reception: what to plan",
        blocks: [
          { type: "p", text: "The reception usually has the largest guest list. Plan the stage and backdrop for photographs with the couple, a queue that moves, entertainment, and catering flow so guests are not kept waiting." },
        ],
      },
      {
        h2: "A simple planning order",
        blocks: [
          {
            type: "table",
            caption: "What to decide first when planning a Telugu wedding",
            head: ["Order", "Decide", "Why"],
            rows: [
              ["1", "Muhurtham date and venue", "Every booking depends on the date and place"],
              ["2", "Which functions you will hold, and guest counts for each", "Sets the size of each event"],
              ["3", "Event company or coordinator", "One team to plan and run all functions"],
              ["4", "Décor theme and colours across functions", "Keeps the whole wedding consistent"],
              ["5", "Artists, DJ or band for sangeet and reception", "Popular artists book early"],
              ["6", "Catering, photography and videography", "Coordinated with the timings"],
              ["7", "Run-of-show for each day", "Everyone knows what happens when"],
            ],
          },
        ],
      },
      {
        h2: "Planning a wedding outside Hyderabad?",
        blocks: [
          { type: "p", text: "Families often hold the wedding in their hometown while relatives travel from Hyderabad, Bengaluru or abroad. We plan weddings across Andhra Pradesh and Telangana, including Vijayawada, Guntur, Amaravati, Visakhapatnam, Rajahmundry, Kurnool, Tirupati, Warangal and Khammam." },
          {
            type: "links",
            items: [
              { label: "Weddings & celebrations", href: "/weddings" },
              { label: "Event management in Andhra Pradesh", href: "/event-management/andhra-pradesh" },
              { label: "Event management in Hyderabad and Telangana", href: "/event-management/telangana" },
              { label: "All our reels", href: "/reels" },
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "What is pellikuthuru?", a: "Pellikuthuru is the function where the bride is dressed and blessed as the bride-to-be, usually shortly before the wedding. The groom's equivalent is pellikoduku." },
      { q: "Do Telugu weddings have a sangeet?", a: "Traditionally the sangeet is more common in North Indian weddings, but many Telugu families now add a sangeet or music night to their wedding functions." },
      { q: "Can one company plan all the wedding functions?", a: "Yes. Passion Events plans every function, from engagement and haldi to the wedding and reception, as one coordinated event." },
    ],
  },
  {
    slug: "how-a-live-concert-is-produced",
    title: "How a Live Concert Is Produced: From Booking to Encore",
    h1: "How a live concert is produced, from artist booking to the last encore",
    description: "The steps behind a live concert: concept, artist booking and riders, venue and permissions, stage, sound and lighting, promotion, soundcheck and show day.",
    published: "2026-11-13",
    updated: "2026-11-13",
    minutes: 7,
    cover: "DeTkSCHtGHK",
    tags: ["Concerts", "Passion Live"],
    takeaways: [
      "A concert is a chain of decisions: date and city, artist, venue, production, promotion, then show day.",
      "The artist's technical rider decides much of the stage, sound and lighting plan.",
      "Permissions, power and crowd safety are planned early, not on the day.",
      "A detailed run-of-show and soundcheck are what make the night feel effortless.",
    ],
    sections: [
      {
        h2: "Who does what at a concert?",
        blocks: [
          {
            type: "table",
            caption: "Roles involved in producing a live concert",
            head: ["Role", "Responsible for"],
            rows: [
              ["Organiser or promoter", "The idea, budget, artist booking, venue, promotion and overall delivery"],
              ["Artist and artist management", "Performance, technical and hospitality requirements (riders)"],
              ["Production team", "Stage, sound, lighting, LED screens and the crew that runs them"],
              ["Venue", "Space, power, entry, local rules and venue staff"],
              ["Ticketing partner", "Ticket sales and entry scanning"],
            ],
          },
          { type: "p", text: "Passion Live, the concert brand of Passion Events, takes on the organiser and production roles: booking the artist, planning the venue and production, promotion and running the show." },
        ],
      },
      {
        h2: "Step 1: Concept, date and city",
        blocks: [{ type: "p", text: "Start with the audience: who is the show for, in which city, and how many people. That decides the artist, the size of the venue and the budget. Check the calendar for festivals, exams and other big events that could clash." }],
      },
      {
        h2: "Step 2: Artist booking and riders",
        blocks: [{ type: "p", text: "Once the artist agrees the date and fee, their team shares a technical rider (instruments, sound, monitors, lighting, stage size) and a hospitality rider (travel, stay, green room). These documents shape the production plan, so get them early." }],
      },
      {
        h2: "Step 3: Venue, permissions and safety",
        blocks: [{ type: "p", text: "Confirm the venue's capacity, power supply, load-in access and curfew. Public events need permissions that vary by city and venue, typically from the police and local authorities, along with fire safety, medical support and a plan for crowd entry and exit. Plan these well before announcing the show." }],
      },
      {
        h2: "Step 4: Stage, sound, lighting and LED",
        blocks: [{ type: "p", text: "Design the stage around the artist's rider and the venue. Sound must reach the back of the room as clearly as the front; lighting is programmed so each song has its own look; LED screens carry the show to people far from the stage. Power backup is essential." }],
      },
      {
        h2: "Step 5: Promotion and ticketing",
        blocks: [{ type: "p", text: "Announce with a strong poster, the artist's own social channels, reels and a reliable ticketing partner. Keep posting through the run-up: line-up details, behind-the-scenes clips and reminders." }],
      },
      {
        h2: "Step 6: Rehearsal and soundcheck",
        blocks: [{ type: "p", text: "Load-in and setup usually happen on show day or the day before. The soundcheck tests every instrument, microphone and monitor with the artist's engineer. Lighting cues and screen content are checked at the same time." }],
      },
      {
        h2: "Step 7: Show day",
        blocks: [
          { type: "p", text: "A minute-by-minute run-of-show covers doors opening, opening acts, the main set, the encore and the exit. Teams are assigned for entry, backstage, the artist, production and safety, all on one communication channel." },
          { type: "p", text: "Examples from Passion Live: Sameera Bharadwaj live in Bengaluru (October 2026) and at Illuzion Club in Hyderabad, and Geetha Madhuri live in concert." },
          { type: "reels", ids: ["DeTkSCHtGHK", "DYs9l4Axp0j", "DXletLRk1SB"] },
        ],
      },
      {
        h2: "After the show",
        blocks: [{ type: "p", text: "Teardown, settlement with the venue and vendors, and a look back at what worked. Share photos and reels while the audience is still talking about the night." }],
      },
      {
        h2: "Planning a concert or artist night?",
        blocks: [
          {
            type: "links",
            items: [
              { label: "Passion Live", href: "/concerts" },
              { label: "Concerts & live entertainment", href: "/services/concerts-and-live-entertainment" },
              { label: "Artist & entertainment management", href: "/services/artist-and-entertainment-management" },
              { label: "Concerts in Bengaluru", href: "/event-management/bengaluru" },
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "What is a technical rider?", a: "A technical rider is a document from the artist's team listing what they need on stage: instruments, sound equipment, monitors, lighting and stage size. The production plan is built around it." },
      { q: "How early should a concert be planned?", a: "As early as possible. Artist availability, venue dates and permissions usually decide the timeline, and bigger shows need more lead time for promotion and production." },
      { q: "Does Passion Events organise concerts outside Hyderabad?", a: "Yes. Passion Live has produced concerts in Bengaluru as well as Hyderabad." },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
