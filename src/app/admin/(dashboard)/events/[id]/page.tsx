import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";
import { EventForm } from "@/components/admin/EventForm";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { deleteEventAction } from "../../../actions";

// Session-gated, always request-time: allow blocking navigation.
export const instant = false;

export const metadata = { title: "Edit event" };

export default async function EditEventPage({ params, searchParams }: PageProps<"/admin/events/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const e = await db.event.findUnique({ where: { id }, include: { media: { orderBy: { sortOrder: "asc" } } } });
  if (!e) notFound();
  const publicHref = e.experience === "LIVE" ? `/concerts/events/${e.slug}` : `/portfolio/${e.slug}`;

  return (
    <div className="max-w-5xl space-y-6">
      <Link href="/admin/events" className="text-sm text-stone hover:text-ink">
        ← All events
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-5xl">{e.title}</h1>
        {e.status === "PUBLISHED" ? (
          <a href={publicHref} target="_blank" className="text-sm underline underline-offset-4">
            View public page ↗
          </a>
        ) : (
          <span className="text-sm text-stone">Draft — not visible to the public</span>
        )}
      </div>
      {sp.saved && <p className="rounded-xl bg-forest/10 px-4 py-3 text-sm text-forest">Event created.</p>}
      <EventForm
        key={e.updatedAt.toISOString()}
        initial={{
          id: e.id,
          title: e.title,
          slug: e.slug,
          experience: e.experience === "EVENTS" ? "EVENTS" : "LIVE",
          status: e.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
          eventStatus: e.eventStatus,
          category: e.category,
          artists: e.artists,
          summary: e.summary,
          description: e.description,
          venue: e.venue,
          city: e.city,
          startsAt: e.startsAt?.toISOString() ?? null,
          endsAt: e.endsAt?.toISOString() ?? null,
          posterUrl: e.posterUrl,
          coverUrl: e.coverUrl,
          bookingUrl: e.bookingUrl,
          featured: e.featured,
          gallery: e.media.map((m) => ({ url: m.url, alt: m.alt })),
        }}
      />
      <section className="rounded-2xl border border-coral/30 bg-white p-6">
        <h2 className="font-serif text-2xl">Delete event</h2>
        <p className="mt-1 text-sm text-stone">Permanently removes this event and its uploaded images. This cannot be undone.</p>
        <form action={deleteEventAction} className="mt-4">
          <input type="hidden" name="id" value={e.id} />
          <ConfirmSubmit message={`Delete "${e.title}" permanently?`} className="rounded-full bg-coral-deep px-5 py-2.5 text-sm font-semibold text-white">
            Delete event
          </ConfirmSubmit>
        </form>
      </section>
    </div>
  );
}
