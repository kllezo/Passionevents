"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { usePathnameState } from "@/components/shared/PathnameSync";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Wait until the page's real layout exists (load, fonts, and no new scroll
 * triggers for ~250 ms), re-measure every trigger, then go to `y`.
 */
async function settleAndScroll(y: number, lenis: () => Lenis | null, cancelled: () => boolean) {
  if (document.readyState !== "complete") await new Promise((r) => window.addEventListener("load", r, { once: true }));
  await (document.fonts?.ready ?? Promise.resolve()).catch(() => {});
  let stable = 0;
  let count = -1;
  for (let i = 0; i < 40 && stable < 5; i++) {
    await new Promise((r) => setTimeout(r, 50));
    const n = ScrollTrigger.getAll().length;
    stable = n === count ? stable + 1 : 0;
    count = n;
  }
  if (cancelled()) return;
  ScrollTrigger.refresh();
  window.scrollTo(0, y);
  lenis()?.scrollTo(y, { immediate: true, force: true });
  ScrollTrigger.update();
  requestAnimationFrame(() => document.documentElement.classList.remove("pe-restore"));
}
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
  // Last scroll position of each page this visit, for Back / Forward.
  const positions = useRef(new Map<string, number>());
  const popped = useRef(false);
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
    // (The opening sequence holds the page itself without stopping Lenis: a stopped
    // Lenis hides the scrollbar, which would shift the layout sideways.)
    return () => {
      window.removeEventListener("pe:lock-scroll", lock);
      window.removeEventListener("pe:unlock-scroll", unlock);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [isAdmin]);

  // Scroll restoration we control (the browser's restores before pinned
  // sections exist, which lands on the wrong section). Save the position when
  // leaving; on reload / back-forward, wait for fonts and the pinned layout,
  // re-measure every trigger, then return to the saved position.
  useEffect(() => {
    const root = document.documentElement;
    const save = () => {
      try {
        sessionStorage.setItem(`pe-scroll:${location.pathname}`, String(Math.round(window.scrollY)));
      } catch {}
    };
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) ScrollTrigger.refresh(); // back-forward cache
    };
    window.addEventListener("pagehide", save);
    window.addEventListener("pageshow", onShow);
    let cancelled = false;
    if (root.classList.contains("pe-restore")) {
      const y = Number((window as unknown as { __peRestoreY?: number }).__peRestoreY) || 0;
      void settleAndScroll(y, () => lenisRef.current, () => cancelled);
    }
    // In-site Back / Forward: remember positions per page while scrolling
    // (only while the URL still belongs to the page being scrolled), and hide
    // the page the moment the history entry changes so the restore is unseen.
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const path = lastPath.current;
        if (path && path === location.pathname) positions.current.set(path, Math.round(window.scrollY));
      });
    };
    const onPop = () => {
      if (location.pathname === lastPath.current) return; // same page (e.g. a #hash step)
      popped.current = true;
      if (!location.hash && (positions.current.get(location.pathname) ?? 0) > 0) root.classList.add("pe-restore");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  // Hydrated: switch off the CSS failsafes so they never fight live animations.
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
  }, []);

  // Keep every ScrollTrigger measured against the real layout. Positions go
  // stale when the page width changes without a window resize (the scrollbar
  // returns after the opening sequence), when web fonts swap in and re-wrap
  // text, or when late content changes the page height. Re-measure then.
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    let lastW = root.clientWidth;
    let lastH = document.body.scrollHeight;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        lastW = root.clientWidth;
        lastH = document.body.scrollHeight;
      }, 180);
    };
    const ro = new ResizeObserver(() => {
      if (root.clientWidth !== lastW) return refresh();
      if (Math.abs(document.body.scrollHeight - lastH) > 40) refresh();
    });
    ro.observe(document.body);
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("pe:unlock-scroll", refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("pe:unlock-scroll", refresh);
      window.removeEventListener("load", refresh);
    };
  }, []);

  // New route: start at the top and re-measure every trigger. Arriving by
  // Back / Forward instead returns to where that page was left.
  useEffect(() => {
    if (pathname === null) return;
    const previous = lastPath.current;
    lastPath.current = pathname;
    const fromHistory = popped.current;
    popped.current = false;
    if (previous === null || previous === pathname) return; // first load or same route
    const saved = positions.current.get(pathname) ?? 0;
    if (fromHistory && saved > 0 && !window.location.hash) {
      let cancelled = false;
      void settleAndScroll(saved, () => lenisRef.current, () => cancelled);
      return () => {
        cancelled = true;
        document.documentElement.classList.remove("pe-restore");
      };
    }
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
