import { EventsIntro } from "@/components/events/home/EventsIntro";
import { EventsHero } from "@/components/events/home/EventsHero";
import { BrandIntro } from "@/components/events/home/BrandIntro";
import { ClosingStatement } from "@/components/events/home/ClosingStatement";
import { HomeAnswers } from "@/components/events/home/HomeAnswers";
import { FlyThrough } from "@/components/events/home/FlyThrough";
import { WhatWeDo } from "@/components/events/home/WhatWeDo";
import { IndividualServices } from "@/components/events/home/IndividualServices";
import { Approach } from "@/components/events/home/Approach";
import { PortfolioPreview } from "@/components/events/home/PortfolioPreview";
import { FoundersFeature } from "@/components/events/FoundersFeature";
import { HomeReels } from "@/components/events/home/HomeReels";
import { EnquirySection } from "@/components/events/EnquirySection";
import { JsonLd } from "@/components/shared/JsonLd";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Passion Events | Event Management Company in Hyderabad",
    description: "Event management company in Hyderabad for weddings, corporate events, concerts and parties across Andhra Pradesh, Telangana and Bengaluru.",
    path: "/",
  }),
  title: { absolute: "Passion Events | Event Management Company in Hyderabad" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <EventsIntro />
      <EventsHero />
      <BrandIntro />
      <WhatWeDo />
      <IndividualServices index="03" />
      <Approach index="04" />
      <FlyThrough />
      <PortfolioPreview />
      <HomeReels index="05" />
      <FoundersFeature index="06" />
      <HomeAnswers index="07" />
      <ClosingStatement />
      <EnquirySection index="08" />
    </>
  );
}
