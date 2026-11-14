"use client";

import { useEffect, useRef } from "react";

export type LoopCtx = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  t: number; // seconds
  dt: number;
  pointer: { x: number; y: number; active: boolean };
  mobile: boolean;
};

/**
 * Canvas render loop that only runs while the canvas is on screen and the tab
 * is visible, caps device pixel ratio, and renders a single still frame for
 * reduced-motion users.
 */
export function useCanvasLoop(draw: (c: LoopCtx) => void, opts: { maxDpr?: number; trackPointer?: boolean } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    // Touch screens: soft-light canvases (maxDpr <= 1) draw at half resolution
    // and 30 fps — indistinguishable for haze and beams, far lighter on iOS.
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const soft = touch && (opts.maxDpr ?? 2) <= 1;
    const dpr = soft ? 0.5 : Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? (mobile ? 1.25 : 1.6));
    let skip = false;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = false;
    let last = performance.now();
    const start = last;
    const pointer = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced || !running) frame(performance.now(), true);
    };

    const frame = (now: number, once = false) => {
      if (soft && !once && running) {
        skip = !skip;
        if (skip) {
          raf = requestAnimationFrame((n) => frame(n));
          return;
        }
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      drawRef.current({ ctx, w, h, t: (now - start) / 1000, dt, pointer, mobile });
      if (!once && running) raf = requestAnimationFrame((n) => frame(n));
    };

    const play = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame((n) => frame(n));
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && !document.hidden ? play() : pause());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    if (opts.trackPointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    resize();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [opts.maxDpr, opts.trackPointer]);

  return ref;
}
