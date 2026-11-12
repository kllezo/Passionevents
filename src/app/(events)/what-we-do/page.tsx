import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { services } from "@/content/services";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/shared/JsonLd";
import { EnquirySection } from "@/components/events/EnquirySection";
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
  CompleteSection,
} from "@/components/events/whatwedo/Sections";

export const metadata = pageMetadata({
  title: "What We Do — Weddings, Corporate, Concerts, Fests & Complete Event Management",
  description:
    "Nine ways Passion Events makes it special: weddings, corporate events, concerts, college fests, private events, destination events, artist management, event design & production and complete event management.",
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
      <CompleteSection />
      <EnquirySection index="10" />
    </>
  );
}
