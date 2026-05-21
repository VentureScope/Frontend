"use client";

import { AdminTaxonomySkeleton } from "@/components/admin/AdminSkeletons";
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
      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <AdminTaxonomySkeleton />
      ) : (
      <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-foreground">Role Taxonomy</h1>
          <p className="text-sm text-muted-foreground">
            Review unmatched job titles and canonical roles from admin taxonomy APIs.
          </p>
        </div>
        <button type="button" onClick={() => void reload()} className={adminGhostBtn}>
          Refresh
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <AdminStatCard
          label="Unmatched (filter)"
          value={unmatchedTotal.toLocaleString()}
        />
        <AdminStatCard
          label="Canonical roles"
          value={canonicalTotal.toLocaleString()}
          valueClassName="text-primary"
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
                ? "border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border bg-card">
            <p className="border-b border-border px-4 py-2 text-sm font-medium text-foreground">
              Unmatched titles
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Title", "Occurrences", "Status", "Actions"].map((col) => (
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
                {unmatched.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                      No unmatched roles for this filter.
                    </td>
                  </tr>
                ) : (
                  unmatched.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/60 odd:bg-muted/30"
                    >
                      <td className="px-3 py-2">
                        <p className="text-xs text-foreground">{row.cleaned_title}</p>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          {row.raw_title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatAdminTimestamp(row.first_seen_at)}
                        </p>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {row.occurrences}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
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
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border border-border bg-card">
            <p className="border-b border-border px-4 py-2 text-sm font-medium text-foreground">
              Canonical roles
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Title", "Added"].map((col) => (
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
                {canonical.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-8 text-center text-muted-foreground">
                      No canonical roles returned.
                    </td>
                  </tr>
                ) : (
                  canonical.slice(0, 50).map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/60 odd:bg-muted/30"
                    >
                      <td className="px-3 py-2 text-xs text-foreground">
                        {row.canonical_title}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {formatAdminTimestamp(row.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}
    </div>
  );
}
