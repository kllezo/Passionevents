/**
 * Page-specific "signature" content for each category landing page. These
 * describe what Passion Events takes care of — they are not claims about
 * particular past events. Edit freely.
 */

export type Step = { title: string; text: string; tag?: string };

/** Weddings — the celebration, ritual by ritual. */
export const weddingJourney: Step[] = [
  { tag: "Roka & engagement", title: "The first yes", text: "Ring ceremonies and the first family gathering — invitations, décor and hosting arranged." },
  { tag: "Haldi", title: "Marigold mornings", text: "Turmeric, marigold and sunshine. Seating, florals and a splash-friendly set-up." },
  { tag: "Mehendi", title: "Henna afternoons", text: "Lounges, mehendi artists, music and refreshments for the long, happy afternoon." },
  { tag: "Sangeet", title: "The night of dance", text: "Stage, sound, lighting, choreography slots and performers for the family's big show." },
  { tag: "Wedding", title: "The muhurtham", text: "Mandap, ritual requirements and every timing cue managed, so the family can simply be present." },
  { tag: "Reception", title: "The grand welcome", text: "Entry, stage, dinner and the last dance — and every guest sent home happy." },
];

/** Corporate — an illustrative show-day run sheet. */
export const corporateRunSheet: { time: string; title: string; text: string }[] = [
  { time: "06:00", title: "Load-in", text: "Stage, truss, LED and AV crews on site; branding goes up." },
  { time: "09:30", title: "Technical rehearsal", text: "Sound, light, screen and speaker cues checked end to end." },
  { time: "11:00", title: "Registration opens", text: "Guest desks, badges, hospitality and wayfinding live." },
  { time: "12:00", title: "Keynote", text: "Stage-managed to the minute — walk-ins, slides and mics on cue." },
  { time: "15:00", title: "Breakouts & networking", text: "Rooms reset, sessions timed, refreshments flowing." },
  { time: "19:30", title: "Awards & gala dinner", text: "Show lighting, trophies, anchors and dinner service in sync." },
  { time: "23:30", title: "Load-out", text: "Everything struck, cleared and handed back on time." },
];

/** Private celebrations — the occasions we style. */
export const privateOccasions: { title: string; script: string; text: string; hue: string }[] = [
  { title: "Birthdays", script: "make a wish", text: "Themes, cakes, entertainment and décor for every age.", hue: "#f4b8a8" },
  { title: "Anniversaries", script: "still us", text: "Intimate dinners or full celebrations of years together.", hue: "#ebc3c8" },
  { title: "Engagements", script: "she said yes", text: "Ring ceremonies styled, hosted and photographed.", hue: "#f2d6a2" },
  { title: "Baby showers", script: "little one", text: "Soft palettes, games, favours and warm hosting.", hue: "#bfe3d4" },
  { title: "Surprise parties", script: "surprise!", text: "Planned quietly, revealed perfectly.", hue: "#d7c7ef" },
  { title: "Private dining", script: "just us", text: "Candlelit tables, curated menus and personal service.", hue: "#f6cfd9" },
];

/** Destination — the journey we manage, door to door. */
export const destinationJourney: Step[] = [
  { tag: "01", title: "Scout", text: "Shortlisting palaces, resorts, beaches and hill retreats that fit the guest list and budget." },
  { tag: "02", title: "Plan", text: "Venue contracts, room blocks, local vendors and a multi-day itinerary." },
  { tag: "03", title: "Travel", text: "Guest travel, airport pick-ups and transfers coordinated." },
  { tag: "04", title: "Arrive", text: "Welcome desks, hampers and check-ins handled before guests ask." },
  { tag: "05", title: "Celebrate", text: "Every function on site run by one team with local partners." },
  { tag: "06", title: "Farewell", text: "Check-outs, departures and the last transfer home." },
];

/** Production — how a show gets built. */
export const productionBuild: Step[] = [
  { tag: "01", title: "Ground plan", text: "Site recce, power, access and a measured layout for every element." },
  { tag: "02", title: "Stage deck", text: "Stage fabricated and levelled to the design and the venue." },
  { tag: "03", title: "Truss & rigging", text: "Truss raised and rigged safely for lights, screens and sound." },
  { tag: "04", title: "Lighting", text: "Wash, spots and effects focused and programmed." },
  { tag: "05", title: "LED & screens", text: "LED walls and screens built, mapped and content-tested." },
  { tag: "06", title: "Sound", text: "PA flown or stacked, tuned to the room and line-checked." },
  { tag: "07", title: "Showtime", text: "On-ground teams on comms, running the show cue by cue." },
];
