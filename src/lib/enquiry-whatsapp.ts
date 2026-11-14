import { site } from "./site";

/**
 * The WhatsApp hand-off for website enquiries. The message goes to Pabbathi
 * Sai Tanush on the number configured for the site: NEXT_PUBLIC_WHATSAPP_NUMBER
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

/** The enquiry as a WhatsApp message. Optional fields appear only when filled in. */
export function enquiryMessage(f: EnquiryFields) {
  const v = (s?: string) => (s ?? "").trim();
  const line = (label: string, value?: string) => (v(value) ? [`${label}: ${v(value)}`] : []);
  const form = f.source === "live" ? "Passion Live enquiry form" : f.source === "partners" ? "Passion Live partnerships form" : "";
  return [
    `Hello ${site.contactPerson.split(" ").slice(1).join(" ") || site.contactPerson},`,
    "",
    "You have received a new enquiry through the Passion Events website.",
    "",
    "NEW CUSTOMER ENQUIRY",
    "",
    "Customer Details:",
    `Name: ${v(f.fullName)}`,
    `Phone Number: ${v(f.phone)}`,
    `Email: ${v(f.email)}`,
    ...line("Partnership Type", f.partnerType),
    "",
    "Event Details:",
    `Event Type: ${v(f.category)}`,
    ...line("Event Date", v(f.eventDate) ? formatDate(v(f.eventDate)) : ""),
    ...line("Event Location", f.location),
    ...line("Expected Guests", f.guestCount),
    ...line("Budget", f.budget),
    ...line("Services Required", (f.services ?? []).join(", ")),
    ...(v(f.details) ? ["", "Additional Requirements:", v(f.details)] : []),
    "",
    "Source: Passion Events Website",
    ...(form ? [`Form: ${form}`] : []),
    "Website: https://passionevents.co",
    "",
    "Please follow up with the customer regarding this enquiry.",
    "",
    "Regards,",
    "Passion Events Website Enquiry System.",
  ].join("\n");
}

/** wa.me link with the full message, correctly encoded. Null when no number is configured. */
export function enquiryWhatsappUrl(f: EnquiryFields) {
  if (!enquiryWhatsappNumber) return null;
  return `https://wa.me/${enquiryWhatsappNumber}?text=${encodeURIComponent(enquiryMessage(f))}`;
}
