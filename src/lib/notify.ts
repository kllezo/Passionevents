import "server-only";
import type { Enquiry } from "@prisma/client";

/**
 * Optional e-mail notification for new enquiries via Resend's HTTP API.
 * Runs only when RESEND_API_KEY and ENQUIRY_NOTIFY_TO are configured;
 * otherwise enquiries are stored in the database only (never faked).
 */
export function notificationsConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_NOTIFY_TO);
}

export async function notifyNewEnquiry(e: Enquiry) {
  if (!notificationsConfigured()) return { sent: false, reason: "not-configured" };
  let services = "-";
  try {
    services = (JSON.parse(e.services) as string[]).join(", ") || "-";
  } catch {}
  const lines = [
    `Name: ${e.fullName}`,
    `Phone: ${e.phone}`,
    `Email: ${e.email}`,
    `Category: ${e.category}`,
    `Date: ${e.eventDate ? e.eventDate.toDateString() : "-"}`,
    `Location: ${e.location || "-"}`,
    `Guests: ${e.guestCount ?? "-"}`,
    `Budget: ${e.budget || "-"}`,
    `Services: ${services}`,
    `Source: ${e.source}`,
    "",
    e.details || "",
  ];
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_NOTIFY_FROM || "Passion Events <onboarding@resend.dev>",
        to: process.env.ENQUIRY_NOTIFY_TO!.split(",").map((s) => s.trim()),
        reply_to: e.email,
        subject: `New ${e.category} enquiry - ${e.fullName}`,
        text: lines.join("\n"),
      }),
    });
    return { sent: res.ok, reason: res.ok ? "ok" : `status-${res.status}` };
  } catch (err) {
    console.error("[notify] enquiry email failed", err);
    return { sent: false, reason: "error" };
  }
}
