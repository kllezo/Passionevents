import { faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { LiveSectionHead } from "./LiveSectionHead";

/** Passion Live questions & answers, with matching FAQPage structured data. */
export function LiveFaq({ items, index }: { items: { q: string; a: string }[]; index?: string }) {
  return (
    <section className="bg-void py-24 md:py-32" aria-labelledby="live-faq-title">
      <JsonLd data={faqJsonLd(items)} />
      <LiveSectionHead
        index={index}
        eyebrow="Questions"
        id="live-faq-title"
        tone="text-laser"
        title={
          <>
            Asked <span className="text-laser">&amp; answered.</span>
          </>
        }
      />
      <div className="mx-auto max-w-[1700px] px-5 md:px-10">
        <div className="divide-y divide-white/10 border-y border-white/10 md:ml-[33%]">
          {items.map((f, i) => (
            <details key={f.q} open={i === 0} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-grotesk text-lg uppercase tracking-[0.06em] text-white md:text-xl">
                <h3>{f.q}</h3>
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/25 text-xl text-volt transition-transform duration-500 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-3xl leading-relaxed text-fog">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
