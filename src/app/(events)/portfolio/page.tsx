import { Suspense } from "react";
import { stock } from "@/content/media";
import { getPortfolioEvents } from "@/lib/events";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/events/PageHero";
import { PortfolioExplorer } from "@/components/events/portfolio/PortfolioExplorer";
import { PortfolioSkeleton } from "@/components/events/home/PortfolioPreview";
import { EnquirySection } from "@/components/events/EnquirySection";
import { JsonLd } from "@/components/shared/JsonLd";

export const metadata = pageMetadata({
  title: "Portfolio — Weddings, Celebrations & Events",
  description: "A curated portfolio of weddings, corporate events, private celebrations and destination events created by Passion Events.",
  path: "/portfolio",
});

async function PortfolioList() {
  const events = await getPortfolioEvents();
  return <PortfolioExplorer events={events} />;
}

export default function PortfolioPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }])} />
      <PageHero
        eyebrow="Portfolio"
        title={
          <>
            Stories we&apos;ve <em className="text-rose-deep">told.</em>
          </>
        }
        intro={<p>A collection of celebrations planned, designed and managed by our team.</p>}
        image={stock.weddingOutdoor}
        secondary={stock.tableFloral}
      />
      <section className="bg-ivory pb-28 pt-10 md:pb-40">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Suspense fallback={<PortfolioSkeleton />}>
            <PortfolioList />
          </Suspense>
        </div>
      </section>
      <EnquirySection index="" />
    </>
  );
}
