import Link from "next/link";
import type { PublicEvent } from "@/lib/events";
import { EVENT_CATEGORY_LABEL, type EventCategory } from "@/lib/constants";
import { MediaImage } from "@/components/shared/MediaImage";
import { ImageReveal } from "@/motion/primitives";
import { EventsButton } from "../Button";
import { SprigGroup } from "../botanical/Sprig";
import { buildSprig } from "../botanical/geometry";

const emptySprig = buildSprig({
  p0: { x: 20, y: 200 },
  p1: { x: 160, y: 120 },
  p2: { x: 320, y: 240 },
  p3: { x: 480, y: 60 },
  seed: 99,
  leafCount: 12,
  bloomCount: 6,
});

const layout = [
  { col: "md:col-span-7", aspect: "aspect-[4/3]" },
  { col: "md:col-span-5 md:mt-24", aspect: "aspect-[4/5]" },
  { col: "md:col-span-5", aspect: "aspect-[4/5]" },
  { col: "md:col-span-7 md:mt-16", aspect: "aspect-[16/11]" },
];

export function formatEventDate(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(d);
}

/** Asymmetric editorial gallery of published Passion Events work. */
export function PortfolioGrid({ events }: { events: PublicEvent[] }) {
  if (events.length === 0) return <PortfolioEmpty />;
  return (
    <div className="grid gap-x-8 gap-y-16 md:grid-cols-12">
      {events.map((e, i) => {
        const img = e.coverUrl ?? e.posterUrl ?? e.media[0]?.url;
        return (
          <article key={e.id} className={`group ${layout[i % layout.length].col}`}>
            <Link href={`/portfolio/${e.slug}`} data-cursor="View story" className="block">
              <ImageReveal shape={i % 2 ? "arch" : "up"} className={`${layout[i % layout.length].aspect} w-full rounded-[1.5rem] bg-cream ${i % 2 ? "arch" : ""}`}>
                {img ? (
                  <MediaImage src={img} alt={e.media[0]?.alt || e.title} fill sizes="(max-width: 768px) 92vw, 50vw" className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center font-serif text-3xl italic text-rose">{e.title}</div>
                )}
              </ImageReveal>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow text-rose-deep">{EVENT_CATEGORY_LABEL[e.category as EventCategory] ?? e.category}</p>
                  <h3 className="mt-2 font-serif text-3xl leading-tight text-ink transition-colors group-hover:text-rose-deep md:text-4xl">{e.title}</h3>
                </div>
                <p className="shrink-0 pt-1 text-right text-sm text-stone">
                  {[e.city, formatEventDate(e.startsAt)].filter(Boolean).join(" · ")}
                </p>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function PortfolioEmpty() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-rose/25 bg-cream px-8 py-20 text-center md:px-16 md:py-28">
      <svg viewBox="0 0 500 260" className="pointer-events-none absolute -bottom-10 -left-10 w-[420px] opacity-60" aria-hidden="true">
        <SprigGroup g={emptySprig} strokeWidth={1.4} />
      </svg>
      <p className="eyebrow text-rose-deep">Portfolio</p>
      <h3 className="mx-auto mt-6 max-w-2xl font-serif text-4xl font-light leading-tight text-ink md:text-6xl">
        Our story book is <em className="text-rose-deep">being curated.</em>
      </h3>
      <p className="mx-auto mt-6 max-w-lg text-stone">
        We&apos;re gathering photographs from the celebrations we&apos;ve had the joy of creating. Real moments from real events will appear here soon.
      </p>
      <div className="mt-10 flex justify-center">
        <EventsButton href="/contact#enquire">Plan your event</EventsButton>
      </div>
    </div>
  );
}
