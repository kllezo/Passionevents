import { SectionLabel } from "./SectionLabel";

/**
 * The full list of what a service covers. Plain, crawlable text.
 */
export function ServiceCatalogue({ title, items, label = "Everything we handle" }: { title: string; items: string[]; label?: string }) {
  return (
    <section className="bg-cream py-20 md:py-24" aria-labelledby="catalogue-title">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel>{label}</SectionLabel>
          <h2 id="catalogue-title" className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.6rem)] font-light leading-none text-ink">
            {title}, <em className="text-rose-deep">in full.</em>
          </h2>
          <p className="mt-6 max-w-sm text-stone">Book one service, a few, or complete management — from concept and planning to the day itself.</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {items.map((i) => (
              <li key={i} className="flex gap-3 border-b border-ink/10 pb-2.5 text-ink/85">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-coral" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
