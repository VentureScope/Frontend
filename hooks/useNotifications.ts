"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import { patchNotificationCaches } from "@/lib/queries/notification-cache";
import { queryKeys } from "@/lib/query-keys";
import { NOTIFICATION_LIST_PAGE_SIZE } from "@/lib/queries/constants";
import { useNotificationsListQuery } from "@/hooks/queries/use-notifications-list-query";
import {
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications-api";
import type { NotificationListResponse } from "@/types/notifications";

type UseNotificationsOptions = {
  /** Fetch the full list only while the notification panel is open. */
  enabled: boolean;
};

export function useNotifications({ enabled }: UseNotificationsOptions) {
  const queryClient = useQueryClient();
  const listQuery = useNotificationsListQuery({ enabled });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const setListData = useCallback(
    (updater: (list: NotificationListResponse) => NotificationListResponse) => {
      patchNotificationCaches(queryClient, updater);
    },
    [queryClient],
  );

  const markRead = useCallback(
    async (id: string) => {
      setActionLoading(true);
      setActionError(null);
      try {
        const updated = await markNotificationRead(id);
        setListData((prev) => {
          const wasUnread = prev.notifications.find(
            (n) => n.id === id && !n.is_read,
          );
          return {
            ...prev,
            notifications: prev.notifications.map((n) =>
              n.id === id ? { ...n, ...updated, is_read: true } : n,
            ),
            unread_count: wasUnread
              ? Math.max(0, prev.unread_count - 1)
              : prev.unread_count,
          };
        });
      } catch (err) {
        setActionError(getApiErrorMessage(err));
      } finally {
        setActionLoading(false);
      }
    },
    [setListData],
  );

  const markAllRead = useCallback(async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await markAllNotificationsRead();
      setListData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, is_read: true })),
        unread_count: 0,
      }));
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }, [setListData]);

  const remove = useCallback(
    async (id: string) => {
      const listKey = queryKeys.notifications.list(NOTIFICATION_LIST_PAGE_SIZE);
      const prev = queryClient.getQueryData<NotificationListResponse>(listKey);
      const target = prev?.notifications.find((n) => n.id === id);
      setActionLoading(true);
      setActionError(null);
      try {
        await deleteNotification(id);
        setListData((list) => ({
          ...list,
          notifications: list.notifications.filter((n) => n.id !== id),
          total_count: Math.max(0, list.total_count - 1),
          unread_count:
            target && !target.is_read
              ? Math.max(0, list.unread_count - 1)
              : list.unread_count,
        }));
      } catch (err) {
        setActionError(getApiErrorMessage(err));
      } finally {
        setActionLoading(false);
      }
    },
    [queryClient, setListData],
  );

  const reload = useCallback(() => listQuery.refetch(), [listQuery.refetch]);

  return {
    items: listQuery.data?.notifications ?? [],
    loading: enabled && listQuery.isPending,
    error:
      actionError ??
      (listQuery.error ? getApiErrorMessage(listQuery.error) : null),
    actionLoading,
    reload,
    markRead,
    markAllRead,
    remove,
  };
}
