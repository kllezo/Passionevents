import { faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionLabel } from "./SectionLabel";

/** Visible questions & answers, with matching FAQPage structured data. */
export function FaqSection({ items, index, title = "Good to know." }: { items: { q: string; a: string }[]; index?: string; title?: string }) {
  const [lead, ...rest] = title.split(" ");
  return (
    <section className="bg-ivory py-28 md:py-28" aria-labelledby="faq-title">
      <JsonLd data={faqJsonLd(items)} />
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index={index}>Questions</SectionLabel>
          <h2 id="faq-title" className="mt-8 font-serif text-5xl font-light text-ink md:text-6xl">
            {lead} <em className="text-rose-deep">{rest.join(" ")}</em>
          </h2>
        </div>
        <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-7 lg:col-start-6">
          {items.map((f, i) => (
            <details key={f.q} open={i === 0} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
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
  );
}
