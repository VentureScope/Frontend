import { listNotifications } from "@/lib/notifications-api";
import {
  NOTIFICATION_ACTIVITY_PAGE_SIZE,
  NOTIFICATION_LIST_PAGE_SIZE,
  NOTIFICATION_UNREAD_PAGE_SIZE,
} from "@/lib/queries/constants";
import type { NotificationListResponse } from "@/types/notifications";

export async function fetchNotificationsSummary(): Promise<NotificationListResponse> {
  return listNotifications({
    page: 1,
    per_page: NOTIFICATION_UNREAD_PAGE_SIZE,
  });
}

export async function fetchNotificationsActivity(): Promise<NotificationListResponse> {
  return listNotifications({
    page: 1,
    per_page: NOTIFICATION_ACTIVITY_PAGE_SIZE,
  });
}

export async function fetchNotificationsList(
  perPage = NOTIFICATION_LIST_PAGE_SIZE,
): Promise<NotificationListResponse> {
  return listNotifications({ page: 1, per_page: perPage });
}
