"use client";

import { useRef } from "react";
import { useCanvasLoop } from "./useCanvasLoop";

/**
 * Generated (not analysed) waveform visuals — "line", "bars" (equaliser) or
 * "circle". `energy` can be nudged from outside (e.g. drum hits) via ref.
 */
export function Waveform({
  variant = "line",
  className,
  colors = ["#ff5a1f", "#8b5cff", "#2ec5ff"],
  energyRef,
  density = 1,
}: {
  variant?: "line" | "bars" | "circle";
  className?: string;
  colors?: string[];
  energyRef?: React.RefObject<number>;
  density?: number;
}) {
  const local = useRef(0.6);

  const ref = useCanvasLoop(({ ctx, w, h, t, dt, mobile }) => {
    ctx.clearRect(0, 0, w, h);
    const ext = energyRef?.current ?? 0;
    // smooth energy toward base + external kicks
    local.current += (0.55 + ext - local.current) * Math.min(1, dt * 6);
    if (energyRef) energyRef.current = Math.max(0, ext - dt * 1.8);
    const e = local.current;

    if (variant === "line") {
      ctx.globalCompositeOperation = "lighter";
      colors.forEach((c, li) => {
        ctx.beginPath();
        const amp = h * 0.32 * e * (1 - li * 0.22);
        const steps = mobile ? 90 : 180;
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * w;
          const u = i / steps;
          const env = Math.sin(Math.PI * u);
          const y =
            h / 2 +
            env *
              amp *
              (Math.sin(u * 18 * density + t * (2.2 + li * 0.7) + li) * 0.6 +
                Math.sin(u * 47 * density - t * 3.1 + li * 2) * 0.25 +
                Math.sin(u * 7 + t * 0.9) * 0.15);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = c;
        ctx.globalAlpha = 0.85 - li * 0.2;
        ctx.lineWidth = li === 0 ? 2 : 1.2;
        ctx.shadowColor = c;
        ctx.shadowBlur = mobile ? 0 : 12;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
    } else if (variant === "bars") {
      const count = Math.floor((mobile ? 28 : 56) * density);
      const gap = 3;
      const bw = (w - gap * (count - 1)) / count;
      for (let i = 0; i < count; i++) {
        const u = i / count;
        const v =
          0.15 +
          0.85 *
            e *
            Math.abs(Math.sin(t * (1.6 + (i % 7) * 0.31) + i * 0.7) * 0.6 + Math.sin(t * 3.7 + u * 9) * 0.4) *
            (0.55 + 0.45 * Math.sin(Math.PI * u));
        const bh = Math.max(2, v * h);
        const g = ctx.createLinearGradient(0, h, 0, h - bh);
        g.addColorStop(0, colors[0]);
        g.addColorStop(1, colors[1] ?? colors[0]);
        ctx.fillStyle = g;
        ctx.fillRect(i * (bw + gap), h - bh, bw, bh);
      }
    } else {
      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) * 0.28;
      const count = mobile ? 72 : 128;
      ctx.lineCap = "round";
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + t * 0.15;
        const v = 0.2 + e * Math.abs(Math.sin(t * 2.4 + i * 0.37) * 0.7 + Math.sin(t * 1.1 + i * 0.11) * 0.3);
        const r1 = base;
        const r2 = base + v * base * 0.7;
        ctx.strokeStyle = colors[i % colors.length];
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  });

  return <canvas ref={ref} className={`pointer-events-none ${className ?? ""}`} aria-hidden="true" />;
}
