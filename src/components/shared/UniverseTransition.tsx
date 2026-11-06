"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathnameState } from "./PathnameSync";
import { createContext, useCallback, useContext, useEffect, useRef, type MouseEvent, type ReactNode, type ComponentProps } from "react";
import { gsap, prefersReducedMotion } from "@/motion/gsap";

type Universe = "events" | "live";
type Ctx = { go: (href: string, to: Universe, origin?: { x: number; y: number }) => void };
const TransitionContext = createContext<Ctx>({ go: () => {} });
export const useUniverseTransition = () => useContext(TransitionContext);

const N = 140;

/** Organic botanical curve ↔ concert waveform, blended by m (0..1). */
function linePoints(m: number, phase: number) {
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * 1000;
    const organic = 100 + 34 * Math.sin(x * 0.0065 + 0.6 + phase * 0.3) + 12 * Math.sin(x * 0.019 + 1.3);
    const env = Math.exp(-Math.pow((x - 500) / 230, 2));
    const wave = 100 + env * 78 * Math.sin(x * 0.11 + phase * 6) * Math.sin(x * 0.013 + phase);
    const y = organic * (1 - m) + wave * m;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

/**
 * Cinematic switch between the ivory Passion Events world and the dark
 * Passion Live world: the page floods from the click point, the floral line
 * becomes a soundwave (or back), a light sweep crosses, the destination's
 * name appears, the route changes and the curtain lifts. ~1.3s total.
 */
export function UniverseTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pathname, pathnameSync] = usePathnameState();
  const overlay = useRef<HTMLDivElement>(null);
  const flood = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPolylineElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const liveLabel = useRef<HTMLDivElement>(null);
  const eventsLabel = useRef<HTMLDivElement>(null);
  const pending = useRef<{ href: string; started: number } | null>(null);
  const busy = useRef(false);

  const go = useCallback<Ctx["go"]>(
    (href, to, origin) => {
      if (busy.current) return;
      const target = href.split("#")[0] || "/";
      if (target === window.location.pathname) return;
      busy.current = true;
      router.prefetch(href);
      const o = overlay.current!;
      const toLive = to === "live";
      const ox = origin?.x ?? window.innerWidth / 2;
      const oy = origin?.y ?? window.innerHeight / 2;
      const bg = toLive ? "#050508" : "#fef9ee";

      if (prefersReducedMotion()) {
        gsap.set(o, { autoAlpha: 0, display: "block" });
        gsap.set(flood.current, { clipPath: "none", background: bg });
        gsap.to(o, {
          autoAlpha: 1,
          duration: 0.2,
          onComplete: () => {
            pending.current = { href: target, started: performance.now() };
            router.push(href);
          },
        });
        return;
      }

      const state = { m: toLive ? 0 : 1, phase: 0 };
      const label = toLive ? liveLabel.current : eventsLabel.current;
      const other = toLive ? eventsLabel.current : liveLabel.current;
      gsap.set(o, { display: "block", autoAlpha: 1 });
      gsap.set(other, { autoAlpha: 0 });
      gsap.set(label, { autoAlpha: 0, y: 30, letterSpacing: toLive ? "0.6em" : "0.05em" });
      gsap.set(flood.current, { background: bg, clipPath: `circle(0% at ${ox}px ${oy}px)` });
      gsap.set(line.current, { attr: { points: linePoints(state.m, 0) }, stroke: toLive ? "#bf8592" : "#ff5a1f", autoAlpha: 0 });
      gsap.set(sweep.current, { xPercent: -160, autoAlpha: 1, background: toLive ? "linear-gradient(90deg, transparent, rgba(139,92,255,.0), rgba(255,90,31,.55), rgba(46,197,255,.35), transparent)" : "linear-gradient(90deg, transparent, rgba(235,195,200,.0), rgba(236,123,88,.35), rgba(166,214,199,.45), transparent)" });

      const tl = gsap.timeline();
      tl.to(flood.current, { clipPath: `circle(150% at ${ox}px ${oy}px)`, duration: 0.75, ease: "power4.inOut" })
        .to(line.current, { autoAlpha: 1, duration: 0.2 }, 0.2)
        .to(
          state,
          {
            m: toLive ? 1 : 0,
            phase: 1,
            duration: 0.75,
            ease: "power2.inOut",
            onUpdate: () => line.current?.setAttribute("points", linePoints(state.m, state.phase)),
          },
          0.25
        )
        .to(line.current, { stroke: toLive ? "#ff5a1f" : "#bf8592", duration: 0.6 }, 0.3)
        .to(sweep.current, { xPercent: 160, duration: 0.8, ease: "power2.inOut" }, 0.35)
        .to(label, { autoAlpha: 1, y: 0, letterSpacing: toLive ? "0.18em" : "0em", duration: 0.7, ease: "expo.out" }, 0.45)
        .add(() => {
          pending.current = { href: target, started: performance.now() };
          router.push(href);
        }, 0.7);
    },
    [router]
  );

  // Lift the curtain once the destination route is rendered.
  useEffect(() => {
    const p = pending.current;
    if (!p || pathname !== p.href) return;
    pending.current = null;
    const wait = Math.max(0, 900 - (performance.now() - p.started));
    const o = overlay.current!;
    gsap.to(o, {
      autoAlpha: 0,
      duration: prefersReducedMotion() ? 0.2 : 0.6,
      delay: prefersReducedMotion() ? 0 : wait / 1000,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(o, { display: "none" });
        busy.current = false;
      },
    });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ go }}>
      {pathnameSync}
      {children}
      <div ref={overlay} className="pointer-events-none fixed inset-0 z-[150] hidden" aria-hidden="true">
        <div ref={flood} className="absolute inset-0" />
        <svg className="absolute left-0 top-1/2 h-[30vh] w-full -translate-y-1/2" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <polyline ref={line} fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div ref={sweep} className="absolute inset-y-0 left-0 w-[60vw] -skew-x-12 blur-2xl" />
        <div ref={liveLabel} className="absolute inset-x-0 top-[62%] text-center font-display text-[clamp(2.5rem,8vw,7rem)] uppercase leading-none text-white neon-text-volt">
          Passion <span className="text-volt">Live</span>
        </div>
        <div ref={eventsLabel} className="absolute inset-x-0 top-[62%] text-center font-serif text-[clamp(2.5rem,7vw,6rem)] italic leading-none text-ink">
          Passion <span className="text-rose">Events</span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

/** A Link that crosses universes through the cinematic transition. */
export function UniverseLink({
  href,
  to,
  onClick,
  ...rest
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string; to: Universe }) {
  const { go } = useUniverseTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(href, to, { x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 });
  };
  return <Link href={href} onClick={handle} {...rest} />;
}

export function UniverseMarker({ value }: { value: "events" | "live" | "admin" }) {
  useEffect(() => {
    document.documentElement.dataset.universe = value;
  }, [value]);
  return null;
}
