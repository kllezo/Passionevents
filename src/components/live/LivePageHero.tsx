import { Pic } from "@/components/shared/Pic";
import type { ReactNode } from "react";
import type { SiteImage } from "@/content/media";
import { RevealText } from "@/motion/RevealText";
import { StageCanvas } from "./StageCanvas";

export function LivePageHero({ eyebrow, title, intro, image }: { eyebrow: string; title: ReactNode; intro?: ReactNode; image?: SiteImage }) {
  return (
    <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-void pb-16 pt-36 md:pb-24">
      {image && (
        <div className="absolute inset-y-0 right-0 w-full md:w-[55%]" style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }}>
          <Pic image={image} preload sizes="(max-width: 768px) 100vw, 55vw" className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-void via-void/40 to-transparent" />
          <div className="scanlines absolute inset-0" />
        </div>
      )}
      <StageCanvas className="absolute inset-0 h-full w-full" beams={3} intensity={0.8} />
      <div className="relative mx-auto w-full max-w-[1700px] px-5 md:px-10">
        <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-volt">{eyebrow}</p>
        <RevealText as="h1" trigger="mount" flavor="live" split="chars" delay={0.1} className="mt-6 max-w-6xl font-display text-[clamp(3.4rem,11vw,12rem)] uppercase leading-[0.84] text-white">
          {title}
        </RevealText>
        {intro && <div className="mt-8 max-w-xl font-grotesk text-lg leading-relaxed text-fog">{intro}</div>}
      </div>
    </section>
  );
}
