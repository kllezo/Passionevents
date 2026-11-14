import { site } from "./site";

/**
 * The WhatsApp hand-off for website enquiries. The message goes to the
 * Passion Events team on the number configured for the site: NEXT_PUBLIC_WHATSAPP_NUMBER
 * when set, otherwise the published contact phone (NEXT_PUBLIC_CONTACT_PHONE).
 * Nothing is hard-coded here, so no number is ever invented.
 *
 * This uses WhatsApp click-to-chat (wa.me): it opens WhatsApp with the message
 * filled in, and the customer presses Send. No API keys are involved.
 */
export const enquiryWhatsappNumber = (site.contact.whatsapp ?? site.contact.phone)?.replace(/\D/g, "") || null;

export type EnquiryFields = {
  fullName: string;
  phone: string;
  email: string;
  category: string;
  eventDate?: string;
  location?: string;
  guestCount?: string;
  budget?: string;
  services?: string[];
  partnerType?: string;
  details?: string;
  source?: "events" | "live" | "partners";
};

function formatDate(v: string) {
  const d = new Date(`${v}T00:00:00`);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * The enquiry as a WhatsApp message, written in the customer's own voice to
 * the Passion Events team (the customer is the one who presses Send).
 * Optional fields appear only when filled in.
 */
export function enquiryMessage(f: EnquiryFields) {
  const v = (s?: string) => (s ?? "").trim();
  const line = (label: string, value?: string) => (v(value) ? [`${label}: ${v(value)}`] : []);
  const name = v(f.fullName);
  const asPartner = v(f.partnerType);
  return [
    "Hi Passion Events team,",
    "",
    asPartner
      ? `I'd like to talk to you about a partnership. I'm reaching out as: ${asPartner}.`
      : "I'd like to enquire about an event. Here are my details.",
    "",
    "About me:",
    `Name: ${name}`,
    `Phone: ${v(f.phone)}`,
    `Email: ${v(f.email)}`,
    "",
    "My event:",
    `Event type: ${v(f.category)}`,
    ...line("Date", v(f.eventDate) ? formatDate(v(f.eventDate)) : ""),
    ...line("Location", f.location),
    ...line("Expected guests", f.guestCount),
    ...line("Budget", f.budget),
    ...line("Services I need", (f.services ?? []).join(", ")),
    ...(v(f.details) ? ["", "A bit more about what I'm looking for:", v(f.details)] : []),
    "",
    "Please get back to me when you can.",
    "",
    "Thanks,",
    name,
    "",
    "(Sent from passionevents.co)",
  ].join("\n");
}

/** wa.me link with the full message, correctly encoded. Null when no number is configured. */
export function enquiryWhatsappUrl(f: EnquiryFields) {
  if (!enquiryWhatsappNumber) return null;
  return `https://wa.me/${enquiryWhatsappNumber}?text=${encodeURIComponent(enquiryMessage(f))}`;
}
