import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "@/motion/primitives";

/** Percussive CTA: neon fill wipes in from the left, label glitches. */
export function LiveButton({
  href,
  children,
  variant = "solid",
  className,
  external,
  cursor = "Go",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
  external?: boolean;
  cursor?: string;
}) {
  const cls = `group relative inline-flex items-center gap-3 overflow-hidden px-7 py-4 font-grotesk text-[0.78rem] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
    variant === "solid" ? "bg-volt text-black" : "border border-white/25 text-white hover:border-volt hover:text-black"
  } ${className ?? ""}`;
  const inner = (
    <>
      <span
        className={`absolute inset-0 -translate-x-[101%] transition-transform duration-500 ease-[var(--ease-snap)] group-hover:translate-x-0 ${variant === "solid" ? "bg-white" : "bg-volt"}`}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
      <span className="relative inline-block transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">
        ↗
      </span>
    </>
  );
  return (
    <Magnetic strength={0.25}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} data-cursor={cursor} style={{ clipPath: "polygon(0 0, 100% 0, 100% 72%, 92% 100%, 0 100%)" }}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls} data-cursor={cursor} style={{ clipPath: "polygon(0 0, 100% 0, 100% 72%, 92% 100%, 0 100%)" }}>
          {inner}
        </Link>
      )}
    </Magnetic>
  );
}
