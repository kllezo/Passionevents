import Link from "next/link";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/shared/JsonLd";
import { LiveHero } from "@/components/live/LiveHero";
import { VelocityMarquee } from "@/components/live/VelocityMarquee";
import { LiveSectionHead } from "@/components/live/LiveSectionHead";
import { UpcomingShows, PastExperiences, Artists, GridSkeleton } from "@/components/live/ShowListings";
import { GuitarSection } from "@/components/live/GuitarSection";
import { DrumSection } from "@/components/live/DrumSection";
import { WhatWeHandle, Collaborate } from "@/components/live/HandleAndCollab";
import { FinalCTA } from "@/components/live/FinalCTA";
import { ProductionShowcase } from "@/components/live/ProductionShowcase";
import { CautionTapes } from "@/components/live/CautionTapes";
import { HypeMeter } from "@/components/live/HypeMeter";

const liveTitle = "Passion Live — Concerts, Live Music & Artist Bookings in India";
export const metadata = {
  ...pageMetadata({ title: liveTitle, description: site.liveDescription, path: "/concerts", image: "/brand/og-passion-live.jpg", live: true }),
  title: { absolute: liveTitle },
};

export default function LiveHome() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Passion Live",
          url: `${site.url}/concerts`,
          parentOrganization: { "@type": "Organization", name: site.name, url: site.url },
          description: site.liveDescription,
        }}
      />
      <LiveHero />
      <VelocityMarquee words={["Live", "Loud", "Together"]} className="bg-void" />

      <section className="bg-void py-24 md:py-32" aria-labelledby="upcoming-title">
        <LiveSectionHead
          index="01"
          eyebrow="Upcoming shows"
          id="upcoming-title"
          title={
            <>
              On the <span className="text-volt">horizon.</span>
            </>
          }
          aside={
            <Link href="/concerts/events" className="font-grotesk text-xs uppercase tracking-[0.3em] text-white underline-offset-4 hover:text-volt hover:underline">
              All shows →
            </Link>
          }
        />
        <div className="mx-auto max-w-[1700px] px-5 md:px-10">
          <Suspense fallback={<GridSkeleton />}>
            <UpcomingShows limit={6} />
          </Suspense>
        </div>
      </section>

      <CautionTapes />

      <GuitarSection />

      <section className="bg-void py-24 md:py-32" aria-labelledby="past-title">
        <LiveSectionHead
          index="03"
          eyebrow="Past experiences"
          id="past-title"
          tone="text-hot"
          title={
            <>
              Nights we <span className="text-hot">made.</span>
            </>
          }
        />
        <Suspense fallback={<div className="h-[50vh] animate-pulse bg-graphite" />}>
          <PastExperiences />
        </Suspense>
      </section>

      <section className="bg-void pb-24 md:pb-32" aria-labelledby="artists-title">
        <LiveSectionHead
          index="04"
          eyebrow="Artists & performers"
          id="artists-title"
          tone="text-laser"
          title={
            <>
              Who takes the <span className="text-laser">stage.</span>
            </>
          }
        />
        <Suspense fallback={<div className="h-40" />}>
          <Artists />
        </Suspense>
      </section>

      <ProductionShowcase />
      <DrumSection />
      <WhatWeHandle />
      <Collaborate />
      <HypeMeter />
      <FinalCTA />
    </>
  );
}
