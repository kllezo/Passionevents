import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "solid" | "outline" | "ghost" | "ivory";

const styles: Record<Variant, string> = {
  solid: "bg-ink text-ivory hover:bg-forest",
  outline: "border border-ink/25 text-ink hover:border-ink",
  ghost: "text-ink",
  ivory: "bg-ivory text-ink hover:bg-blush",
};

/**
 * Editorial pill CTA: label rolls upward on hover, arrow tilts.
 */
export function EventsButton({
  href,
  children,
  variant = "solid",
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-700 ease-[var(--ease-silk)] group-hover:-translate-y-full">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-700 ease-[var(--ease-silk)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      <span className="grid size-7 place-items-center rounded-full border border-current/30 transition-transform duration-700 ease-[var(--ease-silk)] group-hover:rotate-45">
        <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
      </span>
    </>
  );
  const cls = `group inline-flex max-w-full items-center gap-4 whitespace-normal rounded-full sm:whitespace-nowrap py-2.5 pl-7 pr-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${styles[variant]} ${className ?? ""}`;
  return (
    <>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      )}
    </>
  );
}
