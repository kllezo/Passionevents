import { whyUs } from "@/content/events";
import { RevealText } from "@/motion/RevealText";
import { StaggerList } from "@/motion/StaggerList";
import { SectionLabel } from "../SectionLabel";
import { Bloom } from "../botanical/Sprig";

export function WhyUs({ index = "08" }: { index?: string }) {
  return (
    <section className="relative overflow-hidden bg-forest py-28 text-ivory md:py-40" aria-labelledby="why-title">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-mint/15 blur-[120px]" />
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index={index} tone="ivory">
              Why Passion Events
            </SectionLabel>
            <RevealText as="h2" id="why-title" className="mt-8 font-serif text-[clamp(2.8rem,5.6vw,6rem)] font-light leading-[0.95] text-ivory">
              Care you can <em className="text-blush">feel</em> in every room.
            </RevealText>
          </div>
          <StaggerList mobileOnly className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-ivory/15 lg:col-span-7">
            {whyUs.map((w, i) => (
              <li key={w.title} className={`group relative bg-forest p-5 transition-colors duration-700 hover:bg-[#2a5347] sm:p-8 md:p-10 ${i === whyUs.length - 1 ? "col-span-2" : ""}`}>
                <span className="font-serif text-sm italic text-blush">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-serif text-[1.35rem] leading-tight sm:mt-4 sm:text-3xl">{w.title}</h3>
                <p className="mt-2 text-[0.85rem] leading-snug text-ivory/70 sm:mt-3 sm:text-base sm:leading-normal">{w.text}</p>
                <svg viewBox="-20 -20 40 40" className="absolute right-4 top-4 size-6 scale-0 opacity-0 transition-all duration-700 ease-[var(--ease-silk)] group-hover:rotate-90 group-hover:scale-100 group-hover:opacity-100 max-sm:scale-100 max-sm:opacity-70 sm:right-6 sm:top-6 sm:size-9" aria-hidden="true">
                  <Bloom r={14} />
                </svg>
              </li>
            ))}
          </StaggerList>
        </div>
      </div>
    </section>
  );
}
