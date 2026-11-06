import Image, { type ImageProps } from "next/image";

/**
 * next/image wrapper: admin uploads are already resized + WebP-encoded by
 * sharp on upload, so they bypass the optimizer; everything else is optimised.
 */
export function MediaImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const uploaded = src.startsWith("/api/media/");
  return <Image {...props} unoptimized={uploaded || props.unoptimized} alt={props.alt} />;
}
