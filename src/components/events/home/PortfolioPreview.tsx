import { Suspense } from "react";
import { getPortfolioEvents, safeRead } from "@/lib/events";
import { RevealText } from "@/motion/RevealText";
import { PortfolioGrid } from "../portfolio/PortfolioGrid";
import { SectionLabel } from "../SectionLabel";
import { EventsButton } from "../Button";

/**
 * Published stories from the admin dashboard. Until the first one is
 * published the whole section stays out of the page (no empty placeholder);
 * the reels section that follows shows the real work meanwhile.
 */
async function PortfolioSection() {
  const events = await safeRead("portfolio preview", () => getPortfolioEvents(), []);
  if (events.length === 0) return null;
  return (
    <section className="relative bg-ivory py-24 md:py-28" aria-labelledby="portfolio-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel>Portfolio</SectionLabel>
            <RevealText as="h2" id="portfolio-title" className="mt-6 font-serif text-[clamp(2.6rem,4.2vw,4.8rem)] font-light leading-[0.92] text-ink">
              Stories we&apos;ve <em className="text-rose-deep">told.</em>
            </RevealText>
          </div>
          <EventsButton href="/portfolio" variant="ghost">
            Explore our work
          </EventsButton>
        </div>
        <PortfolioGrid events={events.slice(0, 4)} />
        {events.length > 4 && (
          <div className="mt-16 flex justify-center">
            <EventsButton href="/portfolio" variant="outline">
              View the full portfolio
            </EventsButton>
          </div>
        )}
      </div>
    </section>
  );
}

export function PortfolioPreview() {
  return (
    <Suspense fallback={null}>
      <PortfolioSection />
    </Suspense>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-12" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse rounded-[1.5rem] bg-cream md:col-span-7" />
      <div className="aspect-[4/5] animate-pulse rounded-t-full bg-cream md:col-span-5" />
    </div>
  );
}
