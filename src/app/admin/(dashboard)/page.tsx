import Link from "next/link";
import { CalendarDays, FileText, Inbox, Radio } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";
import { notificationsConfigured } from "@/lib/notify";
import { site } from "@/lib/site";

// Session-gated, always request-time: allow blocking navigation.
export const instant = false;

export const metadata = { title: "Overview" };

export default async function AdminOverview() {
  await requireAdmin();
  const [published, drafts, live, portfolio, newEnquiries, recent] = await Promise.all([
    db.event.count({ where: { status: "PUBLISHED" } }),
    db.event.count({ where: { status: "DRAFT" } }),
    db.event.count({ where: { experience: "LIVE", status: "PUBLISHED" } }),
    db.event.count({ where: { experience: "EVENTS", status: "PUBLISHED" } }),
    db.enquiry.count({ where: { status: "NEW" } }),
    db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { label: "Published", value: published, icon: CalendarDays },
    { label: "Drafts", value: drafts, icon: FileText },
    { label: "Live shows published", value: live, icon: Radio },
    { label: "New enquiries", value: newEnquiries, icon: Inbox },
  ];

  const setup = [
    { ok: Boolean(site.contact.whatsapp), label: "WhatsApp number (NEXT_PUBLIC_WHATSAPP_NUMBER)" },
    { ok: Boolean(site.contact.phone || site.contact.email), label: "Public phone / email" },
    { ok: Boolean(site.contact.instagram), label: "Instagram URL" },
    { ok: notificationsConfigured(), label: "Enquiry email notifications (RESEND_API_KEY)" },
    { ok: portfolio > 0, label: "At least one published portfolio story" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl">Overview</h1>
          <p className="mt-2 text-stone">One place for Passion Events portfolio stories and Passion Live shows.</p>
        </div>
        <Link href="/admin/events/new" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory hover:bg-forest">
          + New event
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#e8e0d4] bg-white p-6">
            <s.icon className="size-5 text-rose" />
            <p className="mt-4 font-serif text-5xl">{s.value}</p>
            <p className="mt-1 text-sm text-stone">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-[#e8e0d4] bg-white p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm underline underline-offset-4">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-stone">No enquiries yet. They&apos;ll appear here as soon as someone submits the website form.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#efe8dd]">
              {recent.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <span>
                    <span className="font-semibold">{e.fullName}</span> · {e.category}
                    {e.source !== "events" && <span className="ml-2 rounded-full bg-[#efe8dd] px-2 py-0.5 text-xs">{e.source}</span>}
                  </span>
                  <span className="text-stone">{e.createdAt.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-[#e8e0d4] bg-white p-6">
          <h2 className="font-serif text-2xl">Setup checklist</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {setup.map((s) => (
              <li key={s.label} className="flex items-start gap-3">
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${s.ok ? "bg-forest text-white" : "bg-[#efe8dd] text-stone"}`}>{s.ok ? "✓" : "·"}</span>
                <span className={s.ok ? "text-ink" : "text-stone"}>{s.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-stone">Environment settings are documented in docs/SETUP.md.</p>
        </section>
      </div>
    </div>
  );
}
