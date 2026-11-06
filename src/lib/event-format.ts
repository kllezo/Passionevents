/** Formatting helpers shared by server and client components (no DB access). */
export function artistList(e: { artists: string }) {
  return e.artists
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function liveDateParts(d: Date | null) {
  if (!d) return null;
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { ...o, timeZone: "Asia/Kolkata" }).format(d);
  return {
    day: f({ day: "2-digit" }),
    month: f({ month: "short" }).toUpperCase(),
    year: f({ year: "numeric" }),
    weekday: f({ weekday: "short" }).toUpperCase(),
    time: f({ hour: "numeric", minute: "2-digit" }),
    /** False when only a date was entered (stored as midnight IST). */
    hasTime: f({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) !== "00:00",
  };
}
