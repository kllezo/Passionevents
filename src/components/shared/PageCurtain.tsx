"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/motion/gsap";

const titles: Record<string, string> = {
  "/": "Passion Events",
  "/about": "About",
  "/services": "Services",
  "/weddings": "Weddings",
  "/corporate-events": "Corporate Events",
  "/private-events": "Private Celebrations",
  "/destination-events": "Destination Events",
  "/event-production": "Event Production",
  "/portfolio": "Portfolio",
  "/founders": "The Founders",
  "/contact": "Contact",
};

/**
 * Page-to-page transition inside the Passion Events universe. On every route
 * change an ivory curtain — already covering on the first painted frame, so
 * the page swap is never seen — shows the new page's name and a blooming mark,
 * then lifts away on a curved edge. Lives in the layout (not a template), so a
 * page suspending while it loads can't cut it short. Skipped on first load
 * (the opening sequence handles that), on arrivals from Passion Live (the
 * universe transition covers those) and for reduced motion. Only the overlay
 * moves; page content is never transformed, so pinned sections measure right.
 */
function Watcher({ curtain }: { curtain: React.RefObject<HTMLDivElement | null> }) {
  const path = usePathname();
  const last = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = last.current;
    last.current = path;
    const el = curtain.current;
    if (!el || prev === null || prev === path) return;
    // Arriving from Passion Live: the universe transition is already covering the swap.
    if (prev.startsWith("/concerts") || document.documentElement.dataset.universe === "live" || prefersReducedMotion()) return;

    const label = el.querySelector<HTMLElement>("[data-curtain-title]");
    if (label) label.textContent = titles[path] ?? (path.startsWith("/portfolio/") ? "Portfolio" : "Passion Events");

    gsap.killTweensOf(el);
    const tl = gsap.timeline();
    tl.set(el, { display: "flex", yPercent: 0, borderBottomLeftRadius: "0% 0%", borderBottomRightRadius: "0% 0%" })
      .fromTo(el.querySelectorAll("[data-curtain-in]"), { yPercent: 0, autoAlpha: 1 }, { yPercent: -40, autoAlpha: 0, duration: 0.45, ease: "power2.in", stagger: 0.04 }, 0.35)
      .fromTo(el.querySelector("[data-curtain-mark]"), { rotate: 0, scale: 1 }, { rotate: 120, scale: 0.6, duration: 0.6, ease: "power2.in" }, 0.2)
      .to(el, { yPercent: -100, borderBottomLeftRadius: "50% 18%", borderBottomRightRadius: "50% 18%", duration: 0.9, ease: "power4.inOut" }, 0.45)
      .set(el, { display: "none" });
    // No cleanup on purpose: the next navigation simply restarts the curtain.
  }, [path, curtain]);

  return null;
}

export function PageCurtain() {
  const curtain = useRef<HTMLDivElement>(null);
  return (
    <>
      <Suspense fallback={null}>
        <Watcher curtain={curtain} />
      </Suspense>
      <div
        ref={curtain}
        aria-hidden="true"
        className="fixed inset-0 z-[90] hidden flex-col items-center justify-center gap-6 bg-ivory text-ink shadow-[0_30px_80px_-20px_rgb(94_52_64/0.35)]"
      >
        <svg data-curtain-mark="" viewBox="-20 -20 40 40" className="size-12 text-coral">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-8" rx="5" ry="8" fill="currentColor" transform={`rotate(${a})`} />
          ))}
          <circle r="3.4" fill="var(--color-magenta)" />
        </svg>
        <span className="overflow-hidden">
          <span data-curtain-in="" data-curtain-title="" className="block font-serif text-[clamp(2.4rem,4.8vw,4.3rem)] font-light italic">
            Passion Events
          </span>
        </span>
        <span data-curtain-in="" className="eyebrow text-rose-deep">
          Concept · Design · Production
        </span>
      </div>
    </>
  );
}
