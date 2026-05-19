"use client";

import { Bell, HelpCircle, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAdminStore } from "@/store/useAdminStore";
import { cn } from "@/lib/utils";

type AdminTopNavProps = {
  breadcrumb: string;
  onMenuClick?: () => void;
};

export default function AdminTopNav({ breadcrumb, onMenuClick }: AdminTopNavProps) {
  const user = useAdminStore((state) => state.authData.user);
  const initials =
    user?.full_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md sm:h-[4.5rem] sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open admin navigation"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="text-label hidden text-primary sm:block">Admin Console</p>
          <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {breadcrumb}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <button
          type="button"
          className="relative hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <button
          type="button"
          className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:block"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </button>
        <div
          className={cn(
            "ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-primary/10 text-xs font-bold text-primary sm:h-10 sm:w-10",
          )}
          title={user?.email ?? "Administrator"}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
