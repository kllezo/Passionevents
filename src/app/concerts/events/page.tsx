import { Suspense } from "react";
import { stock } from "@/content/media";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { LivePageHero } from "@/components/live/LivePageHero";
import { LiveSectionHead } from "@/components/live/LiveSectionHead";
import { UpcomingShows, PastExperiences, GridSkeleton } from "@/components/live/ShowListings";
import { FinalCTA } from "@/components/live/FinalCTA";

export const metadata = pageMetadata({
  title: "Upcoming Shows & Concerts",
  description: "Upcoming concerts and live shows by Passion Live — dates, venues, cities and booking links for confirmed events.",
  path: "/concerts/events",
  image: "/brand/og-passion-live.jpg",
  live: true,
});

export default function ShowsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Passion Live", path: "/concerts" }, { name: "Shows", path: "/concerts/events" }])} />
      <LivePageHero
        eyebrow="Passion Live · Shows"
        title={
          <>
            Every <span className="text-volt">show.</span>
          </>
        }
        intro={<p>Confirmed dates only. Tap a poster for the full line-up, venue and tickets.</p>}
        image={stock.liveFrontRow}
      />
      <section className="bg-void py-20 md:py-28" aria-label="Upcoming shows">
        <div className="mx-auto max-w-[1700px] px-5 md:px-10">
          <Suspense fallback={<GridSkeleton />}>
            <UpcomingShows />
          </Suspense>
        </div>
      </section>
      <section className="bg-void pb-24 md:pb-32" aria-labelledby="archive-title">
        <LiveSectionHead
          eyebrow="Archive"
          id="archive-title"
          tone="text-hot"
          title={
            <>
              Past <span className="text-hot">nights.</span>
            </>
          }
        />
        <Suspense fallback={<div className="h-[50vh] animate-pulse bg-graphite" />}>
          <PastExperiences />
        </Suspense>
      </section>
      <FinalCTA />
    </>
  );
}
