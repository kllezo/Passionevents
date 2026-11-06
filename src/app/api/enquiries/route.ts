import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { enquirySchema } from "@/lib/validation/enquiry";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { notifyNewEnquiry } from "@/lib/notify";

/** Public enquiry endpoint: validates, rate-limits, stores, optionally notifies. */
export async function POST(req: NextRequest) {
  const key = `enquiry:${clientKey(req.headers)}`;
  if (!rateLimit(key, 6, 10 * 60 * 1000).ok) {
    if (!(req.headers.get("content-type") ?? "").includes("application/json")) return fallbackPage(429, false, "Too many enquiries from this connection. Please try again in a few minutes.");
    return NextResponse.json({ ok: false, error: "Too many enquiries from this connection. Please try again in a few minutes." }, { status: 429 });
  }

  // JSON from the enhanced form, or a plain form POST when JavaScript hasn't loaded.
  const isForm = !(req.headers.get("content-type") ?? "").includes("application/json");
  let body: unknown;
  try {
    if (isForm) {
      const fd = await req.formData();
      const obj: Record<string, unknown> = {};
      for (const [k, v] of fd.entries()) if (typeof v === "string" && k !== "services") obj[k] = v;
      obj.services = fd.getAll("services").map(String);
      body = obj;
    } else {
      body = await req.json();
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const respond = (status: number, payload: { ok: boolean; error?: string; fieldErrors?: Record<string, string>; id?: string; notified?: boolean }) =>
    isForm ? fallbackPage(status, payload.ok, payload.error) : NextResponse.json(payload, { status });

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    // Honeypot tripped: respond generically without storing anything.
    if (fieldErrors.website) return respond(400, { ok: false, error: "Unable to submit." });
    return respond(400, { ok: false, error: `Please check your details: ${Object.values(fieldErrors).join(" ")}`, fieldErrors });
  }

  const d = parsed.data;
  try {
    const enquiry = await db.enquiry.create({
      data: {
        fullName: d.fullName,
        phone: d.phone,
        email: d.email,
        category: d.category,
        eventDate: d.eventDate ? new Date(d.eventDate) : null,
        location: d.location ?? "",
        guestCount: d.guestCount ?? null,
        budget: d.budget ?? "",
        services: JSON.stringify(d.services ?? []),
        details: d.details ?? "",
        source: d.source ?? "events",
      },
    });
    const notification = await notifyNewEnquiry(enquiry);
    return respond(201, { ok: true, id: enquiry.id, notified: notification.sent });
  } catch (err) {
    console.error("[enquiries] failed to store enquiry", err);
    return respond(500, { ok: false, error: "We couldn't save your enquiry just now. Please try again shortly." });
  }
}

/** Minimal response page for the no-JavaScript form fallback. */
function fallbackPage(status: number, ok: boolean, error?: string) {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const title = ok ? "Thank you — your enquiry has been received." : "We couldn't send your enquiry.";
  const body = ok ? "Our team will review the details and get back to you." : esc(error ?? "Please go back and try again.");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Passion Events</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fef9ee;color:#171311;font-family:Georgia,serif;text-align:center;padding:2rem}h1{font-weight:300;font-size:2.4rem;max-width:32rem}p{font-family:system-ui,sans-serif;color:#6b635d}a{display:inline-block;margin-top:1.5rem;padding:.9rem 1.8rem;border-radius:999px;background:#171311;color:#fef9ee;text-decoration:none;font-family:system-ui,sans-serif;font-size:.8rem;letter-spacing:.15em;text-transform:uppercase}</style></head><body><main><h1>${title}</h1><p>${body}</p><a href="${ok ? "/" : "javascript:history.back()"}">${ok ? "Back to Passion Events" : "Go back"}</a></main></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}
