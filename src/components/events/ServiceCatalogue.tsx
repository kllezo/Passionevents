import Link from "next/link";
import { cityProfiles } from "@/content/qa";
import { SectionLabel } from "./SectionLabel";

/**
 * The full list of what a service covers, plus the cities it is offered in
 * (each linking to that city's page). Plain, crawlable text.
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
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-rose-deep">Available in</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {cityProfiles.map((c) => (
              <li key={c.id}>
                <Link href={`/event-management/${c.id}`} className="inline-flex rounded-full border border-ink/15 bg-ivory px-4 py-1.5 text-sm text-ink transition-colors hover:border-rose hover:bg-ivory/60">
                  {`${title.split(" & ")[0]} in ${c.name}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
