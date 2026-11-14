/** Formatting helpers shared by server and client components (no DB access). */
export function artistList(e: { artists: string }) {
  return e.artists
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // India has no daylight saving

/**
 * Date parts in India time, formatted by hand rather than with Intl: the
 * server's and the browser's locale data differ ("Sep" vs "Sept", the space
 * before "pm"), and these strings render in client components, so any
 * difference is a hydration error. Output matches en-IN in current browsers.
 */
export function liveDateParts(d: Date | null) {
  if (!d) return null;
  const t = new Date(new Date(d).getTime() + IST_OFFSET_MS);
  if (Number.isNaN(t.getTime())) return null;
  const h = t.getUTCHours();
  const m = t.getUTCMinutes();
  return {
    day: String(t.getUTCDate()).padStart(2, "0"),
    month: MONTHS[t.getUTCMonth()],
    year: String(t.getUTCFullYear()),
    weekday: WEEKDAYS[t.getUTCDay()],
    time: `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`,
    /** False when only a date was entered (stored as midnight IST). */
    hasTime: h !== 0 || m !== 0,
  };
}
