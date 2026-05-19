"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { adminGhostBtn, adminPage } from "@/components/admin/ui/admin-styles";
import {
  SENTRY_ISSUES,
  SENTRY_SPARKLINE,
  STORAGE_FILES,
  WORKER_ROWS,
} from "@/lib/admin-mock-data";

const FOLDERS = ["/profiles/", "/cvs/", "/transcripts/", "/exports/"];

export function TechnicalHealth() {
  const [folder, setFolder] = useState("/profiles/");
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div className={adminPage}>
      <section className="mb-6">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-600">
          Worker Status
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Worker", "Status", "Queue Depth", "Last Heartbeat", "Tasks/min"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {WORKER_ROWS.map((w) => (
              <tr
                key={w.worker}
                className={`border-b border-zinc-800/50 odd:bg-zinc-900 ${
                  w.status === "offline" ? "text-zinc-500" : ""
                }`}
              >
                <td className="px-3 py-2 font-mono text-xs">{w.worker}</td>
                <td className="px-3 py-2 font-mono text-xs">
                  {w.status === "online" ? (
                    <span className="text-emerald-400">● online</span>
                  ) : (
                    <span className="text-red-400">✗ offline</span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono text-xs">{w.queueDepth}</td>
                <td className="px-3 py-2 font-mono text-xs">{w.heartbeat}</td>
                <td className="px-3 py-2 font-mono text-xs">{w.tasksPerMin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6 border border-zinc-800 bg-zinc-900 p-4">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-zinc-600">
          pgvector Index Health
        </p>
        <div className="grid grid-cols-3 gap-4 text-xs">
          {[
            ["Total vectors", "2,813,441"],
            ["Index size", "1.2 GB"],
            ["Dimensions", "1,536"],
            ["Avg query", "18ms"],
            ["Last VACUUM", "2h ago"],
            ["Index type", "ivfflat"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-zinc-500">{label}</p>
              <p className="font-mono text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" className={adminGhostBtn}>
            Run VACUUM
          </button>
          <button type="button" className={adminGhostBtn}>
            View Index Stats
          </button>
        </div>
      </section>

      <section id="storage" className="mb-6 border border-zinc-800 bg-zinc-900 p-4">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-zinc-600">
          Storage Browser
        </p>
        <div className="flex gap-4">
          <ul className="w-[180px] shrink-0 space-y-1 text-xs">
            {FOLDERS.map((f) => (
              <li key={f}>
                <button
                  type="button"
                  onClick={() => setFolder(f)}
                  className={`w-full cursor-pointer px-2 py-1 text-left ${
                    folder === f
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
          <table className="min-w-0 flex-1 text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Name", "Size", "Last Modified", ""].map((col) => (
                  <th
                    key={col || "copy"}
                    className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STORAGE_FILES.map((file) => (
                <tr key={file.name} className="border-b border-zinc-800/50">
                  <td className="px-3 py-2 font-mono text-xs text-zinc-300">
                    {file.name}
                  </td>
                  <td className="px-3 py-2 text-xs text-zinc-400">{file.size}</td>
                  <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                    {file.modified}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                      onClick={() => {
                        setCopied(file.name);
                        setTimeout(() => setCopied(null), 2000);
                      }}
                    >
                      {copied === file.name ? "✓ Copied" : "Copy URL"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-zinc-800 bg-zinc-900 p-4">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-zinc-600">Sentry</p>
        <div className="mb-4 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SENTRY_SPARKLINE}>
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} />
              <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
              <Line type="monotone" dataKey="backend" stroke="#34d399" dot={false} />
              <Line type="monotone" dataKey="airflow" stroke="#fbbf24" dot={false} />
              <Line type="monotone" dataKey="frontend" stroke="#f87171" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <AdminStatCard label="Backend p95" value="142ms" />
          <AdminStatCard label="Slow Airflow tasks" value="3" valueClassName="text-amber-400" />
          <AdminStatCard label="Apdex" value="0.94" valueClassName="text-emerald-400" />
        </div>

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
            {SENTRY_ISSUES.map((issue) => (
              <tr key={issue.title} className="border-b border-zinc-800/50">
                <td className="px-3 py-2 text-xs text-zinc-300">{issue.title}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-500">
                  {issue.service}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                  {issue.timesSeen}
                </td>
                <td className="px-3 py-2 text-xs text-zinc-400">{issue.lastSeen}</td>
                <td className="px-3 py-2">
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    → sentry.io
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Open Issues ↗
          </a>
          <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Open Performance ↗
          </a>
          <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Open Alerts ↗
          </a>
          <a
            href="https://grafana.internal.venturescope.tech"
            target="_blank"
            rel="noopener noreferrer"
            className={`${adminGhostBtn} ml-auto`}
          >
            → Open Grafana
          </a>
        </div>
      </section>
    </div>
  );
}
