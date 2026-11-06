import Image from "next/image";
import { Pic } from "@/components/shared/Pic";
import type { ReactNode } from "react";
import type { SiteImage } from "@/content/media";
import { ImageReveal, Parallax } from "@/motion/primitives";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "./SectionLabel";
import { SprigGroup } from "./botanical/Sprig";
import { buildSprig } from "./botanical/geometry";

const sprig = buildSprig({
  p0: { x: 20, y: 380 },
  p1: { x: 110, y: 260 },
  p2: { x: 60, y: 120 },
  p3: { x: 220, y: 20 },
  seed: 5,
  leafCount: 11,
  bloomCount: 5,
});

/**
 * Inner-page hero. Two compositions: "split" (copy + arched photograph with a
 * floating secondary image) and "full" (cinematic full-bleed photograph).
 */
export function PageHero({
  eyebrow,
  index,
  title,
  intro,
  image,
  secondary,
  script,
  variant = "split",
  children,
}: {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  image: SiteImage;
  secondary?: SiteImage;
  script?: string;
  variant?: "split" | "full";
  children?: ReactNode;
}) {
  if (variant === "full") {
    return (
      <section data-nav-theme="dark" className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink pb-16 pt-32 text-ivory md:pb-24">
        <ImageReveal shape="center" immediate className="!absolute inset-0" parallax={8}>
          <Pic image={image} preload sizes="100vw" className="" quality={85} />
        </ImageReveal>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/20" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
          <SectionLabel index={index} tone="ivory">
            {eyebrow}
          </SectionLabel>
          <RevealText as="h1" trigger="mount" delay={0.4} className="mt-8 max-w-5xl font-serif text-[clamp(3.2rem,8.5vw,9rem)] font-light leading-[0.9] tracking-[-0.02em]">
            {title}
          </RevealText>
          {script && <p className="mt-2 font-script text-6xl text-blush md:text-8xl">{script}</p>}
          {intro && <div className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/80 md:text-xl">{intro}</div>}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className="paper-grain relative overflow-hidden bg-ivory pb-20 pt-36 md:pb-28 md:pt-44">
      <div className="pointer-events-none absolute -left-32 top-10 size-[520px] rounded-full bg-blush/30 blur-[110px]" />
      <div className="relative mx-auto grid max-w-[1600px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <SectionLabel index={index}>{eyebrow}</SectionLabel>
          <RevealText as="h1" trigger="mount" delay={0.15} className="mt-8 font-serif text-[clamp(3.2rem,8vw,8.4rem)] font-light leading-[0.9] tracking-[-0.02em] text-ink">
            {title}
          </RevealText>
          {script && <p className="-mt-2 pl-[0.4em] font-script text-6xl text-coral md:text-8xl">{script}</p>}
          {intro && <div className="mt-8 max-w-xl text-lg leading-relaxed text-stone md:text-xl">{intro}</div>}
          {children}
        </div>
        <div className="relative lg:col-span-5">
          <ImageReveal shape="arch" immediate delay={0.2} parallax={6} className="arch ml-auto aspect-[4/5] w-[86%] bg-cream">
            <Pic image={image} preload sizes="(max-width: 1024px) 80vw, 36vw" className="" quality={85} />
          </ImageReveal>
          {secondary && (
            <Parallax speed={20} className="absolute -bottom-8 left-0 w-[42%]">
              <ImageReveal shape="up" immediate delay={0.6} className="aspect-square w-full rounded-full border-[6px] border-ivory shadow-2xl">
                <Pic image={secondary} sizes="240px" className="" />
              </ImageReveal>
            </Parallax>
          )}
          <svg viewBox="0 0 240 400" className="pointer-events-none absolute -right-6 -top-10 h-56 w-auto opacity-90" aria-hidden="true">
            <SprigGroup g={sprig} strokeWidth={1.3} />
          </svg>
        </div>
      </div>
    </section>
  );
}
