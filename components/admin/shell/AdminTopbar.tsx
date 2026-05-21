"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { adminLogout } from "@/lib/admin-auth-api";
import { useAdminStore } from "@/store/useAdminStore";
import { cn } from "@/lib/utils";
import {
  CommandSearch,
  type CommandSearchItem,
} from "@/components/shared/CommandSearch";

type AdminTopbarProps = {
  breadcrumb: string;
  onMenuClick?: () => void;
};

export function AdminTopbar({ breadcrumb, onMenuClick }: AdminTopbarProps) {
  const router = useRouter();
  const user = useAdminStore((s) => s.authData.user);
  const clearAuth = useAdminStore((s) => s.clearAuth);

  const ADMIN_SEARCH_ITEMS: CommandSearchItem[] = useMemo(
    () => [
      { label: "Admin Overview", path: "/admin", group: "Console" },
      { label: "Transcripts", path: "/admin/transcripts", group: "Content" },
      { label: "Knowledge Base", path: "/admin/knowledge", group: "Content" },
      { label: "Prompt Config", path: "/admin/prompt-config", group: "Content" },
      { label: "System Health", path: "/admin/system", group: "Operations" },
      { label: "GitHub Syncs", path: "/admin/github-syncs", group: "Operations" },
      { label: "User Directory", path: "/admin/directory", group: "Users" },
      { label: "System Alerts", path: "/admin/alerts", group: "Operations" },
      { label: "Permissions", path: "/admin/permissions", group: "Users" },
      { label: "System Config", path: "/admin/config", group: "Operations" },
    ],
    [],
  );

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
    <header className="sticky top-0 z-30 w-full shrink-0 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 px-4 py-2 sm:px-6 md:h-[4.5rem] md:grid-cols-[auto_minmax(0,1fr)_minmax(10rem,16rem)_auto] md:gap-x-4 md:py-0 lg:px-8 lg:grid-cols-[auto_minmax(0,1fr)_minmax(12rem,20rem)_auto]">
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

        <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2 md:col-start-4">
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

        <CommandSearch
          items={ADMIN_SEARCH_ITEMS}
          placeholder="Search admin pages…"
          className="col-span-3 min-w-0 md:col-span-1 md:col-start-3 md:row-start-1"
        />
      </div>
    </header>
  );
}
