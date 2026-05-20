"use client";

import { useState } from "react";
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
import { adminGhostBtn, adminPage } from "@/components/admin/ui/admin-styles";
import { useAdminSystemHealth } from "@/hooks/useAdminSystemHealth";
import type { DagRunStatus } from "@/types/admin-system";

function dagStatusLabel(status: DagRunStatus) {
  switch (status) {
    case "success":
      return <span className="font-mono text-xs text-emerald-400">✓ success</span>;
    case "failed":
      return <span className="font-mono text-xs text-red-400">✗ failed</span>;
    case "running":
      return <span className="font-mono text-xs text-amber-400">● running</span>;
    default:
      return <span className="font-mono text-xs text-zinc-500">— unknown</span>;
  }
}

function formatBytesLabel(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function TechnicalHealth() {
  const { dags, pipelineRuns, storage, sentry, loading, error, reload } =
    useAdminSystemHealth(7);
  const [storageBucketIdx, setStorageBucketIdx] = useState(0);

  const activeBucket = storage?.buckets[storageBucketIdx] ?? null;
  const files = activeBucket?.files ?? [];

  return (
    <div className={adminPage}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-white">Technical Health</h1>
          <p className="text-sm text-zinc-500">
            Pipeline, object storage, and Sentry from admin system APIs.
          </p>
        </div>
        <button type="button" onClick={() => void reload()} className={adminGhostBtn}>
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading system health…
        </div>
      ) : (
        <>
          <section className="mb-6 border border-zinc-800 bg-zinc-900 p-4">
            <p className="mb-3 text-[10px] uppercase tracking-widest text-zinc-600">
              DAG pipeline status
            </p>
            {dags.length === 0 ? (
              <p className="text-sm text-zinc-500">No pipeline status returned.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["DAG", "Last run", "Status", "Duration", ""].map((col) => (
                      <th
                        key={col || "link"}
                        className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dags.map((dag) => (
                    <tr
                      key={dag.name}
                      className="border-b border-zinc-800/50 odd:bg-zinc-950"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-zinc-300">
                        {dag.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                        {dag.lastRun}
                      </td>
                      <td className="px-3 py-2">{dagStatusLabel(dag.status)}</td>
                      <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                        {dag.duration}
                      </td>
                      <td className="px-3 py-2">
                        {dag.airflowUrl ? (
                          <a
                            href={dag.airflowUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-400 hover:text-white"
                          >
                            Airflow ↗
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {pipelineRuns && pipelineRuns.chartPoints.length > 0 ? (
            <section className="mb-6 border border-zinc-800 bg-zinc-900 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-zinc-600">
                ETL run history (7 days)
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineRuns.chartPoints}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#71717a", fontSize: 10 }}
                    />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#18181b",
                        border: "1px solid #3f3f46",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="success" stackId="a" fill="#34d399" name="Success" />
                    <Bar dataKey="failed" stackId="a" fill="#f87171" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {pipelineRuns.taskDurations.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-zinc-500">Latest run task durations</p>
                  <ul className="space-y-1 font-mono text-xs text-zinc-400">
                    {pipelineRuns.taskDurations.slice(0, 8).map((t) => (
                      <li key={t.task} className="flex justify-between">
                        <span>{t.task}</span>
                        <span>{t.durationSec}s</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          <section id="storage" className="mb-6 border border-zinc-800 bg-zinc-900 p-4">
            <p className="mb-3 text-[10px] uppercase tracking-widest text-zinc-600">
              Model storage (DO Spaces)
            </p>
            {!storage || storage.buckets.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Storage health unavailable or not configured.
              </p>
            ) : (
              <>
                {storage.totalBytes != null ? (
                  <p className="mb-3 font-mono text-xs text-zinc-400">
                    Total: {formatBytesLabel(storage.totalBytes)}
                  </p>
                ) : null}
                <div className="flex gap-4">
                  <ul className="w-[200px] shrink-0 space-y-1 text-xs">
                    {storage.buckets.map((b, i) => (
                      <li key={b.label}>
                        <button
                          type="button"
                          onClick={() => setStorageBucketIdx(i)}
                          className={`w-full cursor-pointer px-2 py-1 text-left ${
                            storageBucketIdx === i
                              ? "bg-zinc-800 text-white"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {b.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <table className="min-w-0 flex-1 text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        {["File", "Size", "Modified", ""].map((col) => (
                          <th
                            key={col || "url"}
                            className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                          >
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
                            className="px-3 py-6 text-center text-xs text-zinc-500"
                          >
                            No files in this bucket.
                          </td>
                        </tr>
                      ) : (
                        files.map((file) => (
                          <tr key={file.name} className="border-b border-zinc-800/50">
                            <td className="px-3 py-2 font-mono text-xs text-zinc-300">
                              {file.name}
                            </td>
                            <td className="px-3 py-2 text-xs text-zinc-400">
                              {file.size}
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                              {file.modified}
                            </td>
                            <td className="px-3 py-2">
                              {file.url ? (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-zinc-400 hover:text-white"
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
                </div>
              </>
            )}
          </section>

          <section className="border border-zinc-800 bg-zinc-900 p-4">
            <p className="mb-3 text-[10px] uppercase tracking-widest text-zinc-600">
              Sentry
            </p>
            {!sentry ? (
              <p className="text-sm text-zinc-500">Sentry summary unavailable.</p>
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
                        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#34d399"
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
                      <tr className="border-b border-zinc-800">
                        {["Issue", "Service", "Seen", "Last", ""].map((col) => (
                          <th
                            key={col || "link"}
                            className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sentry.topIssues.map((issue) => (
                        <tr
                          key={`${issue.title}-${issue.url}`}
                          className="border-b border-zinc-800/50"
                        >
                          <td className="px-3 py-2 text-xs text-zinc-300">
                            {issue.title}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-zinc-500">
                            {issue.service}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                            {issue.timesSeen}
                          </td>
                          <td className="px-3 py-2 text-xs text-zinc-400">
                            {issue.lastSeen}
                          </td>
                          <td className="px-3 py-2">
                            <a
                              href={issue.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-zinc-400 hover:text-white"
                            >
                              sentry.io ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mb-4 text-sm text-zinc-500">No top issues returned.</p>
                )}

                <div className="flex flex-wrap gap-4 text-xs">
                  {sentry.links.issues ? (
                    <a
                      href={sentry.links.issues}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white"
                    >
                      Open issues ↗
                    </a>
                  ) : null}
                  {sentry.links.performance ? (
                    <a
                      href={sentry.links.performance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white"
                    >
                      Performance ↗
                    </a>
                  ) : null}
                  {sentry.links.alerts ? (
                    <a
                      href={sentry.links.alerts}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white"
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
