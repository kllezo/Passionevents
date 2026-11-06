import Link from "next/link";
import type { PublicEvent } from "@/lib/events";
import { artistList, liveDateParts } from "@/lib/event-format";
import { EVENT_STATUS_LABEL, type EventStatus } from "@/lib/constants";
import { MediaImage } from "@/components/shared/MediaImage";

export { liveDateParts };

const statusTone: Record<string, string> = {
  ON_SALE: "bg-acid text-black",
  SOLD_OUT: "bg-hot text-white",
  ANNOUNCED: "bg-white text-black",
  POSTPONED: "bg-laser text-black",
  CANCELLED: "bg-white/20 text-white line-through",
  COMPLETED: "bg-white/15 text-white",
};

/**
 * Concert poster card: poster image, neon conic border, light sweep on hover,
 * condensed typography. Booking CTA only appears when a real URL exists.
 */
export function EventPoster({ e, index = 0 }: { e: PublicEvent; index?: number }) {
  const img = e.posterUrl ?? e.coverUrl ?? e.media[0]?.url ?? null;
  const date = liveDateParts(e.startsAt);
  const artists = artistList(e);
  const canBook = e.bookingUrl && !["SOLD_OUT", "CANCELLED", "COMPLETED"].includes(e.eventStatus);

  return (
    <article className="neon-border group relative flex flex-col rounded-[4px] bg-graphite">
      <Link href={`/concerts/events/${e.slug}`} className="relative block aspect-[3/4] overflow-hidden rounded-t-[4px]" data-cursor="View">
        {img ? (
          <MediaImage src={img} alt={`${e.title} poster`} fill sizes="(max-width: 768px) 92vw, (max-width: 1280px) 45vw, 30vw" className="object-cover transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-[1.07]" />
        ) : (
          <div className="live-grid-bg absolute inset-0 grid place-items-center bg-gradient-to-br from-violet/40 via-void to-volt/30">
            <span className="px-6 text-center font-display text-5xl uppercase leading-none text-white/90">{e.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
        {/* light reflection sweep */}
        <span className="pointer-events-none absolute -inset-y-10 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 ease-[var(--ease-silk)] group-hover:left-[130%] group-hover:opacity-100" />
        {date && (
          <div className="absolute left-4 top-4 bg-void/80 px-3 py-2 text-center backdrop-blur">
            <p className="font-display text-3xl leading-none text-white">{date.day}</p>
            <p className="font-grotesk text-[0.65rem] tracking-[0.2em] text-volt">{date.month}</p>
          </div>
        )}
        <span className={`absolute right-4 top-4 px-2.5 py-1 font-grotesk text-[0.62rem] font-bold uppercase tracking-[0.18em] ${statusTone[e.eventStatus] ?? "bg-white text-black"}`}>
          {EVENT_STATUS_LABEL[e.eventStatus as EventStatus] ?? e.eventStatus}
        </span>
        <span className="absolute bottom-4 left-4 font-grotesk text-[0.65rem] tracking-[0.3em] text-white/50">#{String(index + 1).padStart(2, "0")}</span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {artists.length > 0 && <p className="font-grotesk text-xs uppercase tracking-[0.25em] text-volt">{artists.join(" · ")}</p>}
        <h3 className="font-display text-3xl uppercase leading-[0.95] text-white transition-[letter-spacing] duration-500 group-hover:tracking-[0.03em] md:text-4xl">
          <Link href={`/concerts/events/${e.slug}`}>{e.title}</Link>
        </h3>
        <p className="font-grotesk text-sm text-fog">
          {[e.venue, e.city].filter(Boolean).join(" — ")}
          {date ? ` · ${date.weekday} ${date.time}` : ""}
        </p>
        {e.summary && <p className="line-clamp-3 text-sm leading-relaxed text-white/60">{e.summary}</p>}
        <div className="mt-auto flex items-center gap-3 pt-2">
          {canBook ? (
            <a href={e.bookingUrl!} target="_blank" rel="noopener noreferrer" className="bg-volt px-5 py-3 font-grotesk text-[0.7rem] font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-white">
              Book tickets ↗
            </a>
          ) : null}
          <Link href={`/concerts/events/${e.slug}`} className="border border-white/20 px-5 py-3 font-grotesk text-[0.7rem] uppercase tracking-[0.2em] text-white transition-colors hover:border-volt">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
