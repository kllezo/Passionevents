"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, media } from "@/motion/gsap";

/**
 * Desktop-only editorial cursor: a fine dot plus a rose ring that lags behind.
 * Over [data-cursor] elements the ring blooms and shows a contextual label;
 * over [data-cursor-image] it carries a small floating photograph.
 */
export function EventsCursor({ variant = "events" }: { variant?: "events" | "live" }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(media.finePointer);
    const rm = window.matchMedia(media.reduced);
    const update = () => setEnabled(mq.matches && !rm.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    // Reference-count so overlapping universe layouts never leave two cursors.
    const count = Number(root.dataset.cursorCount ?? "0") + 1;
    root.dataset.cursorCount = String(count);
    root.classList.add("has-custom-cursor");
    const d = dot.current!;
    const r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, [role='button'], input, textarea, select, label");
      if (!t) {
        gsap.to(r, { scale: 1, duration: 0.5, ease: "expo.out" });
        r.dataset.state = "";
        if (label.current) label.current.textContent = "";
        return;
      }
      const isField = t.matches("input, textarea, select");
      const text = t.dataset.cursor ?? "";
      if (isField) {
        gsap.to(r, { scale: 0.4, duration: 0.4 });
        r.dataset.state = "field";
      } else if (text) {
        gsap.to(r, { scale: 2.6, duration: 0.6, ease: "expo.out" });
        r.dataset.state = "label";
        if (label.current) label.current.textContent = text;
      } else {
        gsap.to(r, { scale: 1.7, duration: 0.6, ease: "expo.out" });
        r.dataset.state = "link";
        if (label.current) label.current.textContent = "";
      }
    };
    const leaveWindow = () => {
      shown = false;
      gsap.to([d, r], { autoAlpha: 0, duration: 0.3 });
    };
    const down = () => gsap.to(r, { scale: "-=0.25", duration: 0.2, yoyo: true, repeat: 1 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerleave", leaveWindow);
    return () => {
      const left = Math.max(0, Number(root.dataset.cursorCount ?? "1") - 1);
      root.dataset.cursorCount = String(left);
      if (left === 0) root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerleave", leaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  const live = variant === "live";
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[180]">
      <div
        ref={ring}
        className={`fixed left-0 top-0 grid size-10 place-items-center rounded-full border transition-colors duration-300 ${
          live
            ? "border-volt/80 mix-blend-screen data-[state=label]:bg-volt data-[state=label]:border-volt"
            : "border-rose/70 data-[state=label]:bg-ink data-[state=label]:border-ink data-[state=link]:bg-blush/30"
        }`}
      >
        <span
          ref={label}
          className={`scale-[0.38] whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] ${live ? "font-grotesk text-black" : "text-ivory"}`}
        />
      </div>
      <div ref={dot} className={`fixed left-0 top-0 size-1.5 rounded-full ${live ? "bg-volt" : "bg-coral"}`} />
    </div>
  );
}
