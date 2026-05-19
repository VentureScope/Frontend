"use client";

import { useState } from "react";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import {
  adminGhostBtn,
  adminPage,
  adminRedBtn,
} from "@/components/admin/ui/admin-styles";
import { EMBEDDING_ERROR_FREQ, EMBEDDING_ROWS } from "@/lib/admin-mock-data";

export function EmbeddingsMonitor() {
  const [live, setLive] = useState(true);
  const [errorsOpen, setErrorsOpen] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  return (
    <div className={adminPage}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-medium text-white">Embedding Monitor</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLive((v) => !v)}
            className={`rounded-md border px-3 py-1 text-xs ${
              live
                ? "border-emerald-800 text-emerald-400"
                : "border-zinc-700 text-zinc-500"
            }`}
          >
            ● Live
          </button>
          <button type="button" className={adminRedBtn}>
            Retry All Failed
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <AdminStatCard label="Total Indexed" value="2,813" valueClassName="text-emerald-400" />
        <AdminStatCard
          label="Pending"
          value="34"
          valueClassName="text-amber-400"
          subtext="Processing…"
          subtextClassName="text-amber-400"
        />
        <AdminStatCard
          label="Failed"
          value="12"
          valueClassName="text-red-400"
          subtext="Retry All"
          subtextClassName="text-red-400"
        />
      </div>

      <table className="mb-4 w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            {["User", "Status", "Last Attempted", "Error", "Action"].map((col) => (
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
          {EMBEDDING_ROWS.map((row) => (
            <tr
              key={row.id}
              className="border-b border-zinc-800/50 odd:bg-zinc-900 hover:bg-zinc-800/40"
            >
              <td className="px-3 py-2 font-mono text-xs text-zinc-300">{row.user}</td>
              <td className="px-3 py-2 font-mono text-xs">
                {row.status === "failed" ? (
                  <span className="text-red-400">✗ failed</span>
                ) : (
                  <span className="text-amber-400">● pending</span>
                )}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                {row.lastAttempted}
              </td>
              <td
                className="max-w-[200px] truncate px-3 py-2 font-mono text-xs text-zinc-400"
                title={row.error}
              >
                {row.error}
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  className={adminGhostBtn}
                  disabled={retrying === row.id}
                  onClick={() => {
                    setRetrying(row.id);
                    setTimeout(() => setRetrying(null), 1200);
                  }}
                >
                  {retrying === row.id ? "…" : row.status === "pending" ? "Cancel" : "Retry"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border border-zinc-800 bg-zinc-900">
        <button
          type="button"
          onClick={() => setErrorsOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-2 text-sm text-white"
        >
          Error Frequency
          <span className="text-zinc-500">{errorsOpen ? "▾" : "▸"}</span>
        </button>
        {errorsOpen && (
          <div className="border-t border-zinc-800 px-4 py-3">
            {EMBEDDING_ERROR_FREQ.map((e) => (
              <div key={e.type} className="flex items-center gap-3 py-1 text-xs">
                <span className="w-40 truncate text-right font-mono text-zinc-500">
                  {e.type}
                </span>
                <div className="h-1.5 flex-1 rounded-sm bg-zinc-800">
                  <div
                    className="h-1.5 rounded-sm bg-red-400"
                    style={{ width: `${e.pct}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-zinc-400">{e.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
