"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { adminLogout } from "@/lib/admin-auth-api";
import { useAdminStore } from "@/store/useAdminStore";
import { cn } from "@/lib/utils";

type AdminTopbarProps = {
  breadcrumb: string;
  onMenuClick?: () => void;
};

export function AdminTopbar({ breadcrumb, onMenuClick }: AdminTopbarProps) {
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

  const displayEmail = user?.email ?? "Administrator";

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
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md sm:h-[4.5rem] sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="text-label hidden text-primary sm:block">Admin</p>
          <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {breadcrumb}
          </h1>
        </div>

        <div
          ref={searchRef}
          className="relative hidden max-w-md flex-1 md:block md:max-w-xs lg:max-w-sm"
        >
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
            className="h-9 w-full rounded-md border border-border bg-muted pl-10 pr-3 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/35 focus:ring-1 focus:ring-primary/20"
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
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => void signOut()}
          className="hidden text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
        >
          Sign out
        </button>
        <Link
          href="/dashboard"
          className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground md:inline"
        >
          Member app →
        </Link>
        <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground lg:inline">
          {displayEmail}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-primary sm:h-10 sm:w-10",
          )}
          title={displayEmail}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}