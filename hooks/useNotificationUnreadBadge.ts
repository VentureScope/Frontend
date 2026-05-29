"use client";

import { useNotificationsActivityQuery } from "@/hooks/queries/use-notifications-activity-query";
import { useNotificationsListQuery } from "@/hooks/queries/use-notifications-list-query";
import { useNotificationsSummaryQuery } from "@/hooks/queries/use-notifications-summary-query";

/** Unread count for the nav bell (panel list > home activity > sub-route summary). */
export function useNotificationUnreadBadge(): number {
  const list = useNotificationsListQuery();
  const activity = useNotificationsActivityQuery();
  const summary = useNotificationsSummaryQuery();

  return (
    list.data?.unread_count ??
    activity.data?.unread_count ??
    summary.data?.unread_count ??
    0
  );
}
