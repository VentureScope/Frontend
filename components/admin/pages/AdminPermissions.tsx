"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { AdminRoleBadge, StatusDot } from "@/components/admin/ui/AdminBadge";
import {
  adminGhostBtn,
  adminInput,
  adminPage,
  adminRedBtn,
} from "@/components/admin/ui/admin-styles";
import { listAdminUsers, updateAdminUser } from "@/lib/admin-users-api";
import {
  displayUserName,
  getAdminApiErrorMessage,
  roleBadgeValue,
} from "@/lib/admin-utils";
import type { AdminUserResponse } from "@/types/admin";

export function AdminPermissions() {
  const [admins, setAdmins] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAdminUsers({
        page: 1,
        per_page: 100,
        include_inactive: true,
      });
      setAdmins(res.items.filter((u) => u.is_admin));
    } catch (err) {
      setError(getAdminApiErrorMessage(err));
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = admins.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      (u.full_name?.toLowerCase().includes(q) ?? false)
    );
  });

  async function revokeAdmin(user: AdminUserResponse) {
    setActionLoading(user.id);
    try {
      await updateAdminUser(user.id, { is_admin: false });
      toast.success(`${displayUserName(user)} is no longer an admin`);
      await load();
    } catch (err) {
      toast.error(getAdminApiErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className={adminPage}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h1 className="text-lg font-medium text-white">Permissions</h1>
          </div>
          <p className="max-w-xl text-sm text-zinc-500">
            Platform administrators can access this console. Grant or revoke admin
            access from the{" "}
            <Link href="/admin/directory" className="text-emerald-400 hover:underline">
              user directory
            </Link>
            .
          </p>
        </div>
        <Link href="/admin/directory" className={adminGhostBtn}>
          Open directory →
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <input
          type="search"
          placeholder="Filter admins…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${adminInput} w-56 text-xs`}
        />
        <span className="font-mono text-xs text-zinc-500">
          {loading ? "…" : `${filtered.length} administrator${filtered.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
          <button type="button" onClick={() => void load()} className="ml-3 underline">
            Retry
          </button>
        </div>
      ) : null}

      <div className="border border-zinc-800">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading administrators…
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-500">
            No administrators found. Promote a user in the directory.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950">
                {["User", "Role", "Status", "Actions"].map((col) => (
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
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-zinc-800/50 odd:bg-zinc-900"
                >
                  <td className="px-3 py-3">
                    <p className="text-white">{displayUserName(user)}</p>
                    <p className="font-mono text-xs text-zinc-500">{user.email}</p>
                  </td>
                  <td className="px-3 py-2">
                    <AdminRoleBadge>{roleBadgeValue(user)}</AdminRoleBadge>
                  </td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <StatusDot tone={user.is_active ? "emerald" : "amber"} />
                      {user.is_active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/admin/directory"
                        className={adminGhostBtn}
                      >
                        Manage
                      </Link>
                      <button
                        type="button"
                        disabled={actionLoading === user.id}
                        onClick={() => void revokeAdmin(user)}
                        className={adminRedBtn}
                      >
                        {actionLoading === user.id ? "…" : "Revoke admin"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
