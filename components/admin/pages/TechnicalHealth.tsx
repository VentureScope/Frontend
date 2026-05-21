"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { DagStatusLabel } from "@/components/admin/ui/admin-status";
import {
  adminErrorBanner,
  adminGhostBtn,
  adminLoading,
  adminPage,
  adminPageDesc,
  adminPageTitle,
  adminSection,
  adminSectionLabel,
  adminTableRow,
  adminTableTh,
} from "@/components/admin/ui/admin-styles";
import { SelectField } from "@/components/ui/select-field";
import { useAdminSystemHealth } from "@/hooks/useAdminSystemHealth";

function formatBytesLabel(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const CHART_GRID = "var(--border)";
const CHART_TICK = "var(--muted-foreground)";
const CHART_SUCCESS = "var(--chart-1)";
const CHART_FAILED = "var(--destructive)";

export function TechnicalHealth() {
  const { dags, pipelineRuns, storage, sentry, loading, error, reload } =
    useAdminSystemHealth(7);
  const [storageBucketKey, setStorageBucketKey] = useState("0");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#storage") return;
    const el = document.getElementById("storage");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  const bucketOptions = useMemo(
    () =>
      (storage?.buckets ?? []).map((b, i) => ({
        value: String(i),
        label: b.label,
      })),
    [storage?.buckets],
  );

  useEffect(() => {
    if (bucketOptions.length === 0) {
      setStorageBucketKey("0");
      return;
    }
    const idx = Number(storageBucketKey);
    if (Number.isNaN(idx) || idx >= bucketOptions.length) {
      setStorageBucketKey("0");
    }
  }, [bucketOptions, storageBucketKey]);

  const storageBucketIdx = Math.min(
    Number(storageBucketKey) || 0,
    Math.max(0, (storage?.buckets.length ?? 1) - 1),
  );
  const activeBucket = storage?.buckets[storageBucketIdx] ?? null;
  const files = activeBucket?.files ?? [];

  return (
    <div className={adminPage}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={adminPageTitle}>Technical Health</h1>
          <p className={adminPageDesc}>
            Pipeline, object storage, and Sentry from admin system APIs.
          </p>
        </div>
        <button type="button" onClick={() => void reload()} className={adminGhostBtn}>
          Refresh
        </button>
      </div>

      {error ? <div className={adminErrorBanner}>{error}</div> : null}

      {loading ? (
        <div className={adminLoading}>
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading system health…
        </div>
      ) : (
        <>
          <section className={`${adminSection} mb-6`}>
            <p className={`mb-3 ${adminSectionLabel}`}>DAG pipeline status</p>
            {dags.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pipeline status returned.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["DAG", "Last run", "Status", "Duration", ""].map((col) => (
                      <th key={col || "link"} className={adminTableTh}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dags.map((dag) => (
                    <tr key={dag.name} className={adminTableRow}>
                      <td className="px-3 py-2 font-mono text-xs text-foreground">
                        {dag.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {dag.lastRun}
                      </td>
                      <td className="px-3 py-2">
                        <DagStatusLabel status={dag.status} />
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {dag.duration}
                      </td>
                      <td className="px-3 py-2">
                        {dag.airflowUrl ? (
                          <a
                            href={dag.airflowUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Airflow ↗
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {pipelineRuns && pipelineRuns.chartPoints.length > 0 ? (
            <section className={`${adminSection} mb-6`}>
              <p className={`mb-3 ${adminSectionLabel}`}>ETL run history (7 days)</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineRuns.chartPoints}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: CHART_TICK, fontSize: 10 }}
                    />
                    <YAxis
                      tick={{ fill: CHART_TICK, fontSize: 10 }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        fontSize: 12,
                        color: "var(--foreground)",
                      }}
                    />
                    <Bar
                      dataKey="success"
                      stackId="a"
                      fill={CHART_SUCCESS}
                      name="Success"
                    />
                    <Bar
                      dataKey="failed"
                      stackId="a"
                      fill={CHART_FAILED}
                      name="Failed"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {pipelineRuns.taskDurations.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-muted-foreground">
                    Latest run task durations
                  </p>
                  <ul className="space-y-1 font-mono text-xs text-muted-foreground">
                    {pipelineRuns.taskDurations.slice(0, 8).map((t) => (
                      <li key={t.task} className="flex justify-between gap-4">
                        <span>{t.task}</span>
                        <span>{t.durationSec}s</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          <section id="storage" className={`${adminSection} mb-6`}>
            <p className={`mb-3 ${adminSectionLabel}`}>Model storage (DO Spaces)</p>
            {!storage || storage.buckets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Storage health unavailable or not configured.
              </p>
            ) : (
              <>
                {storage.totalBytes != null ? (
                  <p className="mb-4 font-mono text-xs text-muted-foreground">
                    Total: {formatBytesLabel(storage.totalBytes)}
                  </p>
                ) : null}
                <div className="mb-4 max-w-md">
                  <SelectField
                    label="Storage bucket"
                    value={storageBucketKey}
                    onChange={setStorageBucketKey}
                    options={bucketOptions}
                    hint={
                      activeBucket?.lastModified
                        ? `Last modified: ${activeBucket.lastModified}`
                        : undefined
                    }
                  />
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["File", "Size", "Modified", ""].map((col) => (
                        <th key={col || "url"} className={adminTableTh}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {files.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-xs text-muted-foreground"
                        >
                          No files in this bucket.
                        </td>
                      </tr>
                    ) : (
                      files.map((file) => (
                        <tr key={file.name} className={adminTableRow}>
                          <td className="px-3 py-2 font-mono text-xs text-foreground">
                            {file.name}
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">
                            {file.size}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {file.modified}
                          </td>
                          <td className="px-3 py-2">
                            {file.url ? (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                Open ↗
                              </a>
                            ) : null}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </section>

          <section className={adminSection}>
            <p className={`mb-3 ${adminSectionLabel}`}>Sentry</p>
            {!sentry ? (
              <p className="text-sm text-muted-foreground">
                Sentry summary unavailable.
              </p>
            ) : (
              <>
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <AdminStatCard
                    label="Unresolved (24h)"
                    value={String(sentry.unresolved24h)}
                  />
                  <AdminStatCard label="Trend" value={sentry.trendDelta} />
                  <AdminStatCard
                    label="Backend p95"
                    value={String(sentry.p95LatencyMs)}
                  />
                  <AdminStatCard label="Apdex" value={String(sentry.apdex)} />
                </div>

                {sentry.sparkline.length > 0 ? (
                  <div className="mb-4 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentry.sparkline}>
                        <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: CHART_TICK, fontSize: 10 }}
                        />
                        <YAxis tick={{ fill: CHART_TICK, fontSize: 10 }} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke={CHART_SUCCESS}
                          dot={false}
                          name="Events"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : null}

                {sentry.topIssues.length > 0 ? (
                  <table className="mb-4 w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["Issue", "Service", "Seen", "Last", ""].map((col) => (
                          <th key={col || "link"} className={adminTableTh}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sentry.topIssues.map((issue) => (
                        <tr
                          key={`${issue.title}-${issue.url}`}
                          className={adminTableRow}
                        >
                          <td className="px-3 py-2 text-xs text-foreground">
                            {issue.title}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {issue.service}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {issue.timesSeen}
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">
                            {issue.lastSeen}
                          </td>
                          <td className="px-3 py-2">
                            <a
                              href={issue.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              sentry.io ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mb-4 text-sm text-muted-foreground">
                    No top issues returned.
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-xs">
                  {sentry.links.issues ? (
                    <a
                      href={sentry.links.issues}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Open issues ↗
                    </a>
                  ) : null}
                  {sentry.links.performance ? (
                    <a
                      href={sentry.links.performance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Performance ↗
                    </a>
                  ) : null}
                  {sentry.links.alerts ? (
                    <a
                      href={sentry.links.alerts}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Alerts ↗
                    </a>
                  ) : null}
                </div>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
