import { listNotifications } from "@/lib/notifications-api";
import { NOTIFICATION_LIST_PAGE_SIZE } from "@/lib/queries/constants";
import type { NotificationListResponse } from "@/types/notifications";

export async function fetchNotificationsList(
  perPage = NOTIFICATION_LIST_PAGE_SIZE,
): Promise<NotificationListResponse> {
  return listNotifications({ page: 1, per_page: perPage });
}
