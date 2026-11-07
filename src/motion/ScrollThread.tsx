"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, media } from "./gsap";

/** Hairline reading-progress thread across the top of every Passion Events page. */
export function ScrollThread() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(media.ok, () => {
      const set = gsap.quickSetter(ref.current, "scaleX");
      const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => set(self.progress) });
      return () => st.kill();
    });
  });
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-gradient-to-r from-rose via-coral to-mint" />
    </div>
  );
}
