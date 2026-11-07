"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { usePathnameState } from "@/components/shared/PathnameSync";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. Disabled for reduced motion, touch-first devices and admin.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [pathname, pathnameSync] = usePathnameState();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const isAdmin = pathname === null ? null : pathname.startsWith("/admin");
  const lastPath = useRef<string | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    if (isAdmin !== false || prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
    const tick = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expose the instance to consumers
    setLenis(instance);
    if (process.env.NODE_ENV === "development") (window as unknown as { __lenis?: Lenis }).__lenis = instance;
    // Overlays (opening sequence) can pause smooth scrolling.
    const lock = () => instance.stop();
    const unlock = () => instance.start();
    window.addEventListener("pe:lock-scroll", lock);
    window.addEventListener("pe:unlock-scroll", unlock);
    if (document.documentElement.classList.contains("intro-pending")) instance.stop();
    return () => {
      window.removeEventListener("pe:lock-scroll", lock);
      window.removeEventListener("pe:unlock-scroll", unlock);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [isAdmin]);

  // New route: start at the top and re-measure every trigger.
  useEffect(() => {
    if (pathname === null) return;
    const previous = lastPath.current;
    lastPath.current = pathname;
    if (previous === null || previous === pathname) return; // first load or same route
    if (!window.location.hash) {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenis}>
      {pathnameSync}
      {children}
    </LenisContext.Provider>
  );
}
