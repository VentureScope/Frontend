"use client";

import { useNotificationsListQuery } from "@/hooks/queries/use-notifications-list-query";

/** Unread count for the nav bell (shared notifications query cache). */
export function useNotificationUnreadBadge(): number {
  const { data } = useNotificationsListQuery();
  return data?.unread_count ?? 0;
}
