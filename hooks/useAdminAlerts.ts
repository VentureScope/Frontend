"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "@/lib/admin-notifications-api";
import { getAdminApiErrorMessage } from "@/lib/admin-utils";
import type { AdminNotificationItem } from "@/types/admin-notifications";

export type AlertsSourceFilter = "all" | "pipeline" | "sentry";

export function useAdminAlerts() {
  const [items, setItems] = useState<AdminNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<AlertsSourceFilter>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAdminNotifications({
        page: 1,
        per_page: 100,
        unread_only: unreadOnly,
        source: source === "all" ? null : source,
      });
      setItems(res.items);
      setUnreadCount(res.unread_count);
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [source, unreadOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = useCallback(
    async (id: string) => {
      setActionLoading(true);
      try {
        await markAdminNotificationRead(id);
        setItems((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  const markAllRead = useCallback(async () => {
    setActionLoading(true);
    try {
      await markAllAdminNotificationsRead(
        source === "all" ? null : source,
      );
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } finally {
      setActionLoading(false);
    }
  }, [source]);

  return {
    items,
    unreadCount,
    loading,
    error,
    source,
    setSource,
    unreadOnly,
    setUnreadOnly,
    actionLoading,
    reload: load,
    markRead,
    markAllRead,
  };
}
