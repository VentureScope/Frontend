import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { NOTIFICATION_LIST_PAGE_SIZE } from "@/lib/queries/constants";
import type { NotificationListResponse } from "@/types/notifications";

const notificationCacheKeys = [
  queryKeys.notifications.summary(),
  queryKeys.notifications.activity(),
  queryKeys.notifications.list(NOTIFICATION_LIST_PAGE_SIZE),
] as const;

/** Keep summary, activity, and panel list caches in sync after mutations. */
export function patchNotificationCaches(
  queryClient: QueryClient,
  updater: (prev: NotificationListResponse) => NotificationListResponse,
): void {
  for (const key of notificationCacheKeys) {
    queryClient.setQueryData<NotificationListResponse>(key, (prev) =>
      prev ? updater(prev) : prev,
    );
  }
}
