"use client";

import { useRef } from "react";
import { Pic } from "@/components/shared/Pic";
import { stock, type SiteImage } from "@/content/media";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { EventsButton } from "../Button";

type Seg = string | { word: string; image: SiteImage; label: string };

/** The studio statement, with photographs that open inside the sentence. */
const statement: Seg[] = [
  "From concept to execution, Passion Events brings",
  { word: "people,", image: stock.weddingHands, label: "people" },
  { word: "creativity,", image: stock.florals, label: "creativity" },
  { word: "production", image: stock.stageDesign, label: "production" },
  "and",
  { word: "logistics", image: stock.venueHall, label: "logistics" },
  "together to create",
  { word: "memorable experiences", image: stock.ceremonyStage, label: "every detail" },
  "— weddings, corporate events, private celebrations and live concerts, planned and run by one team.",
];
const keys = statement.filter((s): s is Exclude<Seg, string> => typeof s !== "string");

type Token = { kind: "word"; text: string; accent: boolean } | { kind: "pill"; image: SiteImage; at: number };
/** Flattened words + capsules; `at` is the index of the word the capsule precedes. */
const tokens: Token[] = (() => {
  const out: Token[] = [];
  let n = 0;
  for (const seg of statement) {
    if (typeof seg === "string") {
      for (const w of seg.split(" ")) {
        out.push({ kind: "word", text: w, accent: false });
        n++;
      }
    } else {
      out.push({ kind: "pill", image: seg.image, at: n });
      for (const w of seg.word.split(" ")) {
        out.push({ kind: "word", text: w, accent: true });
        n++;
      }
    }
  }
  return out;
})();

/**
 * "The studio". As the reader scrolls, the statement fills in word by word;
 * at each key idea a photograph capsule opens inside the sentence while the
 * arch beside it wipes to that idea's image and the script caption changes.
 */
export function BrandIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const words = q<HTMLElement>("[data-w]");
        const pills = q<HTMLElement>("[data-pill]");
        const layers = q<HTMLElement>("[data-layer]");
        const captions = q<HTMLElement>("[data-caption]");
        const total = words.length;

        gsap.set(words, { opacity: 0.13 });
        gsap.set(pills, { width: 0, marginRight: 0 });
        gsap.set(layers.slice(1), { clipPath: "circle(0% at 50% 60%)" });
        gsap.set(captions, { yPercent: 110, autoAlpha: 0 });
        gsap.set(captions[0], { yPercent: 0, autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q("[data-statement]")[0], start: "top 72%", end: "bottom 40%", scrub: 0.8 },
        });
        tl.to(words, { opacity: 1, duration: 0.4, stagger: 1 / total }, 0);

        // Each key word: open its capsule, wipe the arch, swap the caption.
        pills.forEach((pill, k) => {
          const at = Number(pill.dataset.at) / total;
          tl.to(pill, { width: "1.9em", marginRight: "0.22em", duration: 0.5, ease: "power2.out" }, at);
          if (k > 0) {
            tl.fromTo(layers[k], { clipPath: "circle(0% at 50% 60%)" }, { clipPath: "circle(80% at 50% 60%)", duration: 0.9, ease: "power2.inOut" }, at)
              .to(captions[k - 1], { yPercent: -110, autoAlpha: 0, duration: 0.12 }, at)
              .to(captions[k], { yPercent: 0, autoAlpha: 1, duration: 0.2 }, at + 0.12);
          }
        });

        gsap.from(q("[data-arch-wrap]"), {
          clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)",
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q("[data-arch-wrap]")[0], start: "top 85%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ivory py-28 md:py-40" aria-labelledby="intro-title">
      <div className="pointer-events-none absolute -right-40 top-1/3 size-[560px] rounded-full bg-blush/30 blur-[120px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="01">The studio</SectionLabel>
            <h2 id="intro-title" className="sr-only">
              About Passion Events
            </h2>
            <p
              data-statement=""
              className="mt-10 font-serif text-[clamp(2rem,4vw,3.9rem)] font-light leading-[1.16] tracking-[-0.01em] text-ink"
            >
              {tokens.map((t, i) =>
                t.kind === "pill" ? (
                  <span
                    key={i}
                    data-pill=""
                    data-at={t.at}
                    aria-hidden="true"
                    className="relative mr-[0.22em] inline-block h-[0.78em] w-[1.9em] overflow-hidden rounded-full align-[-0.06em] shadow-[0_8px_20px_-10px_rgb(94_52_64/0.6)]"
                  >
                    <Pic image={t.image} alt="" sizes="120px" />
                  </span>
                ) : (
                  <span key={i} data-w="" className={t.accent ? "italic text-rose-deep" : undefined}>
                    {t.text}{" "}
                  </span>
                )
              )}
            </p>
            <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:gap-14">
              <RevealText as="p" className="max-w-md text-lg leading-relaxed text-stone">
                We are an event planning, production and execution partner. Book a single service, or hand us the whole event and we take it from the first call to the last guest leaving.
              </RevealText>
              <EventsButton href="/about" variant="outline">
                Our story
              </EventsButton>
            </div>
          </div>

          {/* Arch that changes with the idea being read */}
          <div className="relative lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div data-arch-wrap="" className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-t-full bg-cream shadow-[0_40px_90px_-45px_rgb(148_96_108/0.6)]">
                {keys.map((k, i) => (
                  <div key={k.label} data-layer="" className="absolute inset-0" style={{ zIndex: i }}>
                    <Pic image={k.image} sizes="(max-width: 1024px) 80vw, 32vw" />
                  </div>
                ))}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
              </div>
              <div className="relative mx-auto mt-6 h-[1.3em] max-w-[460px] overflow-hidden text-right font-script text-6xl leading-none text-coral md:text-7xl" aria-hidden="true">
                {keys.map((k, i) => (
                  <span key={k.label} data-caption="" className={`absolute inset-0 block pr-2 ${i === keys.length - 1 ? "" : "opacity-0"}`}>
                    {k.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
