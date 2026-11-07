import { Pic } from "@/components/shared/Pic";
import Link from "next/link";
import { stock } from "@/content/media";
import { categories, faqs } from "@/content/events";
import { pageMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/events/PageHero";
import { SectionLabel } from "@/components/events/SectionLabel";
import { IndividualServices } from "@/components/events/home/IndividualServices";
import { EnquirySection } from "@/components/events/EnquirySection";
import { JsonLd } from "@/components/shared/JsonLd";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { RevealText } from "@/motion/RevealText";

export const metadata = pageMetadata({
  title: "Event Services — Planning, Decor, Catering, Artists & Production",
  description:
    "Book individual event services or complete event management: venues, catering, decor, floral styling, photography, videography, stage, sound, lighting, artists, hotels and transport.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={[faqJsonLd(faqs), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])]} />
      <PageHero
        eyebrow="Services"
        title={
          <>
            One team. <em className="text-rose-deep">Every detail.</em>
          </>
        }
        intro={<p>Choose a single service or hand us the entire celebration. Either way, you get the same team and the same care.</p>}
        image={stock.decorArch}
        secondary={stock.catering}
      />

      {/* Category index */}
      <section className="bg-cream py-24 md:py-32" aria-labelledby="cat-index">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionLabel index="01">Event categories</SectionLabel>
          <h2 id="cat-index" className="sr-only">
            Event categories
          </h2>
          <ul className="mt-12 border-t border-ink/15">
            {categories.map((c) => {
              const row = (
                <>
                  <span className="col-start-1 font-serif text-sm italic text-rose md:col-span-1 md:col-start-auto">{c.index}</span>
                  <span className="col-start-1 font-serif text-[clamp(2rem,4.4vw,4.4rem)] leading-none text-ink transition-all duration-700 ease-[var(--ease-silk)] group-hover:translate-x-3 group-hover:italic group-hover:text-rose-deep md:col-span-6 md:col-start-auto">
                    {c.title}
                  </span>
                  <span className="col-start-1 text-stone md:col-span-4 md:col-start-auto">{c.short}</span>
                  {/* phones: an arched thumbnail beside each category; desktop: the round one at the end */}
                  <span className="relative col-start-2 row-span-3 row-start-1 block h-24 w-20 self-center overflow-hidden rounded-t-full rounded-b-xl shadow-[0_16px_30px_-18px_rgb(94_52_64/0.7)] md:col-span-1 md:col-start-auto md:row-span-1 md:row-start-auto md:size-16 md:justify-self-end md:rounded-full md:shadow-none">
                    <Pic image={c.image} alt="" sizes="96px" className="transition-transform duration-1000 group-hover:scale-125" />
                  </span>
                </>
              );
              const cls = "group grid grid-cols-[1fr_5rem] items-center gap-x-4 gap-y-2 border-b border-ink/15 py-7 md:grid-cols-12 md:gap-6 md:py-8";
              return (
                <li key={c.key}>
                  {c.key === "concerts" ? (
                    <UniverseLink href={c.href} to="live" className={cls}>
                      {row}
                    </UniverseLink>
                  ) : (
                    <Link href={c.href} className={cls}>
                      {row}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <IndividualServices index="02" />

      {/* Production & management */}
      <section id="production" className="scroll-mt-24 bg-ink py-28 text-ivory md:py-36">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] lg:col-span-6">
            <Pic image={stock.productionStage} sizes="(max-width: 1024px) 92vw, 45vw" className="" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionLabel index="03" tone="ivory">
              Event production & management
            </SectionLabel>
            <RevealText as="h2" className="mt-8 font-serif text-[clamp(2.4rem,4.6vw,4.6rem)] font-light leading-[1] text-ivory">
              The production partner <em className="text-blush">behind the moment.</em>
            </RevealText>
            <p className="mt-6 text-lg leading-relaxed text-ivory/75">{categories.find((c) => c.key === "production")!.description}</p>
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-ivory/80">
              {categories.find((c) => c.key === "production")!.services.map((s) => (
                <li key={s} className="border-t border-ivory/15 pt-3">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ivory py-28 md:py-36" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="04">Questions</SectionLabel>
            <h2 id="faq-title" className="mt-8 font-serif text-5xl font-light text-ink md:text-6xl">
              Good to <em className="text-rose-deep">know.</em>
            </h2>
          </div>
          <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-7 lg:col-start-6">
            {faqs.map((f) => (
              <details key={f.q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-2xl text-ink md:text-3xl">
                  {f.q}
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/20 text-xl transition-transform duration-500 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <EnquirySection index="05" />
    </>
  );
}
