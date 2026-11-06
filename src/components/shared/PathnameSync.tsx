"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Inner({ onChange }: { onChange: (p: string) => void }) {
  const p = usePathname();
  useEffect(() => {
    onChange(p);
  }, [p, onChange]);
  return null;
}

/**
 * Reads the pathname inside its own Suspense boundary so global chrome (nav,
 * providers) can stay in the prerendered static shell on dynamic routes.
 */
export function usePathnameState() {
  const [pathname, setPathname] = useState<string | null>(null);
  const sync = (
    <Suspense fallback={null}>
      <Inner onChange={setPathname} />
    </Suspense>
  );
  return [pathname, sync] as const;
}
