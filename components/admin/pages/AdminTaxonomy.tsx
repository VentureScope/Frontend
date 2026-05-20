"use client";

import { Loader2 } from "lucide-react";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import {
  adminEmeraldBtn,
  adminGhostBtn,
  adminPage,
  adminRedBtn,
} from "@/components/admin/ui/admin-styles";
import { useAdminTaxonomy } from "@/hooks/useAdminTaxonomy";
import { formatAdminTimestamp } from "@/lib/admin-response-parsers";

const STATUS_TABS = [
  { id: "pending" as const, label: "Pending" },
  { id: "accepted" as const, label: "Accepted" },
  { id: "declined" as const, label: "Declined" },
  { id: "all" as const, label: "All" },
];

export function AdminTaxonomy() {
  const {
    unmatched,
    unmatchedTotal,
    canonical,
    canonicalTotal,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    patchingId,
    patchRole,
    reload,
  } = useAdminTaxonomy();

  return (
    <div className={adminPage}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-white">Role Taxonomy</h1>
          <p className="text-sm text-zinc-500">
            Review unmatched job titles and canonical roles from admin taxonomy APIs.
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

      <div className="mb-4 grid grid-cols-2 gap-3">
        <AdminStatCard
          label="Unmatched (filter)"
          value={unmatchedTotal.toLocaleString()}
        />
        <AdminStatCard
          label="Canonical roles"
          value={canonicalTotal.toLocaleString()}
          valueClassName="text-emerald-400"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`rounded-md border px-3 py-1 text-xs ${
              statusFilter === tab.id
                ? "border-emerald-800 text-emerald-400"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading taxonomy…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-zinc-800 bg-zinc-900">
            <p className="border-b border-zinc-800 px-4 py-2 text-sm font-medium text-white">
              Unmatched titles
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Title", "Occurrences", "Status", "Actions"].map((col) => (
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
                {unmatched.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-zinc-500">
                      No unmatched roles for this filter.
                    </td>
                  </tr>
                ) : (
                  unmatched.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-800/50 odd:bg-zinc-950"
                    >
                      <td className="px-3 py-2">
                        <p className="text-xs text-white">{row.cleaned_title}</p>
                        <p className="truncate font-mono text-[10px] text-zinc-500">
                          {row.raw_title}
                        </p>
                        <p className="text-[10px] text-zinc-600">
                          {formatAdminTimestamp(row.first_seen_at)}
                        </p>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                        {row.occurrences}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                        {row.status}
                      </td>
                      <td className="px-3 py-2">
                        {row.status === "pending" ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={patchingId === row.id}
                              onClick={() => void patchRole(row.id, "accepted")}
                              className={adminEmeraldBtn}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              disabled={patchingId === row.id}
                              onClick={() => void patchRole(row.id, "declined")}
                              className={adminRedBtn}
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border border-zinc-800 bg-zinc-900">
            <p className="border-b border-zinc-800 px-4 py-2 text-sm font-medium text-white">
              Canonical roles
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Title", "Added"].map((col) => (
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
                {canonical.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-8 text-center text-zinc-500">
                      No canonical roles returned.
                    </td>
                  </tr>
                ) : (
                  canonical.slice(0, 50).map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-800/50 odd:bg-zinc-950"
                    >
                      <td className="px-3 py-2 text-xs text-zinc-200">
                        {row.canonical_title}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-zinc-500">
                        {formatAdminTimestamp(row.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
