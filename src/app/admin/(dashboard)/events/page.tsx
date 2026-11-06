import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";
import { EVENT_CATEGORY_LABEL, EVENT_STATUS_LABEL, type EventCategory, type EventStatus } from "@/lib/constants";
import { setEventPublishAction } from "../../actions";

// Session-gated, always request-time: allow blocking navigation.
export const instant = false;

export const metadata = { title: "Events & shows" };

const filters = [
  { key: "all", label: "All" },
  { key: "LIVE", label: "Passion Live shows" },
  { key: "EVENTS", label: "Portfolio stories" },
  { key: "DRAFT", label: "Drafts" },
];

export default async function AdminEvents({ searchParams }: PageProps<"/admin/events">) {
  await requireAdmin();
  const sp = await searchParams;
  const f = typeof sp.filter === "string" ? sp.filter : "all";
  const where = f === "LIVE" || f === "EVENTS" ? { experience: f } : f === "DRAFT" ? { status: "DRAFT" } : {};
  const events = await db.event.findMany({ where, orderBy: [{ updatedAt: "desc" }], include: { _count: { select: { media: true } } } });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl">Events &amp; shows</h1>
          <p className="mt-2 text-stone">Portfolio stories appear on /portfolio. Live shows appear on /concerts. Only published items are public.</p>
        </div>
        <Link href="/admin/events/new" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory hover:bg-forest">
          + New event
        </Link>
      </div>

      {sp.deleted && <p className="rounded-xl bg-forest/10 px-4 py-3 text-sm text-forest">Event deleted.</p>}

      <div className="flex flex-wrap gap-2">
        {filters.map((x) => (
          <Link
            key={x.key}
            href={x.key === "all" ? "/admin/events" : `/admin/events?filter=${x.key}`}
            className={`rounded-full border px-4 py-2 text-sm ${f === x.key ? "border-ink bg-ink text-ivory" : "border-[#e0d6c8] bg-white"}`}
          >
            {x.label}
          </Link>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d8cdbd] bg-white p-12 text-center">
          <p className="font-serif text-3xl">Nothing here yet</p>
          <p className="mt-2 text-sm text-stone">Create a portfolio story or a Passion Live show to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e8e0d4] bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-[#efe8dd] text-xs uppercase tracking-wider text-stone">
              <tr>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Where it shows</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Visibility</th>
                <th className="px-5 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe8dd]">
              {events.map((e) => (
                <tr key={e.id} className="align-middle">
                  <td className="px-5 py-4">
                    <Link href={`/admin/events/${e.id}`} className="font-semibold hover:underline">
                      {e.title}
                    </Link>
                    <p className="text-xs text-stone">
                      {EVENT_CATEGORY_LABEL[e.category as EventCategory]} · {EVENT_STATUS_LABEL[e.eventStatus as EventStatus]} · {e._count.media} photos
                    </p>
                  </td>
                  <td className="px-5 py-4">{e.experience === "LIVE" ? "Passion Live" : "Portfolio"}</td>
                  <td className="px-5 py-4 text-stone">{e.startsAt ? e.startsAt.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) : "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${e.status === "PUBLISHED" ? "bg-forest/10 text-forest" : "bg-[#efe8dd] text-stone"}`}>
                      {e.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <form action={setEventPublishAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="status" value={e.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"} />
                        <button type="submit" className="rounded-full border border-[#e0d6c8] px-3 py-1.5 text-xs hover:bg-[#f6f3ee]">
                          {e.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <Link href={`/admin/events/${e.id}`} className="rounded-full bg-ink px-3 py-1.5 text-xs text-ivory">
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
