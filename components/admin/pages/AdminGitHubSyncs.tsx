"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-white">GitHub Syncs</h1>
          <p className="text-sm text-zinc-500">
            Users with a linked GitHub username from the admin user directory. Per-user
            sync jobs are member-scoped; there is no dedicated admin sync API yet.
          </p>
        </div>
        <button type="button" onClick={() => void load()} className={adminGhostBtn}>
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
          Loading users…
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <AdminStatCard
              label="Linked (sample)"
              value={String(linked.length)}
              subtext={`of ${users.length} on this page`}
              valueClassName="text-emerald-400"
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
              <tr className="border-b border-zinc-800">
                {["User", "GitHub", "Role", "Status", ""].map((col) => (
                  <th
                    key={col || "action"}
                    className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linked.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-zinc-500">
                    No users with github_username in the current page.
                  </td>
                </tr>
              ) : (
                linked.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-zinc-800/50 odd:bg-zinc-900 hover:bg-zinc-800/40"
                  >
                    <td className="px-3 py-2">
                      <p className="text-xs text-white">{u.full_name || u.email}</p>
                      <p className="font-mono text-[10px] text-zinc-500">{u.email}</p>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-emerald-400">
                      @{u.github_username}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                      {u.role}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {u.is_active ? (
                        <span className="text-emerald-400">active</span>
                      ) : (
                        <span className="text-zinc-500">inactive</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href="/admin/directory"
                        className="text-xs text-zinc-400 hover:text-white"
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
