"use client";

import { useRef } from "react";
import { corporateRunSheet } from "@/content/categoryStories";
import { gsap, ScrollTrigger, useGSAP, media } from "@/motion/gsap";
import { SectionLabel } from "../SectionLabel";

/**
 * Corporate signature: a show-control room. As the reader scrolls, a big
 * clock rolls through an illustrative show day, each cue in the run sheet
 * goes live in turn (past cues tick off), and stage beams sweep the dark.
 */
export function CorporateRunSheet() {
  const root = useRef<HTMLElement>(null);
  const n = corporateRunSheet.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const rows = q<HTMLElement>("[data-cue]");
        const clock = q<HTMLElement>("[data-clock]")[0];
        let active = -1;
        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          rows.forEach((r, j) => {
            r.dataset.state = j < i ? "done" : j === i ? "live" : "next";
          });
          gsap.to(clock, { yPercent: (-100 / n) * i, duration: 0.7, ease: "expo.inOut", overwrite: true });
          gsap.fromTo(rows[i].querySelector("[data-cue-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out", overwrite: true });
        };
        setActive(0);

        gsap.to(q("[data-progress]"), {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: `+=${n * 45}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
          },
        });
        gsap.to(q("[data-beam]"), { rotate: (i) => (i % 2 ? -22 : 22), duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.8 });
      });
      mm.add(media.mobile, () => {
        const rows = q<HTMLElement>("[data-cue]");
        const clock = q<HTMLElement>("[data-m-clock]")[0];
        const setActive = (i: number) => {
          rows.forEach((r, j) => (r.dataset.state = j < i ? "done" : j === i ? "live" : "next"));
          gsap.to(clock, { yPercent: (-100 / n) * i, duration: 0.6, ease: "expo.inOut", overwrite: true });
        };
        setActive(0);
        rows.forEach((r, i) =>
          ScrollTrigger.create({ trigger: r, start: "top 62%", end: "bottom 62%", onToggle: (self) => self.isActive && setActive(i) })
        );
        gsap.to(q("[data-m-progress]"), { scaleX: 1, ease: "none", scrollTrigger: { trigger: q("[data-m-cues]")[0], start: "top 62%", end: "bottom 62%", scrub: true } });
        gsap.fromTo(rows, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.06, ease: "expo.out", clearProps: "opacity,visibility,transform", scrollTrigger: { trigger: q("[data-m-cues]")[0], start: "top 85%", once: true } });
      });
    },
    { scope: root, dependencies: [n] }
  );

  return (
    <section ref={root} className="relative bg-ink text-ivory" aria-labelledby="runsheet-title">
      <div data-pin="" className="relative overflow-clip lg:h-[100svh] lg:overflow-hidden">
        {/* stage beams */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {[18, 50, 82].map((x, i) => (
            <span
              key={x}
              data-beam=""
              className="absolute -top-10 h-[120%] w-[26vw] origin-top -translate-x-1/2 bg-[conic-gradient(from_172deg_at_50%_0%,transparent_0deg,rgb(235_195_200/0.16)_8deg,transparent_16deg)]"
              style={{ left: `${x}%`, rotate: `${i % 2 ? 14 : -14}deg` }}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgb(191_133_146/0.18),transparent_70%)]" />
        </div>

        <div className="relative mx-auto grid h-full max-w-[1600px] gap-12 px-5 py-24 md:px-10 lg:grid-cols-12 lg:items-center lg:py-0">
          <div className="lg:col-span-5">
            <SectionLabel tone="ivory">Show day, cue by cue</SectionLabel>
            <h2 id="runsheet-title" className="mt-6 font-serif text-[clamp(2.6rem,4.6vw,4.8rem)] font-light leading-[0.95]">
              Precise, <em className="text-blush">to the minute.</em>
            </h2>
            <div className="mt-10 hidden items-end gap-4 lg:flex" aria-hidden="true">
              <span className="block h-[1em] overflow-hidden font-serif text-[clamp(5rem,10vw,10rem)] font-light leading-none">
                <span data-clock="" className="block">
                  {corporateRunSheet.map((c) => (
                    <span key={c.time} className="block h-[1em]">
                      {c.time}
                    </span>
                  ))}
                </span>
              </span>
              <span className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-blush">
                <span className="size-2 animate-pulse rounded-full bg-coral" /> Live
              </span>
            </div>
            <p className="mt-8 max-w-sm text-ivory/60">An illustrative run sheet — every event gets its own, written with you and run by our team on the day.</p>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <span className="absolute -left-6 top-0 hidden h-full w-px bg-ivory/10 lg:block">
              <span data-progress="" className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-blush via-coral to-mint" />
            </span>
            {/* Phones: the show clock rides along at the top while the cues scroll beneath */}
            <div className="sticky top-3 z-10 -mx-2 mb-4 flex items-center justify-between rounded-2xl border border-ivory/10 bg-ink/85 px-5 py-3 backdrop-blur-md lg:hidden" aria-hidden="true">
              <span className="block h-[1.15em] overflow-hidden font-serif text-5xl font-light leading-[1.15]">
                <span data-m-clock="" className="block">
                  {corporateRunSheet.map((c) => (
                    <span key={c.time} className="block h-[1.15em]">
                      {c.time}
                    </span>
                  ))}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-blush">
                <span className="size-2 animate-pulse rounded-full bg-coral" /> Live
              </span>
              <span className="absolute inset-x-5 bottom-0 h-px overflow-hidden">
                <span data-m-progress="" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-blush via-coral to-mint" />
              </span>
            </div>
            <ol data-m-cues="" className="space-y-1">
              {corporateRunSheet.map((c) => (
                <li
                  key={c.time}
                  data-cue=""
                  data-state="next"
                  className="group relative grid grid-cols-[4.5rem_1fr] gap-x-5 overflow-hidden rounded-2xl px-5 py-4 transition-[background-color,opacity] duration-500 data-[state=done]:opacity-45 data-[state=live]:bg-ivory/[0.07] data-[state=next]:opacity-70"
                >
                  <span data-cue-bar="" className="absolute inset-y-0 left-0 w-1 origin-left bg-coral opacity-0 group-data-[state=live]:opacity-100" />
                  <span className="font-mono text-sm tabular-nums text-blush">{c.time}</span>
                  <span>
                    <span className="flex items-center gap-3 font-serif text-2xl md:text-3xl">
                      {c.title}
                      <span className="hidden text-sm text-mint group-data-[state=done]:inline" aria-hidden="true">
                        ✓
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-ivory/60">{c.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
