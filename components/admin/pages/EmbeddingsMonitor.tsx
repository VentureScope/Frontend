"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import {
  adminEmeraldBtn,
  adminGhostBtn,
  adminPage,
} from "@/components/admin/ui/admin-styles";
import { useAdminMlRuns } from "@/hooks/useAdminMlRuns";
import { formatAdminTimestamp } from "@/lib/admin-response-parsers";

const STATUS_FILTERS = [
  { id: null, label: "All" },
  { id: "failed", label: "Failed" },
  { id: "awaiting_review", label: "Awaiting review" },
  { id: "training", label: "Training" },
  { id: "deployed", label: "Deployed" },
] as const;

function statusBadge(status: string) {
  if (status === "failed") {
    return <span className="font-mono text-xs text-red-400">✗ failed</span>;
  }
  if (status === "training") {
    return <span className="font-mono text-xs text-amber-400">● training</span>;
  }
  if (status === "awaiting_review") {
    return <span className="font-mono text-xs text-amber-400">◆ review</span>;
  }
  if (status === "deployed") {
    return <span className="font-mono text-xs text-emerald-400">✓ deployed</span>;
  }
  return <span className="font-mono text-xs text-zinc-400">{status}</span>;
}

export function EmbeddingsMonitor() {
  const {
    items,
    total,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pages,
    reload,
    deploy,
    triggerTraining,
    actionLoading,
    fetchCounts,
  } = useAdminMlRuns();

  const [counts, setCounts] = useState({
    total: 0,
    failed: 0,
    awaiting: 0,
  });

  useEffect(() => {
    void fetchCounts().then(setCounts);
  }, [fetchCounts, items.length]);

  return (
    <div className={adminPage}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-white">ML / Embedding Runs</h1>
          <p className="text-sm text-zinc-500">
            Training runs from <span className="font-mono">/api/admin/ml/runs</span>.
            Deploy applies to runs in awaiting_review.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={actionLoading === "trigger"}
            onClick={() => void triggerTraining()}
            className={adminEmeraldBtn}
          >
            {actionLoading === "trigger" ? "…" : "Trigger training"}
          </button>
          <button type="button" onClick={() => void reload()} className={adminGhostBtn}>
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <div className="mb-4 grid grid-cols-3 gap-3">
        <AdminStatCard
          label="Total runs"
          value={counts.total.toLocaleString()}
          valueClassName="text-emerald-400"
        />
        <AdminStatCard
          label="Awaiting review"
          value={counts.awaiting.toLocaleString()}
          valueClassName="text-amber-400"
        />
        <AdminStatCard
          label="Failed"
          value={counts.failed.toLocaleString()}
          valueClassName="text-red-400"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={`rounded-md border px-3 py-1 text-xs ${
              statusFilter === f.id
                ? "border-emerald-800 text-emerald-400"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading ML runs…
        </div>
      ) : (
        <>
          <table className="mb-4 w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {[
                  "Run ID",
                  "Model",
                  "Status",
                  "Created",
                  "Accuracy",
                  "Summary",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-zinc-500">
                    No runs match this filter.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-800/50 odd:bg-zinc-900 hover:bg-zinc-800/40"
                  >
                    <td className="max-w-[120px] truncate px-3 py-2 font-mono text-xs text-zinc-300">
                      {row.id}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                      {row.model_type}
                    </td>
                    <td className="px-3 py-2">{statusBadge(row.status)}</td>
                    <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                      {formatAdminTimestamp(row.created_at)}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                      {row.accuracy ?? "—"}
                    </td>
                    <td
                      className="max-w-[200px] truncate px-3 py-2 text-xs text-zinc-500"
                      title={row.metrics_summary ?? undefined}
                    >
                      {row.metrics_summary ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      {row.status === "awaiting_review" ? (
                        <button
                          type="button"
                          className={adminGhostBtn}
                          disabled={actionLoading === row.id}
                          onClick={() => void deploy(row.id)}
                        >
                          {actionLoading === row.id ? "…" : "Deploy"}
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {pages > 1 ? (
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>
                Page {page} of {pages} · {total} runs
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className={adminGhostBtn}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                  className={adminGhostBtn}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
