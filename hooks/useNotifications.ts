"use client";

import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  adjustCachedNotificationUnreadCount,
  setNotificationSummaryCache,
} from "@/lib/notification-summary-cache";
import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications-api";
import type { NotificationItem } from "@/types/notifications";

const NAV_PAGE_SIZE = 20;

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listNotifications({
        page: 1,
        per_page: NAV_PAGE_SIZE,
      });
      setItems(res.notifications);
      setNotificationSummaryCache(res.unread_count);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    setActionLoading(true);
    try {
      const updated = await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updated, is_read: true } : n)),
      );
      adjustCachedNotificationUnreadCount(-1);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setActionLoading(true);
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setNotificationSummaryCache(0);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const target = items.find((n) => n.id === id);
    setActionLoading(true);
    try {
      await deleteNotification(id);
      setItems((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.is_read) {
        adjustCachedNotificationUnreadCount(-1);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }, [items]);

  return {
    items,
    loading,
    error,
    actionLoading,
    reload: load,
    markRead,
    markAllRead,
    remove,
  };
}
