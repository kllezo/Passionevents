import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { services } from "@/content/services";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/shared/JsonLd";
import { EnquirySection } from "@/components/events/EnquirySection";
import { FaqSection } from "@/components/events/FaqSection";
import { geoFaqs } from "@/content/events";
import { WhatWeDoIntro, SectionIndex } from "@/components/events/whatwedo/Intro";
import {
  WeddingsSection,
  CorporateSection,
  ConcertsSection,
  CollegeSection,
  PrivateSection,
  DestinationSection,
  ArtistsSection,
  ProductionSection,
} from "@/components/events/whatwedo/Sections";

export const metadata = pageMetadata({
  title: "What We Do — Weddings to Concerts",
  description: "Eight event services from Hyderabad: weddings, corporate events, concerts, college fests, private and destination events, artists, production and full management.",
  path: "/what-we-do",
});

export default function WhatWeDoPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "What we do", path: "/what-we-do" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Passion Events services",
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              url: `${site.url}${s.href}`,
            })),
          },
        ]}
      />
      <WhatWeDoIntro />
      <SectionIndex />
      <WeddingsSection />
      <CorporateSection />
      <ConcertsSection />
      <CollegeSection />
      <PrivateSection />
      <DestinationSection />
      <ArtistsSection />
      <ProductionSection />
      <FaqSection items={geoFaqs} index="10" title="Questions, answered." />
      <EnquirySection index="11" />
    </>
  );
}
