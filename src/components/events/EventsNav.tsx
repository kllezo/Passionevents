"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { brand } from "@/content/media";
import { categories } from "@/content/events";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { usePathnameState } from "@/components/shared/PathnameSync";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { useLenis } from "@/motion/SmoothScroll";
import { EventsButton } from "./Button";
import { SprigGroup } from "./botanical/Sprig";
import { buildSprig } from "./botanical/geometry";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services", menu: true },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/concerts", label: "Concerts", live: true },
  { href: "/contact", label: "Contact" },
];

const menuSprig = buildSprig({
  p0: { x: 20, y: 580 },
  p1: { x: 120, y: 380 },
  p2: { x: 60, y: 200 },
  p3: { x: 220, y: 30 },
  seed: 11,
  leafCount: 12,
  bloomCount: 6,
  scale: 1.1,
});

export function EventsNav() {
  const [pathnameRaw, pathnameSync] = usePathnameState();
  const pathname = pathnameRaw ?? "";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const lenis = useLenis();
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Hide on scroll down, reveal on scroll up; solid background after the hero.
  useEffect(() => {
    let last = window.scrollY;
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Over a dark full-bleed hero? Switch the bar to ivory type.
      const hit = document.elementsFromPoint(window.innerWidth / 2, 48).find((el) => el.closest("[data-nav-theme='dark']"));
      setOnDark(Boolean(hit));
      if (y > 400 && y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    handler();
    const t = window.setTimeout(handler, 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", handler);
    };
  }, [pathname]);

  // Close menus on route change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route change resets menu state
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Full-screen menu timeline.
  useGSAP(
    () => {
      const el = menuRef.current!;
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        tl.current = gsap
          .timeline({ paused: true })
          .set(el, { display: "flex" })
          .fromTo(el, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "power4.inOut" })
          .from(el.querySelectorAll("[data-menu-link]"), { yPercent: 110, rotate: 3, duration: 1, stagger: 0.06, ease: "expo.out" }, 0.35)
          .from(el.querySelectorAll(".bt-stem, .bt-twig"), { drawSVG: "0%", duration: 1.4, ease: "power2.out" }, 0.3)
          .from(el.querySelectorAll(".bt-leaf, .bt-bloom"), { scale: 0, transformOrigin: "0% 50%", duration: 0.8, stagger: 0.03, ease: "back.out(2)" }, 0.6)
          .from(el.querySelectorAll("[data-menu-meta]"), { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.05 }, 0.7);
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
      document.body.style.overflow = "hidden";
    } else {
      if (tl.current.progress() > 0) tl.current.timeScale(1.8).reverse();
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      // Route hidden/unmounted while the menu was open: never leave scrolling locked.
      if (open) {
        lenis?.start();
        document.body.style.overflow = "";
      }
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {pathnameSync}
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-[transform,background-color,box-shadow] duration-700 ease-[var(--ease-silk)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled && !open ? "bg-ivory/80 shadow-[0_1px_0_rgb(23_19_17/0.06)] backdrop-blur-md" : "bg-transparent"} ${onDark && !scrolled && !open ? "text-ivory" : "text-ink"}`}
      >
        <nav aria-label="Main" className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:h-24 md:px-10">
          <Link
            href="/"
            className={`relative z-[95] flex items-center gap-3 rounded-full transition-colors duration-500 ${onDark && !scrolled && !open ? "bg-ivory/90 p-1" : ""}`}
            aria-label="Passion Events — home"
          >
            <Image
              src={brand.logoSmall.src}
              alt="Passion Events"
              width={brand.logoSmall.width}
              height={brand.logoSmall.height}
              className={`h-auto transition-[width,transform] duration-700 ease-[var(--ease-silk)] ${scrolled ? "w-[64px] md:w-[74px]" : "w-[78px] md:w-[118px] md:translate-y-3"}`}
              preload
            />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li
                key={l.href}
                className="relative"
                onMouseEnter={() => l.menu && setServicesOpen(true)}
                onMouseLeave={() => l.menu && setServicesOpen(false)}
              >
                {l.live ? (
                  <UniverseLink
                    href={l.href}
                    to="live"
                    className="group flex items-center gap-2 px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.2em]"
                  >
                    <span className="relative size-1.5 rounded-full bg-coral">
                      <span className="absolute inset-0 animate-ping rounded-full bg-coral/60" />
                    </span>
                    <span className="link-underline">{l.label}</span>
                  </UniverseLink>
                ) : (
                  <div className="flex items-center">
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className="link-underline px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.2em]"
                    >
                      {l.label}
                    </Link>
                    {l.menu && (
                      <button
                        type="button"
                        aria-expanded={servicesOpen}
                        aria-controls="services-menu"
                        aria-label="Show event categories"
                        onClick={() => setServicesOpen((v) => !v)}
                        className="-ml-3 p-1.5 opacity-70"
                      >
                        <ChevronDown className={`size-3.5 transition-transform duration-500 ${servicesOpen ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                )}
                {l.menu && (
                  <div
                    id="services-menu"
                    className={`absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-4 transition-all duration-500 ease-[var(--ease-silk)] ${
                      servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-1 rounded-3xl border border-rose/20 bg-ivory/95 p-3 shadow-[0_30px_80px_-30px_rgb(23_19_17/0.35)] backdrop-blur-xl">
                      {categories.map((c) => {
                        const isLive = c.key === "concerts";
                        const body = (
                          <>
                            <span className="font-serif text-sm italic text-rose">{c.index}</span>
                            <span>
                              <span className="block font-serif text-xl leading-tight text-ink">{c.title}</span>
                              <span className="mt-1 block text-xs leading-snug text-stone">{c.short}</span>
                            </span>
                          </>
                        );
                        const cls = "flex gap-3 rounded-2xl p-3 transition-colors hover:bg-cream";
                        return (
                          <div key={c.key}>
                            {isLive ? (
                              <UniverseLink href={c.href} to="live" className={cls}>
                                {body}
                              </UniverseLink>
                            ) : (
                              <Link href={c.href} className={cls}>
                                {body}
                              </Link>
                            )}
                          </div>
                        );
                      })}
                      <Link href="/services" className="col-span-2 mt-1 rounded-2xl bg-ink px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
                        All individual services
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <EventsButton href="/contact#enquire" variant={onDark && !scrolled ? "ivory" : "solid"}>
                Plan your event
              </EventsButton>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative z-[95] flex size-12 items-center justify-center rounded-full border border-ink/15 bg-ivory/70 backdrop-blur lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-px w-5 bg-ink transition-transform duration-500 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-5 bg-ink transition-transform duration-500 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile / tablet full-screen menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        className="paper-grain fixed inset-0 z-[85] hidden flex-col justify-between overflow-y-auto bg-cream px-6 pb-10 pt-28 lg:hidden"
      >
        <svg viewBox="0 0 260 600" className="pointer-events-none absolute -right-6 bottom-0 h-[70%] w-auto opacity-90" aria-hidden="true">
          <SprigGroup g={menuSprig} strokeWidth={1.6} />
        </svg>
        <ul className="relative space-y-1">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <div data-menu-link="">
                {l.live ? (
                  <UniverseLink href={l.href} to="live" className="flex items-baseline gap-4 py-1 font-serif text-[clamp(2.6rem,11vw,4.5rem)] leading-[1.05] text-ink" onClick={() => setOpen(false)}>
                    <span className="font-sans text-xs tracking-[0.2em] text-rose">0{i + 1}</span>
                    {l.label}
                    <span className="font-sans text-[0.65rem] uppercase tracking-[0.25em] text-coral-deep">Passion Live</span>
                  </UniverseLink>
                ) : (
                  <Link href={l.href} className="flex items-baseline gap-4 py-1 font-serif text-[clamp(2.6rem,11vw,4.5rem)] leading-[1.05] text-ink">
                    <span className="font-sans text-xs tracking-[0.2em] text-rose">0{i + 1}</span>
                    <span className={isActive(l.href) ? "italic text-rose-deep" : ""}>{l.label}</span>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="relative mt-10 space-y-6">
          <div data-menu-meta="" className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.key !== "concerts")
              .map((c) => (
                <Link key={c.key} href={c.href} className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium text-ink/80">
                  {c.title}
                </Link>
              ))}
          </div>
          <div data-menu-meta="">
            <Link href="/contact#enquire" className="inline-flex rounded-full bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
              Plan your event
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
