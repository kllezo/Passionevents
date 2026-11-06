/**
 * Deterministic botanical geometry. Everything is computed from a seed so the
 * server and client render identical SVG (no hydration mismatch) and every
 * sprig on the site has the same hand-drawn vocabulary as the logo:
 * a fine stem, mint leaves and five-petal coral blooms with magenta hearts.
 */

export type Pt = { x: number; y: number };

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

export function cubicTangent(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
    y: 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y),
  };
}

/** Leaf as a pointed almond, base at origin pointing along +x. */
export function leafPath(len: number, width: number) {
  const w = width / 2;
  return `M0 0 C${r2(len * 0.25)} ${r2(-w * 1.25)} ${r2(len * 0.7)} ${r2(-w * 1.1)} ${r2(len)} 0 C${r2(len * 0.7)} ${r2(w * 1.1)} ${r2(len * 0.25)} ${r2(w * 1.25)} 0 0Z`;
}

/** Leaf midrib. */
export function leafVein(len: number) {
  return `M${r2(len * 0.08)} 0 L${r2(len * 0.85)} 0`;
}

/** Single rounded petal pointing up (-y), base at origin. */
export function petalPath(r: number) {
  return `M0 0 C${r2(-r * 0.75)} ${r2(-r * 0.25)} ${r2(-r * 0.78)} ${r2(-r * 1.05)} 0 ${r2(-r * 1.0)} C${r2(r * 0.78)} ${r2(-r * 1.05)} ${r2(r * 0.75)} ${r2(-r * 0.25)} 0 0Z`;
}

export type Leaf = { x: number; y: number; angle: number; len: number; width: number };
export type Bloom = { x: number; y: number; r: number; rot: number; tone: "coral" | "blush" };
export type Twig = { d: string };

export type SprigGeometry = {
  stem: string;
  twigs: Twig[];
  leaves: Leaf[];
  blooms: Bloom[];
};

/**
 * Builds a sprig along a cubic stem: alternating leaves, little side twigs
 * ending in blooms, and a bloom cluster near the tip.
 */
export function buildSprig(opts: {
  p0: Pt;
  p1: Pt;
  p2: Pt;
  p3: Pt;
  seed?: number;
  scale?: number;
  leafCount?: number;
  bloomCount?: number;
}): SprigGeometry {
  const { p0, p1, p2, p3, seed = 7, scale = 1, leafCount = 14, bloomCount = 7 } = opts;
  const rand = mulberry32(seed);
  const stem = `M${r2(p0.x)} ${r2(p0.y)} C${r2(p1.x)} ${r2(p1.y)} ${r2(p2.x)} ${r2(p2.y)} ${r2(p3.x)} ${r2(p3.y)}`;

  const leaves: Leaf[] = [];
  for (let i = 0; i < leafCount; i++) {
    const t = 0.06 + (i / leafCount) * 0.9 + (rand() - 0.5) * 0.03;
    const p = cubic(p0, p1, p2, p3, t);
    const tan = cubicTangent(p0, p1, p2, p3, t);
    const base = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
    const side = i % 2 === 0 ? -1 : 1;
    leaves.push({
      x: r2(p.x),
      y: r2(p.y),
      angle: r2(base + side * (38 + rand() * 22)),
      len: r2((34 + rand() * 22) * scale * (1 - t * 0.35)),
      width: r2((11 + rand() * 6) * scale * (1 - t * 0.3)),
    });
  }

  const twigs: Twig[] = [];
  const blooms: Bloom[] = [];
  for (let i = 0; i < bloomCount; i++) {
    const t = 0.15 + (i / Math.max(1, bloomCount - 1)) * 0.82;
    const p = cubic(p0, p1, p2, p3, Math.min(t, 0.98));
    const tan = cubicTangent(p0, p1, p2, p3, Math.min(t, 0.98));
    const ang = Math.atan2(tan.y, tan.x);
    const side = i % 2 === 0 ? 1 : -1;
    const off = (20 + rand() * 30) * scale;
    const nx = -Math.sin(ang) * side;
    const ny = Math.cos(ang) * side;
    const end = { x: p.x + nx * off + Math.cos(ang) * off * 0.4, y: p.y + ny * off + Math.sin(ang) * off * 0.4 };
    const mid = { x: (p.x + end.x) / 2 + Math.cos(ang) * 6 * scale, y: (p.y + end.y) / 2 + Math.sin(ang) * 6 * scale };
    twigs.push({ d: `M${r2(p.x)} ${r2(p.y)} Q${r2(mid.x)} ${r2(mid.y)} ${r2(end.x)} ${r2(end.y)}` });
    blooms.push({
      x: r2(end.x),
      y: r2(end.y),
      r: r2((9 + rand() * 7) * scale),
      rot: r2(rand() * 72),
      tone: rand() > 0.82 ? "blush" : "coral",
    });
  }
  return { stem, twigs, leaves, blooms };
}

/**
 * A sprig that hugs a circle between two angles (degrees, 0 = +x, clockwise
 * because SVG y points down). Used to echo the logo's floral ring.
 */
export function buildRingSprig(opts: {
  cx: number;
  cy: number;
  r: number;
  from: number;
  to: number;
  seed?: number;
  scale?: number;
  leafCount?: number;
  bloomCount?: number;
  wobble?: number;
}): SprigGeometry {
  const { cx, cy, r, from, to, wobble = 0.06, ...rest } = opts;
  const at = (deg: number, rr: number): Pt => ({
    x: cx + Math.cos((deg * Math.PI) / 180) * rr,
    y: cy + Math.sin((deg * Math.PI) / 180) * rr,
  });
  // Approximate the arc with one cubic whose control points sit slightly off the ring.
  const span = to - from;
  const k = (4 / 3) * Math.tan(((span / 4) * Math.PI) / 180);
  const p0 = at(from, r * (1 + wobble));
  const p3 = at(to, r * (1 - wobble * 0.5));
  const t0 = ((from + 90) * Math.PI) / 180;
  const t3 = ((to - 90) * Math.PI) / 180;
  const p1 = { x: p0.x + Math.cos(t0) * r * k, y: p0.y + Math.sin(t0) * r * k };
  const p2 = { x: p3.x + Math.cos(t3) * r * k, y: p3.y + Math.sin(t3) * r * k };
  return buildSprig({ p0, p1, p2, p3, ...rest });
}
