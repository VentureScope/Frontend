"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { NOTIFICATION_LIST_PAGE_SIZE } from "@/lib/queries/constants";
import { fetchNotificationsList } from "@/lib/queries/notifications";

export function useNotificationsListQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.list(NOTIFICATION_LIST_PAGE_SIZE),
    queryFn: () => fetchNotificationsList(NOTIFICATION_LIST_PAGE_SIZE),
  });
}
