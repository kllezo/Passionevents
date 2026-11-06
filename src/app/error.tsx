"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="grid min-h-[70vh] place-items-center bg-ivory px-5 text-center text-ink">
      <div>
        <p className="eyebrow text-rose-deep">Something went wrong</p>
        <h1 className="mt-4 font-serif text-5xl font-light">We hit an unexpected snag.</h1>
        <button type="button" onClick={reset} className="mt-8 rounded-full bg-ink px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ivory">
          Try again
        </button>
      </div>
    </main>
  );
}
