"use client";

import { useEffect, useRef } from "react";
import { Bell, CheckCheck, Loader2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  formatRelativeTime,
  getNotificationHref,
  notificationSourceLabel,
} from "@/lib/dashboard-utils";
import { useNotificationUnreadBadge } from "@/hooks/useNotificationUnreadBadge";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types/notifications";

type NotificationPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function truncateBody(body: string, max = 96): string {
  const trimmed = body.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = useNotificationUnreadBadge();
  const {
    items,
    loading,
    error,
    actionLoading,
    markRead,
    markAllRead,
    remove,
  } = useNotifications({ enabled: open });

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!panelRef.current) return;
      const target = event.target as Node;
      if (!panelRef.current.contains(target)) {
        onOpenChange(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  async function handleSelect(notification: NotificationItem) {
    if (!notification.is_read) {
      await markRead(notification.id);
    }
    onOpenChange(false);
    router.push(getNotificationHref(notification));
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "relative rounded-lg p-2 text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          open && "bg-muted text-foreground",
        )}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={20} />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-card shadow-lg"
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              {unreadCount > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={actionLoading || unreadCount === 0}
                onClick={() => void markAllRead()}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                aria-label="Mark all as read"
                title="Mark all as read"
              >
                <CheckCheck size={16} />
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close notifications"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {error ? (
            <p className="px-4 py-3 text-sm text-destructive">{error}</p>
          ) : null}

          <div className="max-h-[min(24rem,60vh)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                Loading…
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((notification) => (
                  <li key={notification.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => void handleSelect(notification)}
                      className={cn(
                        "flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted",
                        !notification.is_read && "bg-primary/5",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 pr-6">
                        <span className="text-sm font-medium text-foreground">
                          {notification.title}
                        </span>
                        {!notification.is_read ? (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {truncateBody(notification.body)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {notificationSourceLabel(notification.notification_type)}
                        </span>
                        <span aria-hidden>·</span>
                        <span>{formatRelativeTime(notification.created_at)}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={(event) => {
                        event.stopPropagation();
                        void remove(notification.id);
                      }}
                      className="absolute right-2 top-3 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
