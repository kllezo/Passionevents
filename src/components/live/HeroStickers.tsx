"use client";

import { useRef } from "react";
import { gsap, Draggable, useGSAP, media } from "@/motion/gsap";

type Sticker = { text: string; cls: string; pos: string; rot: number; mobile?: boolean };

const stickers: Sticker[] = [
  { text: "● Live", cls: "bg-hot text-white", pos: "left-[5%] top-[15%] max-md:left-auto max-md:right-[6%] max-md:top-[13%]", rot: -8, mobile: true },
  { text: "No skips", cls: "bg-acid text-black", pos: "left-[38%] top-[15%]", rot: 6 },
  { text: "Front row energy", cls: "border-2 border-volt bg-void text-volt", pos: "left-[47%] top-[84%]", rot: -4 },
  { text: "Turn it up ↑", cls: "bg-laser text-black", pos: "right-[27%] top-[11%] max-md:right-auto max-md:left-[5%] max-md:top-[16%]", rot: 9, mobile: true },
  { text: "✦ Hyderabad · Bengaluru", cls: "bg-violet text-white", pos: "right-[3%] top-[26%]", rot: -6 },
];

/**
 * Neon stickers slapped across the concert hero. They bounce on after the
 * headline lands, wobble while idle, and can be dragged around (mouse or
 * touch) — and spring back when let go. Decorative only.
 */
export function HeroStickers() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const els = q<HTMLElement>("[data-sticker]");
        gsap.fromTo(
          els,
          { scale: 2.4, autoAlpha: 0, rotate: (i) => Number(els[i].dataset.rot) + (i % 2 ? 40 : -40) },
          { scale: 1, autoAlpha: 1, rotate: (i) => Number(els[i].dataset.rot), duration: 0.6, ease: "back.out(2.6)", stagger: 0.14, delay: 2.4 }
        );
        const wobble = els.map((el, i) =>
          gsap.to(el, { y: i % 2 ? -8 : 8, rotate: `+=${i % 2 ? 3 : -3}`, duration: 1.8 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3.2 + i * 0.2 })
        );
        const drags = Draggable.create(els, {
          type: "x,y",
          bounds: root.current,
          zIndexBoost: true,
          onPress() {
            wobble.forEach((w) => w.pause());
            gsap.to(this.target, { scale: 1.15, duration: 0.2 });
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", onComplete: () => wobble.forEach((w) => w.resume()) });
          },
        });
        return () => drags.forEach((d) => d.kill());
      });
      mm.add(media.reduced, () => gsap.set(q("[data-sticker]"), { autoAlpha: 1 }));
    },
    { scope: root }
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {stickers.map((s) => (
        <span
          key={s.text}
          data-sticker=""
          data-rot={s.rot}
          className={`pointer-events-auto absolute ${s.pos} ${s.mobile ? "" : "max-md:hidden"} invisible cursor-grab touch-none select-none rounded-full px-4 py-2 font-grotesk text-[0.68rem] font-bold uppercase tracking-[0.2em] shadow-[0_10px_30px_-8px_rgb(0_0_0/0.8)] active:cursor-grabbing md:text-xs ${s.cls}`}
          style={{ transform: `rotate(${s.rot}deg)` }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}
