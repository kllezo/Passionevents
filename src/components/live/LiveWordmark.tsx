/** Passion Live sub-brand wordmark (typographic; the floral logo belongs to Passion Events). */
export function LiveWordmark({ className, bars = true }: { className?: string; bars?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display uppercase leading-none tracking-[0.06em] ${className ?? ""}`}>
      {bars && (
        <span className="flex h-[0.9em] items-end gap-[2px]" aria-hidden="true">
          {[0.5, 1, 0.7, 0.35].map((h, i) => (
            <span key={i} className="w-[3px] origin-bottom animate-[eq_1s_ease-in-out_infinite] bg-volt" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      )}
      <span>
        Passion<span className="text-volt">/</span>Live
      </span>
    </span>
  );
}
