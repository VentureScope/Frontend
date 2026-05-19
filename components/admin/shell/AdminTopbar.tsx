"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!searchRef.current) return;
      const target = event.target as Node;
      if (!searchRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const ADMIN_SEARCH_ITEMS = useMemo(
    () => [
      { label: "Admin Overview", path: "/admin" },
      { label: "Transcripts", path: "/admin/transcripts" },
      { label: "Knowledge Base", path: "/admin/knowledge" },
      { label: "Prompt Config", path: "/admin/prompt-config" },
      { label: "System Health", path: "/admin/system" },
      { label: "GitHub Syncs", path: "/admin/github-syncs" },
      { label: "User Directory", path: "/admin/directory" },
      { label: "System Alerts", path: "/admin/alerts" },
      { label: "Chat Logs", path: "/admin/chat-logs" },
      { label: "Permissions", path: "/admin/permissions" },
      { label: "System Config", path: "/admin/config" },
    ],
    [],
  );

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return ADMIN_SEARCH_ITEMS.slice(0, 6);
    return ADMIN_SEARCH_ITEMS.filter((item) =>
      `${item.label} ${item.path}`.toLowerCase().includes(trimmed),
    ).slice(0, 6);
  }, [ADMIN_SEARCH_ITEMS, query]);

  const showResults = isOpen;

  function handleSelect(path: string) {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  }

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
        <div ref={searchRef} className="relative hidden md:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600"
          />
          <input
            type="search"
            placeholder="Search users, DAGs, chunks…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && matches[0]) {
                event.preventDefault();
                handleSelect(matches[0].path);
              }
            }}
            className={`${adminInput} w-64 pl-9 text-xs`}
          />
          {showResults && (
            <div
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-xl"
              onMouseDown={(event) => event.preventDefault()}
            >
              {matches.length === 0 ? (
                <div className="px-3 py-2 text-xs text-zinc-500">
                  No matches
                </div>
              ) : (
                matches.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(item.path)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-zinc-200 transition-colors hover:bg-zinc-900"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-[10px] text-zinc-500">
                      {item.path}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
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
