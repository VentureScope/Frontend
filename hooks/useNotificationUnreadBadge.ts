"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  getCachedNotificationUnreadCount,
  setNotificationSummaryCache,
  subscribeNotificationSummaryCache,
} from "@/lib/notification-summary-cache";
import { listNotifications } from "@/lib/notifications-api";

const DASHBOARD_OVERVIEW_PATH = "/dashboard";

/**
 * Unread count for the nav bell. Skips fetch on /dashboard (overview populates cache).
 * Otherwise fetches a minimal list once when cache is empty/stale.
 */
export function useNotificationUnreadBadge() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(
    () => getCachedNotificationUnreadCount() ?? 0,
  );

  const syncFromCache = useCallback(() => {
    const cached = getCachedNotificationUnreadCount();
    if (cached != null) {
      setUnreadCount(cached);
    }
  }, []);

  useEffect(() => subscribeNotificationSummaryCache(syncFromCache), [syncFromCache]);

  useEffect(() => {
    if (getCachedNotificationUnreadCount() != null) {
      syncFromCache();
      return;
    }

    if (pathname === DASHBOARD_OVERVIEW_PATH) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await listNotifications({ page: 1, per_page: 1 });
        if (cancelled) return;
        setNotificationSummaryCache(res.unread_count);
        setUnreadCount(res.unread_count);
      } catch (err) {
        if (!cancelled) {
          console.error("[notifications] badge fetch failed", getApiErrorMessage(err));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, syncFromCache]);

  return unreadCount;
}
