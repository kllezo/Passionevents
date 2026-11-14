"use client";

import type { ComponentProps } from "react";

/**
 * A plain <h1>, rendered from a client component. Used by the 404 page: its
 * markup ships inside every page's RSC data (as the not-found boundary), and a
 * literal "h1" there is miscounted by some SEO checkers as a second H1 on the
 * page. As a client component it is a module reference in that data instead.
 */
export function Heading1(props: ComponentProps<"h1">) {
  return <h1 {...props} />;
}
