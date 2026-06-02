"use client";

import { useNotificationsSummaryQuery } from "@/hooks/queries/use-notifications-summary-query";

/** Unread count for the nav bell. */
export function useNotificationUnreadBadge(): number {
  const summary = useNotificationsSummaryQuery();
  return summary.data?.unread_count ?? 0;
}
