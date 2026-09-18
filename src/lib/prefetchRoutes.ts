"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Warms up the JS/route chunk for one or more likely-next screens as soon
 * as the current one mounts, so tapping through to them doesn't hit a
 * visible load/compile pause — per direct instruction ("there's a loading
 * moment between pages when you act, it's not fluid").
 *
 * Root cause: every screen in this app navigates via `router.push()` on a
 * plain button `onClick`, never `<Link>` — and `<Link>` is the only thing
 * that prefetches automatically in this framework. With no `<Link>`
 * anywhere in this button-driven flow, nothing was ever prefetching, so
 * the very first tap into any route paid its full load cost live, in
 * front of the student.
 *
 * Bare pathnames (no query string) are enough — Next.js's own route
 * compilation/chunk caching is keyed by pathname, not by search params,
 * so prefetching `/recall/guided-reflection/session` warms that page
 * component regardless of which `?term=`/`?subject=` it's eventually
 * opened with.
 */
export function usePrefetchRoutes(paths: string[]): void {
  const router = useRouter();

  useEffect(() => {
    for (const path of paths) {
      router.prefetch(path);
    }
    // Intentionally only on mount — `paths` is expected to be a stable
    // literal array from the caller, not state that changes over the
    // screen's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
