"use client";

import { useEffect, useMemo, useState } from "react";
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

/** Strip the trailing _prophet / _lstm suffix to get the shared base run ID. */
function baseRunId(id: string): string {
  return id.replace(/_(prophet|lstm)$/, "");
}

/** Group rows by their base run ID, preserving insertion order. */
function groupByRun(rows: MlRunRow[]): Map<string, MlRunRow[]> {
  const map = new Map<string, MlRunRow[]>();
  for (const row of rows) {
    const key = baseRunId(row.id);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(row);
  }
  return map;
}

/** Bundle-level status: worst status wins (deployed only if both are deployed). */
function bundleStatus(rows: MlRunRow[]): MlRunRow["status"] {
  const priority: Record<string, number> = {
    failed: 0,
    training: 1,
    awaiting_review: 2,
    superseded: 3,
    suspended: 4,
    deployed: 5,
  };
  return rows.reduce((worst, r) => {
    const w = priority[worst] ?? 99;
    const c = priority[r.status] ?? 99;
    return c < w ? r.status : worst;
  }, rows[0]?.status ?? "unknown");
}

/**
 * Determine the bundle-level action available:
 *  - "deploy"   if any model is awaiting_review (and none are deployed mid-state)
 *  - "redeploy" if all actionable models are superseded
 *  - null       if the bundle is already fully deployed or has no actionable models
 */
function bundleAction(rows: MlRunRow[]): "deploy" | "redeploy" | null {
  const hasAwaiting = rows.some((r) => r.status === "awaiting_review");
  const hasSuperseded = rows.some((r) => r.status === "superseded");
  const allDeployed = rows.length > 0 && rows.every((r) => r.status === "deployed");

  if (allDeployed) return null;
  if (hasAwaiting) return "deploy";
  if (hasSuperseded) return "redeploy";
  return null;
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
    deployBundle,
    triggerTraining,
    actionLoading,
    fetchCounts,
  } = useAdminMlRuns();

  const [counts, setCounts] = useState({ total: 0, failed: 0, awaiting: 0 });
  const [summaryRun, setSummaryRun] = useState<MlRunRow | null>(null);

  useEffect(() => {
    void fetchCounts().then(setCounts);
  }, [fetchCounts, items.length]);

  const bundles = useMemo(() => {
    const grouped = groupByRun(items);
    return Array.from(grouped.entries()).map(([base, rows]) => ({
      base,
      rows,
      status: bundleStatus(rows),
      action: bundleAction(rows),
      created_at: rows[0]?.created_at ?? "",
      // run_yearmonth identifies the training instance for the bundle deploy endpoint
      runYearMonth: rows.find((r) => r.run_yearmonth)?.run_yearmonth ?? null,
    }));
  }, [items]);

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
            Training runs grouped by instance. Each bundle contains the Prophet
            and LSTM models trained together.
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
            className={statusFilter === f.id ? adminFilterBtnActive : adminFilterBtn}
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
            <AdminStatCard label="Total runs" value={counts.total.toLocaleString()} valueClassName="text-primary" />
            <AdminStatCard label="Awaiting review" value={counts.awaiting.toLocaleString()} valueClassName="text-warning" />
            <AdminStatCard label="Failed" value={counts.failed.toLocaleString()} valueClassName="text-destructive" />
          </div>

          {bundles.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No runs match this filter.
            </p>
          ) : (
            <div className="mb-4 space-y-3">
              {bundles.map(({ base, rows, status, action, created_at, runYearMonth }) => (
                <div
                  key={base}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  {/* Bundle header — status, run id, model count, and the single bundle action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <MlStatusLabel status={status} />
                      <span className="max-w-[280px] truncate font-mono text-xs text-foreground" title={base}>
                        {base}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {formatAdminTimestamp(created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                        {rows.length} model{rows.length !== 1 ? "s" : ""}
                      </span>
                      {action && runYearMonth ? (
                        <button
                          type="button"
                          className={action === "deploy" ? adminPrimaryBtn : adminGhostBtn}
                          disabled={actionLoading === base}
                          onClick={() => void deployBundle(base, runYearMonth)}
                          title={
                            action === "deploy"
                              ? "Deploy both models from this training instance together"
                              : "Reactivate both models from this superseded training instance"
                          }
                        >
                          {actionLoading === base
                            ? action === "deploy"
                              ? "Deploying…"
                              : "Redeploying…"
                            : action === "deploy"
                              ? "Deploy bundle"
                              : "Redeploy bundle"}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Per-model rows inside the bundle (read-only — no per-model actions) */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40">
                        {["Model", "Status", "Accuracy", "Summary"].map((col) => (
                          <th
                            key={col}
                            className="px-4 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-muted-foreground"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-border/30 last:border-b-0 hover:bg-muted/20"
                        >
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="inline-block h-2 w-2 rounded-full bg-primary/60" />
                              <span className="font-mono text-xs font-medium text-foreground">
                                {row.model_type}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <MlStatusLabel status={row.status} />
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                            {row.accuracy ?? "—"}
                          </td>
                          <td className="px-4 py-2.5">
                            <MlRunSummaryCell
                              run={row}
                              onView={() => setSummaryRun(row)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {pages > 1 ? (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Page {page} of {pages} · {total} runs</span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className={adminGhostBtn}>
                  Previous
                </button>
                <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} className={adminGhostBtn}>
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
