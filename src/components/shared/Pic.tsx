"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";
import { useState, type CSSProperties } from "react";
import type { SiteImage } from "@/content/media";

const UNSPLASH = "https://images.unsplash.com/";

/**
 * Stock photographs are resized by Unsplash's own image CDN (global, already
 * cached, AVIF/WebP by browser) instead of a cold round-trip through the
 * Next.js optimiser — they appear much faster, especially on first visit.
 */
const unsplashLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  // AVIF holds up very well at these settings; large sizes (sharp phone and
  // retina screens) get a lower number, which roughly halves their weight
  // with no visible difference at the size they are shown.
  const q = Math.min(quality ?? 60, width >= 1000 ? 50 : 60);
  url.searchParams.set("w", String(Math.min(width, 2400)));
  url.searchParams.set("q", String(q));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
};

/** A ~1 KB, 40px version of the photo, blurred, shown instantly while the real one loads. */
function tinyPreview(src: string) {
  const url = new URL(src);
  url.searchParams.set("w", "40");
  url.searchParams.set("q", "30");
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}

/**
 * Art-directed fill image.
 *  - `image.focus` / `image.focusMobile` set the object-position per breakpoint so
 *    the subject (couple, stage, performer) stays in frame in every crop.
 *  - Shows a soft placeholder while loading and a branded fallback if the
 *    source fails, instead of a broken-image icon.
 * The parent must be positioned and sized (aspect ratio or explicit height).
 */
export function Pic({
  image,
  alt,
  className,
  tone = "light",
  skeleton = true,
  ...rest
}: Omit<ImageProps, "src" | "alt" | "fill"> & { image: SiteImage; alt?: string; tone?: "light" | "dark"; skeleton?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const focus = image.focus ?? "50% 50%";
  const style = { "--fp": focus, "--fpm": image.focusMobile ?? focus } as CSSProperties;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt ?? image.alt}
        className={`absolute inset-0 grid place-items-center ${tone === "dark" ? "bg-graphite text-white/40" : "bg-cream text-rose"}`}
      >
        <svg viewBox="-20 -20 40 40" className="size-10 opacity-60" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-8" rx="5" ry="8" fill="currentColor" transform={`rotate(${a})`} />
          ))}
        </svg>
      </div>
    );
  }

  const stock = image.src.startsWith(UNSPLASH);

  return (
    <>
      {skeleton && !loaded &&
        (stock ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-cover blur-xl"
            style={{ backgroundImage: `url("${tinyPreview(image.src)}")`, backgroundPosition: focus }}
          />
        ) : (
          <span aria-hidden="true" className={`absolute inset-0 animate-pulse ${tone === "dark" ? "bg-graphite" : "bg-cream"}`} />
        ))}
      <Image
        {...rest}
        loader={stock ? unsplashLoader : undefined}
        src={image.src}
        alt={alt ?? image.alt}
        fill
        style={style}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`object-cover object-[var(--fpm)] md:object-[var(--fp)] ${className ?? ""}`}
      />
    </>
  );
}
