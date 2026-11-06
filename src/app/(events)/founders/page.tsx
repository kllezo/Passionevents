import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { foundersList } from "@/content/founders";
import { site } from "@/lib/site";
import { FoundersFeature } from "@/components/events/FoundersFeature";
import { EnquirySection } from "@/components/events/EnquirySection";
import { JsonLd } from "@/components/shared/JsonLd";

export const metadata = pageMetadata({
  title: "Founders — Ramya & P. Sai Tanush",
  description: "Meet the founders of Passion Events, Ramya and Pabbathi Sai Tanush — the signature behind every celebration we create.",
  path: "/founders",
  image: "/media/founders/sai-tanush-900.webp",
});

export default function FoundersPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Founders", path: "/founders" },
          ]),
          ...foundersList.map((f) => ({
            "@context": "https://schema.org",
            "@type": "Person",
            name: f.name,
            jobTitle: "Co-founder",
            worksFor: { "@type": "Organization", name: site.name, url: site.url },
            ...(f.image ? { image: `${site.url}${f.image.src}` } : {}),
          })),
        ]}
      />
      <div className="pt-16 md:pt-20">
        <FoundersFeature index="01" detailed />
      </div>
      <EnquirySection
        index="02"
        title={
          <>
            Talk to <em className="text-rose-deep">Tanush.</em>
          </>
        }
      />
    </>
  );
}
