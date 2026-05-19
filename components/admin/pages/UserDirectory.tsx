"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { AdminDrawer } from "@/components/admin/ui/AdminDrawer";
import { AdminRoleBadge, StatusDot } from "@/components/admin/ui/AdminBadge";
import {
  adminEmeraldBtn,
  adminGhostBtn,
  adminInput,
  adminPage,
  adminRedBtn,
} from "@/components/admin/ui/admin-styles";
import { DIRECTORY_USERS, type DirectoryUser } from "@/lib/admin-mock-data";

const TABS = ["All", "Students", "Professionals", "B2B Clients", "Admins", "Unverified"] as const;

export function UserDirectory() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DirectoryUser | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const filtered = useMemo(() => {
    let list = DIRECTORY_USERS;
    if (tab !== "All") {
      list = list.filter((u) => {
        if (tab === "Admins") return u.role === "Admin";
        if (tab === "Unverified") return !u.verified;
        return u.role === tab.slice(0, -1) || u.role === tab;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    return list;
  }, [tab, search]);

  return (
    <div className={adminPage}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-medium text-white">User Directory</h1>
          <span className="rounded-sm bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400">
            2,847 users
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${adminInput} w-48 text-xs`}
          />
          <button type="button" className={adminEmeraldBtn}>
            + Invite User
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-1 border-b border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-3 py-2 text-xs transition-colors ${
              tab === t
                ? "border-emerald-400 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            {[
              "User",
              "Role",
              "Status",
              "Verified",
              "Joined",
              "Last Active",
              "",
            ].map((col) => (
              <th
                key={col || "actions"}
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
              onClick={() => setSelected(user)}
              className="cursor-pointer border-b border-zinc-800/50 odd:bg-zinc-900 transition-colors hover:bg-zinc-800/40"
            >
              <td className="px-3 py-3">
                <p className="text-sm text-white">{user.name}</p>
                <p className="font-mono text-xs text-zinc-500">{user.email}</p>
              </td>
              <td className="px-3 py-2">
                <AdminRoleBadge>{user.role}</AdminRoleBadge>
              </td>
              <td className="px-3 py-2">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <StatusDot tone={user.status === "active" ? "emerald" : "zinc"} />
                  {user.status}
                </span>
              </td>
              <td className="px-3 py-2 font-mono text-xs">
                {user.verified ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-amber-400">✗ pending</span>
                )}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-zinc-400">{user.joined}</td>
              <td className="px-3 py-2 font-mono text-xs text-zinc-400">
                {user.lastActive}
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-500 hover:text-white"
                >
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AdminDrawer
        open={!!selected}
        title={selected?.name ?? "User"}
        onClose={() => {
          setSelected(null);
          setConfirmLogout(false);
        }}
      >
        {selected ? (
          <div className="space-y-4 text-sm">
            <section className="border-b border-zinc-800 pb-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-600">
                Identity
              </p>
              <p className="font-mono text-xs text-zinc-400">ID: {selected.id}</p>
              <p className="mt-1 text-zinc-300">{selected.email}</p>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                Joined {selected.joined} · Last {selected.lastActive}
              </p>
            </section>
            <section className="border-b border-zinc-800 pb-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-600">
                Verification
              </p>
              <p className="text-zinc-300">
                Email {selected.verified ? "verified" : "pending"}
              </p>
              {!selected.verified && (
                <button type="button" className={`${adminGhostBtn} mt-2`}>
                  Mark as Verified
                </button>
              )}
            </section>
            <section className="border-b border-zinc-800 pb-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-600">
                Sessions
              </p>
              <p className="font-mono text-xs text-zinc-500">
                Chrome · 172.21.48.1 · 2m ago
              </p>
              {confirmLogout ? (
                <span className="mt-2 flex items-center gap-2 text-xs text-zinc-300">
                  Are you sure?
                  <button type="button" className="text-red-400 hover:text-red-300">
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmLogout(false)}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmLogout(true)}
                  className="mt-2 text-xs text-red-400 hover:text-red-300"
                >
                  Force Logout All
                </button>
              )}
            </section>
            <div className="flex gap-2 pt-2">
              <button type="button" className={adminGhostBtn}>
                Login as User
              </button>
              <button type="button" className={adminRedBtn}>
                Suspend Account
              </button>
            </div>
          </div>
        ) : null}
      </AdminDrawer>
    </div>
  );
}
