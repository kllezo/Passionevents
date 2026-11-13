import type { ReactNode } from "react";
import { RevealText } from "@/motion/RevealText";
import { ScrambleLabel } from "./LiveMotion";

export function LiveSectionHead({
  index,
  eyebrow,
  title,
  aside,
  id,
  tone = "text-volt",
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
  id?: string;
  tone?: string;
}) {
  return (
    <div className="mx-auto mb-14 grid max-w-[1700px] gap-8 px-5 md:grid-cols-12 md:items-end md:px-10">
      <div className="md:col-span-8">
        <p className={`font-grotesk text-[0.72rem] uppercase tracking-[0.4em] ${tone}`}>
          <ScrambleLabel>{`${index ? `(${index}) ` : ""}${eyebrow}`}</ScrambleLabel>
        </p>
        <RevealText as="h2" id={id} flavor="live" split="chars" className="mt-6 font-display text-[clamp(3rem,6.4vw,6.9rem)] uppercase leading-[0.86] text-white">
          {title}
        </RevealText>
      </div>
      {aside && <div className="text-fog md:col-span-4 md:justify-self-end">{aside}</div>}
    </div>
  );
}
