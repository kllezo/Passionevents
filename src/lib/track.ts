/**
 * Send a GA4 event when Google Analytics is loaded (see components/shared/Analytics).
 * Does nothing when GA is off. Never pass personal details (names, phone numbers, emails).
 */
export function track(name: string, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}
