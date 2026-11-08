"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type CSSProperties } from "react";
import type { SiteImage } from "@/content/media";

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

  return (
    <>
      {skeleton && !loaded && <span aria-hidden="true" className={`absolute inset-0 animate-pulse ${tone === "dark" ? "bg-graphite" : "bg-cream"}`} />}
      <Image
        {...rest}
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
