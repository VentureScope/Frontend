"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { adminLogout } from "@/lib/admin-auth-api";
import { useRouter } from "next/navigation";
import { adminInput } from "@/components/admin/ui/admin-styles";

export function AdminTopbar() {
  const router = useRouter();
  const user = useAdminStore((s) => s.authData.user);
  const clearAuth = useAdminStore((s) => s.clearAuth);

  const initials =
    user?.full_name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

  async function signOut() {
    try {
      await adminLogout();
    } catch {
      /* ignore */
    }
    clearAuth();
    router.push("/admin/sign-in");
  }

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm font-semibold text-emerald-400">
          ◈ VentureScope
        </span>
        <span className="text-xs text-zinc-600">Admin</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600"
          />
          <input
            type="search"
            placeholder="Search users, DAGs, chunks…"
            className={`${adminInput} w-64 pl-9 text-xs`}
          />
        </div>
        <button
          type="button"
          onClick={signOut}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          Sign out
        </button>
        <Link
          href="/dashboard"
          className="hidden text-xs text-zinc-500 hover:text-zinc-300 sm:inline"
        >
          Member app →
        </Link>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 font-mono text-xs text-emerald-400"
          title={user?.email}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
