import { getUpcomingLiveEvents, getPastLiveEvents, getVerifiedArtists, safeRead } from "@/lib/events";
import { featuredArtists } from "@/content/proof";
import { EventPoster } from "./EventPoster";
import { FeaturedShow } from "./FeaturedShow";
import { PastGallery } from "./PastGallery";
import { ArtistsList } from "./ArtistsList";
import { LiveButton } from "./LiveButton";
import { Waveform } from "./Waveform";
import { pastShows, pastShowAsEvent } from "@/content/shows";

/** Upcoming shows grid (published LIVE events only). */
export async function UpcomingShows({ limit }: { limit?: number }) {
  const events = await safeRead("upcoming shows", () => getUpcomingLiveEvents(limit), []);
  if (events.length === 0) return <ShowsEmpty />;
  if (events.length === 1) return <FeaturedShow e={events[0]} />;
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${events.length > 2 ? "xl:grid-cols-3" : ""}`}>
      {events.map((e, i) => (
        <EventPoster key={e.id} e={e} index={i} />
      ))}
    </div>
  );
}

export function ShowsEmpty() {
  return (
    <div className="relative overflow-hidden border border-white/10 bg-graphite/60 px-6 py-20 text-center md:py-28">
      <div className="absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 opacity-60">
        <Waveform variant="line" className="h-full w-full" />
      </div>
      <div className="relative">
        <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-volt">Transmission incoming</p>
        <h3 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.6rem,5.6vw,5.2rem)] uppercase leading-[0.9] text-white">
          New shows are <span className="text-outline-volt">being</span> <span className="text-volt">announced soon.</span>
        </h3>
        <p className="mx-auto mt-6 max-w-lg text-fog">We only list confirmed dates. Want to bring a show to your city, or partner on the next one?</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LiveButton href="/concerts/partners#collaborate">Partner with us</LiveButton>
        </div>
      </div>
    </div>
  );
}

export async function PastExperiences() {
  const events = await safeRead("past shows", () => getPastLiveEvents(), []);
  // Shows kept in code (with the photographer's pictures) join the archive, newest first.
  const known = new Set(events.map((e) => e.slug));
  const merged = [...events, ...pastShows.filter((s) => !known.has(s.slug)).map(pastShowAsEvent)].sort(
    (a, b) => (b.startsAt?.getTime() ?? 0) - (a.startsAt?.getTime() ?? 0)
  );
  return <PastGallery events={merged} />;
}

export async function Artists() {
  const fromShows = await safeRead("artists", () => getVerifiedArtists(), []);
  // Add artists verified from the company's own profile that have no published show yet.
  const known = new Set(fromShows.map((a) => a.name.toLowerCase()));
  const extra = featuredArtists.filter((a) => !known.has(a.name.toLowerCase())).map((a) => ({ name: a.name, image: null, events: [] }));
  return <ArtistsList artists={[...fromShows, ...extra]} />;
}

export function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="aspect-[3/4] animate-pulse bg-graphite" />
      ))}
    </div>
  );
}
