"use client";

import { Loader2 } from "lucide-react";
import { AdminActionBadge } from "@/components/admin/ui/AdminBadge";
import { adminGhostBtn, adminPage } from "@/components/admin/ui/admin-styles";
import { useAdminAlerts } from "@/hooks/useAdminAlerts";
import { formatAdminTimestamp } from "@/lib/admin-response-parsers";

function sourceTone(
  source: string,
): "emerald" | "red" | "amber" {
  if (source === "sentry") return "red";
  if (source === "pipeline") return "amber";
  return "emerald";
}

export function AdminAlerts() {
  const {
    items,
    unreadCount,
    loading,
    error,
    source,
    setSource,
    unreadOnly,
    setUnreadOnly,
    actionLoading,
    reload,
    markRead,
    markAllRead,
  } = useAdminAlerts();

  return (
    <div className={adminPage}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-white">System Alerts</h1>
          <p className="text-sm text-zinc-500">
            Pipeline and Sentry webhook notifications, newest first.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 ? (
            <span className="rounded-sm bg-amber-950 px-2 py-0.5 font-mono text-xs text-amber-400">
              {unreadCount} unread
            </span>
          ) : null}
          <button
            type="button"
            disabled={actionLoading || unreadCount === 0}
            onClick={() => void markAllRead()}
            className={adminGhostBtn}
          >
            Mark all read
          </button>
          <button type="button" onClick={() => void reload()} className={adminGhostBtn}>
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {(
            [
              { id: "all" as const, label: "All" },
              { id: "pipeline" as const, label: "Pipeline" },
              { id: "sentry" as const, label: "Sentry" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSource(f.id)}
              className={`rounded-md border px-3 py-1 text-xs ${
                source === f.id
                  ? "border-emerald-800 text-emerald-400"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="rounded border-zinc-700"
          />
          Unread only
        </label>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <div className="border border-zinc-800">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading alerts…
          </div>
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-500">
            No alerts match this filter.
          </p>
        ) : (
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex gap-4 border-b border-zinc-800/50 px-4 py-4 last:border-b-0 ${
                  item.is_read ? "bg-zinc-900/50" : "bg-zinc-900"
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminActionBadge tone={sourceTone(item.source)}>
                      {item.source.toUpperCase()}
                    </AdminActionBadge>
                    {!item.is_read ? (
                      <span className="font-mono text-[10px] text-amber-400">NEW</span>
                    ) : null}
                    <span className="font-mono text-[10px] text-zinc-600">
                      {formatAdminTimestamp(item.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  {item.body ? (
                    <p className="text-sm text-zinc-400">{item.body}</p>
                  ) : null}
                </div>
                {!item.is_read ? (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void markRead(item.id)}
                    className={`${adminGhostBtn} shrink-0 self-start`}
                  >
                    Mark read
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
