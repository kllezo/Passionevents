"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP, media, whenVisible } from "./gsap";

/* ── Image reveal ─────────────────────────────────────────────────────────── */
type RevealShape = "up" | "down" | "left" | "center" | "arch";
const clipFrom: Record<RevealShape, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  center: "inset(45% 45% 45% 45%)",
  arch: "inset(100% 0% 0% 0% round 50% 50% 0 0)",
};
const clipTo: Record<RevealShape, string> = {
  up: "inset(0% 0% 0% 0%)",
  down: "inset(0% 0% 0% 0%)",
  left: "inset(0% 0% 0% 0%)",
  center: "inset(0% 0% 0% 0%)",
  arch: "inset(0% 0% 0% 0% round 50% 50% 0 0)",
};

/**
 * Editorial clip-path reveal with an inner counter-scale, plus optional
 * scrubbed parallax of the inner image. Children should be a fill image.
 */
export function ImageReveal({
  children,
  className,
  innerClassName,
  shape = "up",
  parallax = 0,
  delay = 0,
  style,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  shape?: RevealShape;
  parallax?: number;
  delay?: number;
  style?: CSSProperties;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const inner = el.querySelector<HTMLElement>("[data-inner]");
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tl = gsap.timeline({ delay, paused: !immediate });
        tl.fromTo(el, { clipPath: clipFrom[shape] }, { clipPath: clipTo[shape], duration: 1.6, ease: "expo.inOut" });
        if (inner) tl.from(inner, { scale: 1.35, duration: 2.1, ease: "expo.out" }, 0.1);
        const stopWatching = immediate ? () => {} : whenVisible(el, () => tl.play());
        if (parallax && inner) {
          gsap.fromTo(
            inner,
            { yPercent: -parallax },
            { yPercent: parallax, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
          );
        }
        return stopWatching;
      });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`} style={style}>
      {/* Extra bleed only when the image parallaxes, so static images keep their framing. */}
      <div data-inner className={`absolute ${parallax ? "inset-[-10%_0]" : "inset-0"} will-change-transform ${innerClassName ?? ""}`}>
        {children}
      </div>
    </div>
  );
}

/* ── Parallax ─────────────────────────────────────────────────────────────── */
export function Parallax({ children, speed = 15, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: speed },
          { yPercent: -speed, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={`will-change-transform ${className ?? ""}`}>
      {children}
    </div>
  );
}

/* ── Counter ──────────────────────────────────────────────────────────────── */
export function Counter({ to, suffix = "", className, duration = 2.4 }: { to: number; suffix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const obj = { v: 0 };
        el.textContent = `0${suffix}`;
        const tween = gsap.to(obj, {
          v: to,
          duration,
          ease: "expo.out",
          paused: true,
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
        const stop = whenVisible(el, () => tween.play());
        return () => {
          stop();
          el.textContent = `${to}${suffix}`;
        };
      });
    },
    { scope: ref }
  );
  return (
    <span ref={ref} className={className}>
      {to}
      {suffix}
    </span>
  );
}

/* ── Scrubbed word illumination ───────────────────────────────────────────── */
export function ScrubWords({ text, className, dim = 0.14 }: { text: string; className?: string; dim?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        gsap.fromTo(
          ref.current!.querySelectorAll("[data-w]"),
          { opacity: dim },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 45%", scrub: true },
          }
        );
      });
    },
    { scope: ref }
  );
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w="" className="inline-block whitespace-pre">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

/* ── Marquee (CSS-driven, pauses off-screen) ──────────────────────────────── */
export function Marquee({
  children,
  duration = 40,
  className,
  reverse = false,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <div
        className="flex w-max animate-marquee"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: visible ? "running" : "paused",
          } as CSSProperties
        }
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}

/* ── Refresh helper: re-measure triggers once images settle ───────────────── */
export function useRefreshOnLoad() {
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
}
