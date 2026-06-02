"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useOrgAdvisorStore } from "@/store/useOrgAdvisorStore";

/**
 * Closes long-lived WebSockets before the page enters the back/forward cache.
 * Open sockets are a common bfcache failure reason on dashboard chat routes.
 */
export function BfcacheGuard() {
  useEffect(() => {
    function onPageHide() {
      useChatStore.getState().disconnect();
      useOrgAdvisorStore.getState().disconnect();
    }

    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  return null;
}
