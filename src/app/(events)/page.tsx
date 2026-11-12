import { EventsIntro } from "@/components/events/home/EventsIntro";
import { EventsHero } from "@/components/events/home/EventsHero";
import { BrandIntro } from "@/components/events/home/BrandIntro";
import { ClosingStatement } from "@/components/events/home/ClosingStatement";
import { FlyThrough } from "@/components/events/home/FlyThrough";
import { CinematicShowcase } from "@/components/events/home/CinematicShowcase";
import { WhatWeDo } from "@/components/events/home/WhatWeDo";
import { IndividualServices } from "@/components/events/home/IndividualServices";
import { Approach } from "@/components/events/home/Approach";
import { PortfolioPreview } from "@/components/events/home/PortfolioPreview";
import { FoundersFeature } from "@/components/events/FoundersFeature";
import { WhyUs } from "@/components/events/home/WhyUs";
import { EnquirySection } from "@/components/events/EnquirySection";
import { JsonLd } from "@/components/shared/JsonLd";
import { faqJsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo";
import { faqs } from "@/content/events";

export const metadata = {
  ...pageMetadata({
    title: "Passion Events — Weddings, Corporate & Live Events in Hyderabad",
    description:
      "Big or small, we make it special. Passion Events plans and manages weddings, corporate events, concerts, college fests, private celebrations, destination events and complete event production across India from Hyderabad.",
    path: "/",
  }),
  title: { absolute: "Passion Events — Weddings, Corporate & Live Events in Hyderabad" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), faqJsonLd(faqs)]} />
      <EventsIntro />
      <EventsHero />
      <BrandIntro />
      <FlyThrough />
      <WhatWeDo />
      <IndividualServices index="03" />
      <CinematicShowcase />
      <Approach index="04" />
      <PortfolioPreview index="05" />
      <FoundersFeature index="06" />
      <WhyUs index="07" />
      <ClosingStatement />
      <EnquirySection index="08" />
    </>
  );
}
