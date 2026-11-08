import Link from "next/link";
import type { PublicEvent } from "@/lib/events";
import { artistList, liveDateParts } from "@/lib/event-format";
import { EVENT_STATUS_LABEL, type EventStatus } from "@/lib/constants";
import { MediaImage } from "@/components/shared/MediaImage";
import { PosterArt } from "./EventPoster";
import { LiveButton } from "./LiveButton";
import { Waveform } from "./Waveform";
import { Countdown } from "./Countdown";

/** A single upcoming show gets the full stage: poster + an "on sale" spread. */
export function FeaturedShow({ e }: { e: PublicEvent }) {
  const d = liveDateParts(e.startsAt);
  const artists = artistList(e);
  const poster = e.posterUrl ?? e.coverUrl ?? e.media[0]?.url ?? null;
  const canBook = e.bookingUrl && !["SOLD_OUT", "CANCELLED", "COMPLETED"].includes(e.eventStatus);

  return (
    <article className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
      <Link href={`/concerts/events/${e.slug}`} className="neon-border group relative block aspect-[3/4] overflow-hidden lg:col-span-5">
        {poster ? (
          <MediaImage src={poster} alt={`${e.title} poster`} fill sizes="(max-width: 1024px) 92vw, 40vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <PosterArt title={e.title} artist={artists[0]} city={e.city} large />
        )}
        {/* holographic sheen sweeping across the poster */}
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-[holo_5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgb(255_46_136/0.12),transparent_40%,rgb(46_197_255/0.12)_70%,transparent)] mix-blend-screen" aria-hidden="true" />
      </Link>

      <div className="relative flex flex-col justify-between overflow-hidden border border-white/10 bg-graphite/60 p-7 md:p-10 lg:col-span-7">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-30">
          <Waveform variant="bars" className="h-full w-full" colors={["#ff5a1f", "#ff2e88"]} />
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-acid px-3 py-1.5 font-grotesk text-[0.65rem] font-bold uppercase tracking-[0.2em] text-black">
            <span className="size-1.5 animate-pulse rounded-full bg-black" />
            {EVENT_STATUS_LABEL[e.eventStatus as EventStatus] ?? e.eventStatus}
          </span>
          {artists.length > 0 && <p className="mt-8 font-grotesk text-sm uppercase tracking-[0.3em] text-volt">{artists.join(" · ")}</p>}
          <h3 className="mt-3 font-display text-[clamp(2.8rem,6vw,6rem)] uppercase leading-[0.88] text-white">
            <Link href={`/concerts/events/${e.slug}`}>{e.title}</Link>
          </h3>
          {e.summary && <p className="mt-6 max-w-xl text-lg leading-relaxed text-fog">{e.summary}</p>}
        </div>

        <div className="relative mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
          {d && (
            <div>
              <p className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Date</p>
              <p className="mt-2 font-display text-4xl uppercase leading-none text-white">
                {d.day} {d.month}
              </p>
              <p className="mt-1 font-grotesk text-sm text-fog">
                {d.weekday} {d.year}
                {d.hasTime ? ` · ${d.time}` : ""}
              </p>
            </div>
          )}
          {e.venue && (
            <div>
              <p className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Venue</p>
              <p className="mt-2 font-display text-2xl uppercase leading-tight text-white">{e.venue}</p>
            </div>
          )}
          {e.city && (
            <div>
              <p className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/40">City</p>
              <p className="mt-2 font-display text-2xl uppercase leading-tight text-white">{e.city}</p>
            </div>
          )}
        </div>

        {e.startsAt && !["CANCELLED", "COMPLETED", "POSTPONED"].includes(e.eventStatus) && (
          <div className="relative mt-8">
            <Countdown target={e.startsAt.toISOString()} hasTime={Boolean(d?.hasTime)} />
          </div>
        )}

        <div className="relative mt-10 flex flex-wrap gap-4">
          {canBook && (
            <LiveButton href={e.bookingUrl!} external>
              Book tickets
            </LiveButton>
          )}
          <LiveButton href={`/concerts/events/${e.slug}`} variant="outline">
            Show details
          </LiveButton>
        </div>
      </div>
    </article>
  );
}
