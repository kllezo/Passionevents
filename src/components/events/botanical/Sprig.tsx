import { leafPath, leafVein, petalPath, type SprigGeometry } from "./geometry";

/**
 * Renders sprig geometry as SVG groups. Purely presentational (server-safe).
 * Animation hooks: .bt-stem / .bt-twig (strokes, drawn with DrawSVG),
 * .bt-leaf and .bt-bloom (scaled / revealed).
 */
export function SprigGroup({ g, strokeWidth = 2.2, className }: { g: SprigGeometry; strokeWidth?: number; className?: string }) {
  return (
    <g className={className}>
      <path className="bt-stem" d={g.stem} fill="none" stroke="var(--color-mint-deep)" strokeWidth={strokeWidth} strokeLinecap="round" />
      {g.twigs.map((t, i) => (
        <path key={`t${i}`} className="bt-twig" d={t.d} fill="none" stroke="var(--color-mint-deep)" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" />
      ))}
      {g.leaves.map((l, i) => (
        <g key={`l${i}`} transform={`translate(${l.x} ${l.y}) rotate(${l.angle})`}>
          <g className="bt-leaf">
            <path d={leafPath(l.len, l.width)} fill={i % 3 === 0 ? "var(--color-mint-deep)" : "var(--color-mint)"} opacity={0.92} />
            <path d={leafVein(l.len)} stroke="var(--color-ivory)" strokeOpacity={0.55} strokeWidth={0.8} fill="none" />
          </g>
        </g>
      ))}
      {g.blooms.map((b, i) => (
        <g key={`b${i}`} transform={`translate(${b.x} ${b.y}) rotate(${b.rot})`}>
          <Bloom r={b.r} tone={b.tone} />
        </g>
      ))}
    </g>
  );
}

export function Bloom({ r, tone = "coral" }: { r: number; tone?: "coral" | "blush" }) {
  const petal = petalPath(r);
  const fill = tone === "coral" ? "var(--color-coral)" : "var(--color-blush)";
  return (
    <g className="bt-bloom">
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={petal} fill={fill} transform={`rotate(${a})`} />
      ))}
      {[0, 72, 144, 216, 288].map((a) => (
        <line key={`s${a}`} x1={0} y1={-r * 0.35} x2={0} y2={-r * 0.62} stroke="var(--color-ink)" strokeOpacity={0.55} strokeWidth={Math.max(0.6, r * 0.07)} strokeLinecap="round" transform={`rotate(${a + 36})`} />
      ))}
      <circle r={r * 0.32} fill="var(--color-magenta)" />
      <circle r={r * 0.12} fill="var(--color-ink)" />
    </g>
  );
}
