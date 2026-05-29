"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { NOTIFICATION_LIST_PAGE_SIZE } from "@/lib/queries/constants";
import { fetchNotificationsList } from "@/lib/queries/notifications";

/** Full notification list — only fetched when the panel is open. */
export function useNotificationsListQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.notifications.list(NOTIFICATION_LIST_PAGE_SIZE),
    queryFn: () => fetchNotificationsList(NOTIFICATION_LIST_PAGE_SIZE),
    enabled: options?.enabled ?? false,
  });
}
