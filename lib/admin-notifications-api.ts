import adminApi from "@/lib/admin-api";
import { parseAdminNotificationsList } from "@/lib/admin-response-parsers";
import type { AdminNotificationListResponse } from "@/types/admin-notifications";

export type ListAdminNotificationsParams = {
  source?: string | null;
  unread_only?: boolean;
  page?: number;
  per_page?: number;
};

export async function listAdminNotifications(
  params: ListAdminNotificationsParams = {},
): Promise<AdminNotificationListResponse> {
  const res = await adminApi.get<unknown>("/api/admin/notifications-feed", {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 50,
      unread_only: params.unread_only ?? false,
      ...(params.source ? { source: params.source } : {}),
    },
  });
  return parseAdminNotificationsList(res.data);
}

export async function markAdminNotificationRead(
  notificationId: string,
): Promise<void> {
  await adminApi.patch(
    `/api/admin/notifications-feed/${notificationId}/read`,
  );
}

export async function markAllAdminNotificationsRead(
  source?: string | null,
): Promise<void> {
  await adminApi.patch("/api/admin/notifications-feed/mark-all-read", undefined, {
    params: source ? { source } : {},
  });
}
