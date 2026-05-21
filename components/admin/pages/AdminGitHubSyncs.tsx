"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminGitHubSyncsSkeleton } from "@/components/admin/AdminSkeletons";
import { AdminStatCard } from "@/components/admin/ui/AdminStatCard";
import { adminGhostBtn, adminPage } from "@/components/admin/ui/admin-styles";
import { listAdminUsers } from "@/lib/admin-users-api";
import { getAdminApiErrorMessage } from "@/lib/admin-utils";
import type { AdminUserResponse } from "@/types/admin";

export function AdminGitHubSyncs() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAdminUsers({
        page: 1,
        per_page: 100,
        include_inactive: true,
      });
      setUsers(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const linked = users.filter((u) => u.github_username?.trim());
  const activeLinked = linked.filter((u) => u.is_active);

  return (
    <div className={adminPage}>
      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <AdminGitHubSyncsSkeleton />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-medium text-foreground">GitHub Syncs</h1>
              <p className="text-sm text-muted-foreground">
                Users with a linked GitHub username from the admin user directory. Per-user
                sync jobs are member-scoped; there is no dedicated admin sync API yet.
              </p>
            </div>
            <button type="button" onClick={() => void load()} className={adminGhostBtn}>
              Refresh
            </button>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <AdminStatCard
              label="Linked"
              value={String(linked.length)}
              subtext={`of ${users.length} on this page`}
              valueClassName="text-primary"
            />
            <AdminStatCard
              label="Active + linked"
              value={String(activeLinked.length)}
            />
            <AdminStatCard
              label="Total accounts"
              value={total.toLocaleString()}
              subtext="From admin users API"
            />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["User", "GitHub", "Role", "Status", ""].map((col) => (
                  <th
                    key={col || "action"}
                    className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-muted-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linked.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">
                    No users with github_username in the current page.
                  </td>
                </tr>
              ) : (
                linked.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border/60 odd:bg-card hover:bg-muted/40"
                  >
                    <td className="px-3 py-2">
                      <p className="text-xs text-foreground">{u.full_name || u.email}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-primary">
                      @{u.github_username}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {u.role}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {u.is_active ? (
                        <span className="text-primary">active</span>
                      ) : (
                        <span className="text-muted-foreground">inactive</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href="/admin/directory"
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Directory →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
