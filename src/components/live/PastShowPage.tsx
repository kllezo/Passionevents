import Link from "next/link";
import type { CSSProperties } from "react";
import { Pic } from "@/components/shared/Pic";
import { JsonLd } from "@/components/shared/JsonLd";
import { StageCanvas } from "./StageCanvas";
import { LiveButton } from "./LiveButton";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { liveDateParts } from "@/lib/event-format";
import { reelUrl } from "@/content/reels";
import { showDate, showPhotoSrc, type PastShow } from "@/content/shows";

const img = (name: string, alt: string, focus?: string) => ({ src: `/media/sized/${name}.webp`, alt, focus });

/**
 * A past Passion Live show told through the photographer's pictures: poster,
 * date, venue and city up top, the story, then the photos in an aligned
 * masonry gallery (each photo at its own shape, nothing awkwardly cropped).
 */
export function PastShowPage({ show }: { show: PastShow }) {
  const start = showDate(show);
  const d = liveDateParts(start)!;
  const poster = show.photos[0];
  // the widest row sets the shared row height; narrower rows are centred
  const widest = Math.max(...show.rows.map((row) => row.reduce((t, i) => t + show.photos[i].ratio, 0)));
  const rowStart = show.rows.map((_, r) => show.rows.slice(0, r).reduce((t, row) => t + row.length, 0));
  const path = `/concerts/events/${show.slug}`;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Passion Live", path: "/concerts" },
      { name: "Shows", path: "/concerts/events" },
      { name: show.title, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: show.title,
      startDate: show.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: show.venue, address: { "@type": "PostalAddress", streetAddress: show.area, addressLocality: show.city, addressRegion: "Telangana", addressCountry: "IN" } },
      image: show.photos.map((p) => `${site.url}${showPhotoSrc(p.name, 1600)}`),
      description: show.summary,
      performer: { "@type": "Person", name: show.artist },
      organizer: { "@type": "Organization", name: "Passion Live", url: `${site.url}/concerts`, parentOrganization: { "@type": "Organization", name: site.name, url: site.url } },
      ...(show.ticketsUrl ? { offers: { "@type": "Offer", url: show.ticketsUrl, availability: "https://schema.org/SoldOut" } } : {}),
    },
  ];

  return (
    <article>
      <JsonLd data={jsonLd} />
      <header className="relative overflow-hidden bg-void pb-16 pt-28 md:pb-20 md:pt-32">
        {/* soft colour wash from the poster: its 24px preview, scaled up and blurred */}
        <div aria-hidden="true" className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-2xl" style={{ backgroundImage: `url(/media/sized/${poster.name}-24.webp)` }} />
        <StageCanvas className="absolute inset-0 h-full w-full" beams={4} />
        <div className="relative mx-auto grid max-w-[1700px] gap-10 px-5 md:px-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-5">
            <div className="neon-border relative overflow-hidden bg-graphite max-lg:h-[52svh] max-lg:!aspect-auto" style={{ aspectRatio: poster.ratio >= 1 ? "4 / 5" : `${poster.ratio}` }}>
              <Pic image={img(poster.name, poster.alt, poster.focus)} sizes="(max-width: 1024px) 92vw, 40vw" preload tone="dark" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-volt">Past show · Completed</p>
            <p className="mt-6 font-grotesk text-lg uppercase tracking-[0.2em] text-white/80">{show.artist}</p>
            <h1 className="mt-3 break-words font-display text-[clamp(2.8rem,7vw,7.2rem)] uppercase leading-[0.86] text-white">{show.title}</h1>
            <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              <div>
                <dt className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Date</dt>
                <dd className="mt-2 font-display text-3xl uppercase text-white">
                  <time dateTime={show.date}>
                    {d.day} {d.month} {d.year}
                  </time>
                </dd>
                <dd className="font-grotesk text-sm text-fog">{d.weekday}</dd>
              </div>
              <div>
                <dt className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Venue</dt>
                <dd className="mt-2 font-display text-3xl uppercase text-white">{show.venue}</dd>
                <dd className="font-grotesk text-sm text-fog">{show.area}</dd>
              </div>
              <div>
                <dt className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">City</dt>
                <dd className="mt-2 font-display text-3xl uppercase text-white">{show.city}</dd>
                <dd className="font-grotesk text-sm text-fog">Telangana</dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-4">
              <LiveButton href="#photos">See the photos</LiveButton>
              {show.reel && (
                <LiveButton href={reelUrl(show.reel)} variant="outline" external>
                  Watch the reel
                </LiveButton>
              )}
              <LiveButton href="/concerts/events" variant="outline">
                All shows
              </LiveButton>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-void py-16 md:py-24">
        <div className="mx-auto grid max-w-[1700px] gap-8 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
          <p className="font-display text-3xl uppercase leading-tight text-white md:text-5xl lg:col-span-5">{show.summary}</p>
          <div className="whitespace-pre-line font-grotesk text-lg leading-relaxed text-fog lg:col-span-6 lg:col-start-7">
            {show.description}
            {show.ticketsUrl && (
              <p className="mt-6 text-sm">
                Ticketed on{" "}
                <a href={show.ticketsUrl} target="_blank" rel="noopener noreferrer" className="text-white underline decoration-volt underline-offset-4">
                  MeraEvents
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="photos" className="scroll-mt-24 bg-char py-16 md:py-24" aria-labelledby="photos-title">
        <div className="mx-auto max-w-[1700px] px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="photos-title" className="font-display text-4xl uppercase text-white md:text-6xl">
              From the night
            </h2>
            <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-white/50">Photos · {show.credit}</p>
          </div>
          {/* Justified rows: photos in a row share one height at their natural
              shape, and rows are sized so every row has the same height. */}
          <div className="mt-10 flex flex-col gap-3 sm:gap-4">
            {show.rows.map((row, r) => {
              const sum = row.reduce((t, i) => t + show.photos[i].ratio, 0);
              const width = `${Math.min(100, (sum / widest) * 100).toFixed(3)}%`;
              return (
                <ul key={r} className="mx-auto flex w-full flex-col gap-3 sm:w-[var(--rw)] sm:flex-row sm:gap-4" style={{ "--rw": width } as CSSProperties}>
                  {row.map((i, k) => {
                    const p = show.photos[i];
                    const n = rowStart[r] + k + 1;
                    return (
                      <li key={p.name} className="min-w-0 sm:basis-0" style={{ flexGrow: p.ratio }}>
                        <figure className="group relative overflow-hidden rounded-sm bg-graphite" style={{ aspectRatio: `${p.ratio}` }}>
                          <Pic image={img(p.name, p.alt, p.focus)} sizes={`(max-width: 640px) 92vw, ${Math.round((p.ratio / widest) * 100)}vw`} tone="dark" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                          <figcaption className="sr-only">{p.alt}</figcaption>
                          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 font-grotesk text-[0.6rem] uppercase tracking-[0.3em] text-white/75 [text-shadow:0_1px_6px_rgb(0_0_0/0.6)]">
                            {String(n).padStart(2, "0")} / {String(show.photos.length).padStart(2, "0")}
                          </span>
                        </figure>
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </div>
          <p className="mt-6 font-grotesk text-xs text-white/40">
            {show.artist} · {show.venue}, {show.area}, {show.city} · <time dateTime={show.date}>{d.day} {d.month} {d.year}</time>
          </p>
        </div>
      </section>

      <div className="bg-void py-14 text-center">
        <Link href="/concerts/events" className="font-grotesk text-xs uppercase tracking-[0.3em] text-white/60 hover:text-volt">
          ← Back to all shows
        </Link>
      </div>
    </article>
  );
}
