"use client";

import { useEffect, useState } from "react";
import type { MlRunRow } from "@/types/admin-ml";
import { EmbeddingsMonitorSkeleton } from "@/components/admin/AdminSkeletons";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { MlStatusLabel } from "@/components/admin/ui/admin-status";
import {
  adminFilterBtn,
  adminFilterBtnActive,
  adminGhostBtn,
  adminPage,
  adminPrimaryBtn,
} from "@/components/admin/ui/admin-styles";
import { MlRunSummaryCell } from "@/components/admin/MlRunSummaryCell";
import { MlRunSummaryModal } from "@/components/admin/MlRunSummaryModal";
import { useAdminMlRuns } from "@/hooks/useAdminMlRuns";
import { formatAdminTimestamp } from "@/lib/admin-response-parsers";

const STATUS_FILTERS = [
  { id: null, label: "All" },
  { id: "failed", label: "Failed" },
  { id: "awaiting_review", label: "Awaiting review" },
  { id: "training", label: "Training" },
  { id: "deployed", label: "Deployed" },
  { id: "suspended", label: "Suspended" },
] as const;

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
    redeploy,
    triggerTraining,
    actionLoading,
    fetchCounts,
  } = useAdminMlRuns();

  const [counts, setCounts] = useState({
    total: 0,
    failed: 0,
    awaiting: 0,
  });
  const [summaryRun, setSummaryRun] = useState<MlRunRow | null>(null);

  useEffect(() => {
    void fetchCounts().then(setCounts);
  }, [fetchCounts, items.length]);

  return (
    <div className={adminPage}>
      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-foreground">ML-Runs</h1>
          <p className="text-sm text-muted-foreground">
            Monitor ML training runs and deploy models awaiting review.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={actionLoading === "trigger" || loading}
            onClick={() => void triggerTraining()}
            className={adminPrimaryBtn}
          >
            {actionLoading === "trigger" ? "…" : "Trigger training"}
          </button>
          <button
            type="button"
            onClick={() => void reload()}
            disabled={loading}
            className={adminGhostBtn}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={
              statusFilter === f.id ? adminFilterBtnActive : adminFilterBtn
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <EmbeddingsMonitorSkeleton />
      ) : (
        <>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <AdminStatCard
          label="Total runs"
          value={counts.total.toLocaleString()}
          valueClassName="text-primary"
        />
        <AdminStatCard
          label="Awaiting review"
          value={counts.awaiting.toLocaleString()}
          valueClassName="text-warning"
        />
        <AdminStatCard
          label="Failed"
          value={counts.failed.toLocaleString()}
          valueClassName="text-destructive"
        />
      </div>

          <table className="mb-4 w-full text-sm">
            <thead>
              <tr className="border-b border-border">
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
                    className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-muted-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    No runs match this filter.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/60 odd:bg-card hover:bg-muted/40"
                  >
                    <td className="max-w-[120px] truncate px-3 py-2 font-mono text-xs text-foreground">
                      {row.id}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {row.model_type}
                    </td>
                    <td className="px-3 py-2">
                      <MlStatusLabel status={row.status} />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {formatAdminTimestamp(row.created_at)}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {row.accuracy ?? "—"}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <MlRunSummaryCell
                        run={row}
                        onView={() => setSummaryRun(row)}
                      />
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
                      ) : row.status === "superseded" ? (
                        <button
                          type="button"
                          className={adminGhostBtn}
                          disabled={actionLoading === row.id}
                          onClick={() => void redeploy(row.id)}
                          title="Reactivate this superseded run and supersede the current deployed one"
                        >
                          {actionLoading === row.id ? "…" : "Redeploy"}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {pages > 1 ? (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
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
      <MlRunSummaryModal
        run={summaryRun}
        open={summaryRun != null}
        onClose={() => setSummaryRun(null)}
      />
    </div>
  );
}
