import { stock } from "@/content/media";
import { collaborators } from "@/content/live";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { site, whatsappLink } from "@/lib/site";
import { LivePageHero } from "@/components/live/LivePageHero";
import { Collaborate } from "@/components/live/HandleAndCollab";
import { EnquiryForm } from "@/components/shared/EnquiryForm";
import { RevealText } from "@/motion/RevealText";

export const metadata = pageMetadata({
  title: "Partner With Us — Sponsors, Artists & Venues",
  description: "Partner with Passion Live on concerts and live events — brand activations, sponsorships, artist collaborations, venues and production partnerships.",
  path: "/concerts/partners",
  image: "/brand/og-passion-live.jpg",
  live: true,
});

export default function PartnersPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Passion Live", path: "/concerts" }, { name: "Partners", path: "/concerts/partners" }])} />
      <LivePageHero
        eyebrow="Partners"
        title={
          <>
            Let&apos;s make <span className="text-volt">noise.</span>
          </>
        }
        intro={<p>Brands, sponsors, artists, venues and production partners — tell us what you have in mind.</p>}
        image={stock.liveHands}
      />
      <Collaborate index="01" showCta={false} />
      <section id="partner-form" className="scroll-mt-20 bg-void py-24 md:py-36" aria-labelledby="partner-form-title">
        <div className="mx-auto grid max-w-[1700px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-volt">(02) Start a conversation</p>
            <RevealText as="h2" id="partner-form-title" flavor="live" split="chars" className="mt-6 font-display text-[clamp(3rem,7vw,7rem)] uppercase leading-[0.86] text-white">
              Pitch us <span className="text-volt">your idea.</span>
            </RevealText>
            <p className="mt-6 max-w-sm text-fog">Every partnership enquiry goes straight to {site.contactPerson} and the Passion Live team.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm
              theme="live"
              source="partners"
              defaultCategory="Concert"
              whatsappHref={whatsappLink("Hi Passion Live, I'd like to discuss a partnership.")}
              partnerTypes={collaborators.map((c) => ({ key: c.key, label: c.title }))}
            />
          </div>
        </div>
      </section>
    </>
  );
}
