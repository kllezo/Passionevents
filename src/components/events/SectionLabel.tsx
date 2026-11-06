export function SectionLabel({ index, children, tone = "rose", className }: { index?: string; children: React.ReactNode; tone?: "rose" | "ivory"; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${tone === "rose" ? "text-rose-deep" : "text-ivory/80"} ${className ?? ""}`}>
      {index && <span className="font-serif text-base normal-case italic tracking-normal">({index})</span>}
      <span className={`h-px w-8 ${tone === "rose" ? "bg-rose/60" : "bg-ivory/50"}`} />
      {children}
    </p>
  );
}
