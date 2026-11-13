"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/media";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { usePathnameState } from "@/components/shared/PathnameSync";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { useLenis } from "@/motion/SmoothScroll";
import { LiveWordmark } from "./LiveWordmark";
import { SoundToggle } from "./LiveSound";

const links = [
  { href: "/concerts", label: "Live" },
  { href: "/concerts/events", label: "Shows" },
  { href: "/concerts/about", label: "About" },
  { href: "/concerts/partners", label: "Partners" },
];

/**
 * One cohesive white pill back to Passion Events: the original logo, the
 * words, and an arrow that nudges forward on hover while a light sweeps across.
 */
export function ReturnLink({ className, onClick, compact = false }: { className?: string; onClick?: () => void; compact?: boolean }) {
  return (
    <UniverseLink
      href="/"
      to="events"
      onClick={onClick}
      className={`group relative inline-flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-white text-black shadow-[0_10px_40px_-12px_rgb(255_255_255/0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_14px_50px_-8px_rgb(235_195_200/0.75)] active:scale-[0.98] ${
        compact ? "h-11" : "h-12"
      } py-1 pl-1.5 pr-1.5 ${className ?? ""}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] -skew-x-12 bg-gradient-to-r from-transparent via-[#f6e4e2] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[360%]" />
      <span className="relative block size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 transition-transform duration-700 ease-out group-hover:rotate-[20deg]">
        <Image src={brand.mark.src} alt="Passion Events floral logo mark" width={72} height={72} className="size-full object-cover" />
      </span>
      <span className="relative font-grotesk text-[0.7rem] font-semibold uppercase tracking-[0.2em]">Return to Passion Events</span>
      <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-black text-white transition-transform duration-500 ease-out group-hover:translate-x-0.5">
        <ArrowUpRight className="size-4 transition-transform duration-500 ease-out group-hover:rotate-45" />
      </span>
    </UniverseLink>
  );
}

export function LiveNav() {
  const [pathnameRaw, pathnameSync] = usePathnameState();
  const pathname = pathnameRaw ?? "";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route change closes the menu
    setOpen(false);
  }, [pathname]);

  useGSAP(
    () => {
      const el = menuRef.current!;
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        tl.current = gsap
          .timeline({ paused: true })
          .set(el, { display: "flex" })
          .fromTo(el, { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.55, ease: "expo.inOut" })
          .from(el.querySelectorAll("[data-ml]"), { xPercent: -110, skewX: -12, duration: 0.6, stagger: 0.05, ease: "expo.out" }, 0.25)
          .from(el.querySelectorAll("[data-mm]"), { autoAlpha: 0, duration: 0.4 }, 0.5);
      });
      mm.add(media.reduced, () => {
        tl.current = gsap.timeline({ paused: true }).set(el, { display: "flex" });
      });
    },
    { scope: menuRef }
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      lenis?.stop();
    } else {
      if (tl.current.progress() > 0) tl.current.timeScale(2).reverse();
      lenis?.start();
    }
    return () => {
      if (open) lenis?.start();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (href: string) => (href === "/concerts" ? pathname === "/concerts" : pathname.startsWith(href));

  return (
    <>
      {pathnameSync}
      <header className={`fixed inset-x-0 top-0 z-[90] transition-colors duration-500 ${scrolled && !open ? "bg-void/70 backdrop-blur-md" : "bg-transparent"}`}>
        <nav aria-label="Passion Live" className="mx-auto flex h-20 max-w-[1700px] items-center justify-between gap-6 px-5 md:px-10">
          <Link href="/concerts" className="relative z-[95] text-2xl text-white md:text-[1.7rem]" aria-label="Passion Live home">
            <LiveWordmark />
          </Link>
          <ul className="hidden items-center gap-1 xl:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active(l.href) ? "page" : undefined}
                  className="glitch relative block px-4 py-2 font-grotesk text-[0.78rem] uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white aria-[current=page]:text-white"
                  data-text={l.label}
                >
                  {l.label}
                  <span className={`absolute inset-x-4 -bottom-0.5 h-[2px] origin-left bg-volt transition-transform duration-300 ${active(l.href) ? "scale-x-100" : "scale-x-0"}`} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <span className="hidden md:block">
              <SoundToggle />
            </span>
            <span className="md:hidden">
              <SoundToggle compact />
            </span>
            <span className="hidden lg:block">
              <ReturnLink />
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="live-menu"
              className="relative z-[95] flex h-11 items-center gap-3 rounded-full border border-white/20 px-4 font-grotesk text-[0.7rem] uppercase tracking-[0.22em] text-white xl:hidden max-sm:px-3"
            >
              {open ? "Close" : "Menu"}
              <span className="flex flex-col gap-1" aria-hidden="true">
                <span className={`block h-px w-4 bg-volt transition-transform ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
                <span className={`block h-px w-4 bg-volt transition-transform ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={menuRef}
        id="live-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Passion Live menu"
        inert={!open}
        className="live-grid-bg fixed inset-0 z-[85] hidden flex-col justify-between overflow-y-auto bg-void px-5 pb-10 pt-28 xl:hidden"
      >
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <Link href={l.href} data-ml="" className="flex items-baseline gap-4 font-display text-[clamp(3.4rem,17vw,7rem)] uppercase leading-[0.95] text-white">
                <span className="font-grotesk text-sm text-volt">0{i + 1}</span>
                <span className={active(l.href) ? "text-volt" : ""}>{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div data-mm="" className="mt-10 flex flex-col gap-6">
          <SoundToggle className="self-start" />
          <ReturnLink onClick={() => setOpen(false)} className="self-start" />
        </div>
      </div>
    </>
  );
}
