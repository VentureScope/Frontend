"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { UserDirectorySkeleton } from "@/components/admin/AdminSkeletons";
import { toast } from "sonner";
import { AdminDrawer } from "@/components/admin/ui/AdminDrawer";
import { AdminRoleBadge, StatusDot } from "@/components/admin/ui/AdminBadge";
import {
  adminGhostBtn,
  adminInput,
  adminPage,
  adminRedBtn,
} from "@/components/admin/ui/admin-styles";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import {
  DIRECTORY_TABS,
  displayUserName,
  formatAdminRoleLabel,
  getAdminApiErrorMessage,
  parseAdminRole,
  roleBadgeValue,
} from "@/lib/admin-utils";
import type { AdminUserResponse, AdminUserRole } from "@/types/admin";

const ROLE_OPTIONS: { value: AdminUserRole; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Professional" },
  { value: "b2b_client", label: "B2B Client" },
];

export function UserDirectory() {
  const {
    users,
    total,
    page,
    pages,
    setPage,
    tab,
    setTab,
    search,
    setSearch,
    loading,
    error,
    actionLoading,
    reload,
    patchUser,
    deactivateUser,
    reactivateUser,
  } = useAdminUsers();

  const [selected, setSelected] = useState<AdminUserResponse | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [drawerRole, setDrawerRole] = useState<AdminUserRole>("professional");
  const [drawerIsAdmin, setDrawerIsAdmin] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setDrawerRole(parseAdminRole(selected.role) ?? "professional");
    setDrawerIsAdmin(selected.is_admin);
    setConfirmDeactivate(false);
  }, [selected]);

  async function handleSaveRole() {
    if (!selected) return;
    try {
      const updated = await patchUser(selected.id, {
        is_admin: drawerIsAdmin,
        ...(drawerIsAdmin ? {} : { role: drawerRole }),
      });
      setSelected(updated);
      toast.success("User updated");
    } catch (err) {
      toast.error(getAdminApiErrorMessage(err));
    }
  }

  async function handleToggleActive() {
    if (!selected) return;
    try {
      if (selected.is_active) {
        const updated = await patchUser(selected.id, { is_active: false });
        setSelected(updated);
        toast.success("Account deactivated");
      } else {
        const updated = await reactivateUser(selected.id);
        setSelected(updated);
        toast.success("Account reactivated");
      }
      await reload();
    } catch (err) {
      toast.error(getAdminApiErrorMessage(err));
    }
  }

  async function handleHardDelete() {
    if (!selected) return;
    try {
      await deactivateUser(selected.id, true);
      toast.success("User permanently deleted");
      setSelected(null);
    } catch (err) {
      toast.error(getAdminApiErrorMessage(err));
    }
  }

  return (
    <div className={adminPage}>
      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
          <button
            type="button"
            onClick={() => void reload()}
            className="ml-3 text-xs underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {loading ? (
        <UserDirectorySkeleton />
      ) : (
      <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-medium text-foreground">User Directory</h1>
          <span className="rounded-sm bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {total.toLocaleString()} users
          </span>
        </div>
        <input
          type="search"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${adminInput} w-56 text-xs`}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-border">
        {DIRECTORY_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-3 py-2 text-xs transition-colors ${
              tab === t.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative overflow-x-auto border border-border">
        {users.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No users match this view.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["User", "Role", "Status", "MFA", "OAuth", ""].map((col) => (
                  <th
                    key={col || "actions"}
                    className="px-3 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-muted-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelected(user)}
                  className="cursor-pointer border-b border-border/60 odd:bg-card transition-colors hover:bg-muted/40"
                >
                  <td className="px-3 py-3">
                    <p className="text-sm text-foreground">{displayUserName(user)}</p>
                    <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-3 py-2">
                    <AdminRoleBadge>{roleBadgeValue(user)}</AdminRoleBadge>
                  </td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <StatusDot tone={user.is_active ? "emerald" : "amber"} />
                      {user.is_active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {user.mfa_enabled ? (
                      <span className="text-primary">on</span>
                    ) : (
                      "off"
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {user.oauth_provider ?? "email"}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Actions"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && !search.trim() ? (
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className={`${adminGhostBtn} flex items-center gap-1 disabled:opacity-40`}
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              type="button"
              disabled={page >= pages || loading}
              onClick={() => setPage(page + 1)}
              className={`${adminGhostBtn} flex items-center gap-1 disabled:opacity-40`}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : null}

      {search.trim() ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Search filters users loaded from the current API page (up to 100).
        </p>
      ) : null}
      </>
      )}

      <AdminDrawer
        open={!!selected}
        title={selected ? displayUserName(selected) : "User"}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4 text-sm">
            <section className="border-b border-border pb-4">
              <p className="mb-2 text-label text-muted-foreground">
                Identity
              </p>
              <p className="font-mono text-xs text-muted-foreground">ID: {selected.id}</p>
              <p className="mt-1 text-foreground">{selected.email}</p>
              {selected.github_username ? (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  GitHub @{selected.github_username}
                </p>
              ) : null}
            </section>

            <section className="border-b border-border pb-4">
              <p className="mb-2 text-label text-muted-foreground">
                Role & access
              </p>
              <label className="mb-3 flex items-center gap-2 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={drawerIsAdmin}
                  disabled={actionLoading}
                  onChange={(e) => setDrawerIsAdmin(e.target.checked)}
                  className="rounded border-border"
                />
                Platform administrator
              </label>
              {!drawerIsAdmin ? (
                <select
                  value={drawerRole}
                  disabled={actionLoading}
                  onChange={(e) =>
                    setDrawerRole(e.target.value as AdminUserRole)
                  }
                  className={`${adminInput} w-full text-xs`}
                >
                  {ROLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : null}
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void handleSaveRole()}
                className={`${adminGhostBtn} mt-3 w-full`}
              >
                {actionLoading ? "Saving…" : "Save role"}
              </button>
            </section>

            <section className="border-b border-border pb-4">
              <p className="mb-2 text-label text-muted-foreground">
                Account status
              </p>
              <p className="text-foreground">
                {selected.is_active ? "Active" : "Deactivated"} ·{" "}
                {formatAdminRoleLabel(selected.role, selected.is_admin)}
              </p>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void handleToggleActive()}
                className={`${adminGhostBtn} mt-3 w-full`}
              >
                {selected.is_active ? "Deactivate account" : "Reactivate account"}
              </button>
            </section>

            <section>
              <p className="mb-2 text-label text-muted-foreground">
                Danger zone
              </p>
              {confirmDeactivate ? (
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>Permanently delete this user? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => void handleHardDelete()}
                      className={adminRedBtn}
                    >
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeactivate(false)}
                      className={adminGhostBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDeactivate(true)}
                  className={adminRedBtn}
                >
                  Hard delete user
                </button>
              )}
            </section>
          </div>
        ) : null}
      </AdminDrawer>
    </div>
  );
}
