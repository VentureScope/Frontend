"use client";

import { useEffect, useState } from "react";

/** Defers secondary UI/data work until after first paint (idle or timeout). */
export function useDeferredMount(timeoutMs = 1500) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const enable = () => {
      if (!cancelled) {
        setReady(true);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(enable, { timeout: timeoutMs });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timerId = window.setTimeout(enable, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [timeoutMs]);

  return ready;
}
