"use client";

import { useMemo } from "react";
import { mulberry32 } from "@/components/events/botanical/geometry";
import { useCanvasLoop } from "./useCanvasLoop";

type Beam = { x: number; color: string; speed: number; phase: number; spread: number; width: number };

/**
 * Layered stage lighting on a single 2D canvas: sweeping moving-head beams,
 * drifting haze, a capped number of dust particles caught in the light and a
 * soft follow-spot under the cursor. Additive blending, no WebGL needed.
 */
export function StageCanvas({ className, intensity = 1, beams: beamCount = 5 }: { className?: string; intensity?: number; beams?: number }) {
  const beams = useMemo<Beam[]>(() => {
    const rand = mulberry32(17);
    const palette = ["139,92,255", "255,90,31", "46,197,255", "255,46,136", "139,92,255", "46,197,255"];
    return Array.from({ length: 6 }, (_, i) => ({
      x: 0.1 + (i / 5) * 0.8,
      color: palette[i % palette.length],
      speed: 0.18 + rand() * 0.25,
      phase: rand() * Math.PI * 2,
      spread: 0.35 + rand() * 0.35,
      width: 0.05 + rand() * 0.05,
    }));
  }, []);

  const particles = useMemo(() => {
    const rand = mulberry32(5);
    return Array.from({ length: 60 }, () => ({ x: rand(), y: rand(), r: 0.4 + rand() * 1.6, s: 0.01 + rand() * 0.03, p: rand() * 6 }));
  }, []);

  const ref = useCanvasLoop(
    ({ ctx, w, h, t, mobile }) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);

      // haze
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 3; i++) {
        const hx = w * (0.2 + 0.3 * i + 0.08 * Math.sin(t * 0.07 + i));
        const hy = h * (0.55 + 0.1 * Math.cos(t * 0.05 + i * 2));
        const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.max(w, h) * 0.45);
        g.addColorStop(0, `rgba(${i === 1 ? "255,90,31" : "139,92,255"},${0.06 * intensity})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // beams
      const n = mobile ? Math.min(3, beamCount) : beamCount;
      for (let i = 0; i < n; i++) {
        const b = beams[i];
        const ox = w * b.x;
        const oy = -20;
        const angle = Math.sin(t * b.speed + b.phase) * b.spread + Math.PI / 2;
        const len = h * 1.35;
        const tx = ox + Math.cos(angle) * len;
        const ty = oy + Math.sin(angle) * len;
        const half = w * b.width + len * 0.08;
        const nx = -Math.sin(angle);
        const ny = Math.cos(angle);
        const g = ctx.createLinearGradient(ox, oy, tx, ty);
        const a = (0.22 + 0.08 * Math.sin(t * 1.3 + i)) * intensity;
        g.addColorStop(0, `rgba(${b.color},${a})`);
        g.addColorStop(0.6, `rgba(${b.color},${a * 0.25})`);
        g.addColorStop(1, `rgba(${b.color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(ox - nx * 3, oy - ny * 3);
        ctx.lineTo(ox + nx * 3, oy + ny * 3);
        ctx.lineTo(tx + nx * half, ty + ny * half);
        ctx.lineTo(tx - nx * half, ty - ny * half);
        ctx.closePath();
        ctx.fill();
        // lamp
        const lg = ctx.createRadialGradient(ox, 0, 0, ox, 0, 40);
        lg.addColorStop(0, `rgba(255,255,255,${0.5 * intensity})`);
        lg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = lg;
        ctx.fillRect(ox - 40, -40, 80, 80);
      }

      // dust
      const pc = mobile ? 18 : particles.length;
      for (let i = 0; i < pc; i++) {
        const p = particles[i];
        const px = ((p.x + Math.sin(t * 0.1 + p.p) * 0.02) % 1) * w;
        const py = ((p.y - t * p.s + 10) % 1) * h;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.8 + p.p));
        ctx.fillStyle = `rgba(255,255,255,${0.35 * tw * intensity})`;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    },
    // soft light needs no retina sharpness: 1x halves-to-quarters the fill cost
    { maxDpr: 1 }
  );

  return <canvas ref={ref} className={`pointer-events-none ${className ?? ""}`} aria-hidden="true" />;
}
