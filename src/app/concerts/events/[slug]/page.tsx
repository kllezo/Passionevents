import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedEventBySlug } from "@/lib/events";
import { artistList } from "@/lib/event-format";
import { EVENT_STATUS_LABEL, type EventStatus } from "@/lib/constants";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { MediaImage } from "@/components/shared/MediaImage";
import { JsonLd } from "@/components/shared/JsonLd";
import { StageCanvas } from "@/components/live/StageCanvas";
import { LiveButton } from "@/components/live/LiveButton";
import { liveDateParts } from "@/lib/event-format";

export async function generateMetadata({ params }: PageProps<"/concerts/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getPublishedEventBySlug(slug, "LIVE");
  if (!e) return { title: "Show" };
  const where = [e.venue, e.city].filter(Boolean).join(", ");
  return pageMetadata({
    title: e.title,
    description: e.summary || `${e.title}${where ? ` at ${where}` : ""} — presented by Passion Live.`,
    path: `/concerts/events/${e.slug}`,
    image: e.posterUrl ?? e.coverUrl ?? "/brand/og-passion-live.jpg",
    live: true,
  });
}

const statusSchema: Record<string, string> = {
  CANCELLED: "https://schema.org/EventCancelled",
  POSTPONED: "https://schema.org/EventPostponed",
};

async function ShowContent({ params }: { params: PageProps<"/concerts/events/[slug]">["params"] }) {
  const { slug } = await params;
  const e = await getPublishedEventBySlug(slug, "LIVE");
  if (!e) notFound();
  const d = liveDateParts(e.startsAt);
  const artists = artistList(e);
  const poster = e.posterUrl ?? e.coverUrl ?? e.media[0]?.url ?? null;
  const cover = e.coverUrl ?? e.posterUrl ?? null;
  const canBook = e.bookingUrl && !["SOLD_OUT", "CANCELLED", "COMPLETED"].includes(e.eventStatus);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Passion Live", path: "/concerts" },
      { name: "Shows", path: "/concerts/events" },
      { name: e.title, path: `/concerts/events/${e.slug}` },
    ]),
    ...(e.startsAt
      ? [
          {
            "@context": "https://schema.org",
            "@type": "MusicEvent",
            name: e.title,
            startDate: e.startsAt.toISOString(),
            ...(e.endsAt ? { endDate: e.endsAt.toISOString() } : {}),
            eventStatus: statusSchema[e.eventStatus] ?? "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            ...(e.venue || e.city ? { location: { "@type": "Place", name: e.venue || e.city, address: { "@type": "PostalAddress", addressLocality: e.city, addressCountry: "IN" } } } : {}),
            ...(poster ? { image: [`${site.url}${poster}`] } : {}),
            description: e.summary || e.description.slice(0, 300),
            ...(artists.length ? { performer: artists.map((a) => ({ "@type": "PerformingGroup", name: a })) } : {}),
            organizer: { "@type": "Organization", name: "Passion Live", url: `${site.url}/concerts` },
            ...(e.bookingUrl ? { offers: { "@type": "Offer", url: e.bookingUrl, availability: e.eventStatus === "SOLD_OUT" ? "https://schema.org/SoldOut" : "https://schema.org/InStock" } } : {}),
          },
        ]
      : []),
  ];

  return (
    <article>
      <JsonLd data={jsonLd} />
      <header className="relative overflow-hidden bg-void pb-20 pt-32">
        {cover && (
          <div className="absolute inset-0">
            <MediaImage src={cover} alt="" fill preload sizes="100vw" className="scale-110 object-cover opacity-25 blur-xl" />
          </div>
        )}
        <StageCanvas className="absolute inset-0 h-full w-full" beams={4} />
        <div className="relative mx-auto grid max-w-[1700px] gap-12 px-5 md:px-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <div className="neon-border relative aspect-[3/4] overflow-hidden bg-graphite">
              {poster ? (
                <MediaImage src={poster} alt={`${e.title} poster`} fill sizes="(max-width: 1024px) 92vw, 40vw" className="object-cover" />
              ) : (
                <div className="live-grid-bg grid h-full place-items-center px-8 text-center font-display text-6xl uppercase text-white/80">{e.title}</div>
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-volt">{EVENT_STATUS_LABEL[e.eventStatus as EventStatus] ?? e.eventStatus}</p>
            {artists.length > 0 && <p className="mt-6 font-grotesk text-lg uppercase tracking-[0.2em] text-white/80">{artists.join(" · ")}</p>}
            <h1 className="mt-3 font-display text-[clamp(3.2rem,9vw,9rem)] uppercase leading-[0.86] text-white">{e.title}</h1>
            <dl className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              {d && (
                <div>
                  <dt className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Date</dt>
                  <dd className="mt-2 font-display text-3xl uppercase text-white">
                    {d.day} {d.month} {d.year}
                  </dd>
                  <dd className="font-grotesk text-sm text-fog">
                    {d.weekday}
                    {d.hasTime ? ` · ${d.time}` : ""}
                  </dd>
                </div>
              )}
              {e.venue && (
                <div>
                  <dt className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Venue</dt>
                  <dd className="mt-2 font-display text-3xl uppercase text-white">{e.venue}</dd>
                </div>
              )}
              {e.city && (
                <div>
                  <dt className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">City</dt>
                  <dd className="mt-2 font-display text-3xl uppercase text-white">{e.city}</dd>
                </div>
              )}
            </dl>
            <div className="mt-10 flex flex-wrap gap-4">
              {canBook && (
                <LiveButton href={e.bookingUrl!} external cursor="Tickets">
                  Book tickets
                </LiveButton>
              )}
              <LiveButton href="/concerts/events" variant="outline" cursor="Shows">
                All shows
              </LiveButton>
            </div>
          </div>
        </div>
      </header>

      {(e.summary || e.description) && (
        <section className="bg-void py-20 md:py-28">
          <div className="mx-auto grid max-w-[1700px] gap-10 px-5 md:px-10 lg:grid-cols-12">
            {e.summary && <p className="font-display text-3xl uppercase leading-tight text-white md:text-5xl lg:col-span-5">{e.summary}</p>}
            <div className="whitespace-pre-line font-grotesk text-lg leading-relaxed text-fog lg:col-span-6 lg:col-start-7">{e.description}</div>
          </div>
        </section>
      )}

      {e.media.length > 0 && (
        <section className="bg-char py-20" aria-label="Gallery">
          <div className="mx-auto grid max-w-[1700px] grid-cols-2 gap-3 px-5 md:grid-cols-4 md:px-10">
            {e.media.map((m, i) => (
              <div key={m.id} className={`relative overflow-hidden bg-graphite ${i % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
                <MediaImage src={m.url} alt={m.alt || `${e.title} — photo ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="bg-void py-14 text-center">
        <Link href="/concerts/events" className="font-grotesk text-xs uppercase tracking-[0.3em] text-white/60 hover:text-volt">
          ← Back to all shows
        </Link>
      </div>
    </article>
  );
}

// Resolve the record before streaming starts so unknown slugs return a real
// HTTP 404 (not a 200 with a not-found body). Detail pages may block briefly.
export const instant = false;

export default async function ShowPage({ params }: PageProps<"/concerts/events/[slug]">) {
  return <ShowContent params={params} />;
}
