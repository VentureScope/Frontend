import api from "@/lib/api";
import type {
  NotificationItem,
  NotificationListResponse,
} from "@/types/notifications";

export async function listNotifications(params?: {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
}): Promise<NotificationListResponse> {
  const res = await api.get<NotificationListResponse>("/api/notifications", {
    params,
  });
  return res.data;
}

export async function markNotificationRead(
  notificationId: string,
): Promise<NotificationItem> {
  const res = await api.patch<NotificationItem>(
    `/api/notifications/${notificationId}/read`,
  );
  return res.data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post("/api/notifications/mark-all-read");
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await api.delete(`/api/notifications/${notificationId}`);
}
