import { stock } from "@/content/media";
import { faqs } from "@/content/events";
import { pageMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/events/PageHero";
import { EnquirySection } from "@/components/events/EnquirySection";
import { JsonLd } from "@/components/shared/JsonLd";

export const metadata = pageMetadata({
  title: "Contact & Enquiries — Plan Your Event",
  description: "Plan your wedding, corporate event, private celebration, destination event or concert with Passion Events. Send an enquiry to our Hyderabad team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[faqJsonLd(faqs), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])]} />
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s plan <em className="text-rose-deep">something</em>
          </>
        }
        script="beautiful"
        intro={<p>Share a few details below and the Passion Events team will be in touch to understand your celebration.</p>}
        image={stock.weddingArch}
        secondary={stock.vaseBloom}
      />
      <EnquirySection index="01" />
    </>
  );
}
