/**
 * Business configuration. Contact channels come from environment variables so
 * nothing is invented in code — anything left blank is simply not rendered.
 */
const clean = (v: string | undefined) => (v && v.trim().length > 0 ? v.trim() : null);

export const site = {
  name: "Passion Events",
  liveName: "Passion Live",
  tagline: "Big. Or. Small. We. Make. It. Special.",
  byline: "By Ramya & Tanush",
  description:
    "Passion Events is a Hyderabad-based event company offering A to Z event services — weddings, corporate events, private celebrations, destination events and live concerts — across Andhra Pradesh, Telangana and India.",
  liveDescription:
    "Passion Live brings artists, audiences and unforgettable moments together — concert planning, artist bookings and complete live production from Passion Events.",
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  baseCity: "Hyderabad",
  region: "India",
  contactPerson: "Pabbathi Sai Tanush",
  eventsExecuted: 50,
  contact: {
    whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },
} as const;

export function whatsappLink(message = "Hi Passion Events, I'd like to plan an event.") {
  if (!site.contact.whatsapp) return null;
  return `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
