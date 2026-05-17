"use client";

import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import Link from "next/link";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type TopNavProps = {
  breadcrumb: string;
  onMenuClick?: () => void;
};

export default function TopNav({ breadcrumb, onMenuClick }: TopNavProps) {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md sm:h-[4.5rem] sm:px-8">
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
          <p className="text-label hidden text-primary sm:block">
            VentureScope
          </p>
          <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {breadcrumb}
          </h1>
        </div>

        <div className="relative hidden max-w-md flex-1 md:block md:max-w-xs lg:max-w-sm xl:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search resources..."
            className="h-9 w-full rounded-md border border-border bg-muted pl-10 pr-3 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/35 focus:ring-1 focus:ring-primary/20"
          />
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
        <Link
          href="/dashboard/profile"
          className={cn(
            "ml-1 flex h-9 w-9 overflow-hidden rounded-full border border-border sm:h-10 sm:w-10",
            "ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/30",
          )}
        >
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="h-full w-full object-cover bg-muted"
          />
        </Link>
      </div>
    </header>
  );
}
