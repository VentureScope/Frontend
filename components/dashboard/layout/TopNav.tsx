"use client";

import { useState } from "react";
import { HelpCircle, Menu, Shield } from "lucide-react";
import { NotificationPanel } from "@/components/dashboard/layout/NotificationPanel";
import Link from "next/link";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  CommandSearch,
  type CommandSearchItem,
} from "@/components/shared/CommandSearch";

type TopNavProps = {
  breadcrumb: string;
  onMenuClick?: () => void;
};

const DASHBOARD_SEARCH_ITEMS: CommandSearchItem[] = [
  { label: "Dashboard Overview", path: "/dashboard", group: "Workspace" },
  { label: "Learning Path", path: "/dashboard/learning-path", group: "Workspace" },
  {
    label: "New Roadmap",
    path: "/dashboard/learning-path/new-roadmap",
    group: "Workspace",
  },
  { label: "AI Advisor", path: "/dashboard/ai-advisor", group: "Workspace" },
  { label: "Resume Builder", path: "/dashboard/resume-builder", group: "Workspace" },
  {
    label: "New Resume",
    path: "/dashboard/resume-builder/new-resume",
    group: "Workspace",
  },
  { label: "Data Hub", path: "/dashboard/data-hub", group: "Workspace" },
  { label: "Market Trends", path: "/dashboard/market-trends", group: "Workspace" },
  { label: "Settings", path: "/dashboard/settings", group: "Account" },
  { label: "Profile", path: "/dashboard/profile", group: "Account" },
  { label: "Organizations", path: "/dashboard/organization", group: "Organization" },
  {
    label: "Create Organization",
    path: "/dashboard/organization/new",
    group: "Organization",
  },
  {
    label: "My Org Profile",
    path: "/dashboard/organization/profile",
    group: "Organization",
  },
  { label: "Org Advisor", path: "/dashboard/organization/advisor", group: "Organization" },
  {
    label: "Pending Invites",
    path: "/dashboard/organization/invites",
    group: "Organization",
  },
];

function TopNavActions({
  profile,
  isAdmin,
}: {
  profile: ReturnType<typeof getUserProfileView>;
  isAdmin: boolean;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      {isAdmin ? (
        <Link
          href="/admin"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted sm:px-2.5",
          )}
          title="Open admin console"
        >
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="hidden md:inline">Admin</span>
        </Link>
      ) : null}
      <ThemeToggle />
      <NotificationPanel
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
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
          className="h-full w-full bg-muted object-cover"
        />
      </Link>
    </>
  );
}

export default function TopNav({ breadcrumb, onMenuClick }: TopNavProps) {
  const user = useAppStore((state) => state.authData.user);
  const isAdmin = Boolean(user?.is_admin);
  const profile = getUserProfileView(user);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur-md">
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
          <p className="text-label hidden text-primary sm:block">
            VentureScope
          </p>
          <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {breadcrumb}
          </h1>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2 md:col-start-4">
          <TopNavActions profile={profile} isAdmin={isAdmin} />
        </div>

        <CommandSearch
          items={DASHBOARD_SEARCH_ITEMS}
          placeholder="Search pages…"
          className="col-span-3 min-w-0 md:col-span-1 md:col-start-3 md:row-start-1"
        />
      </div>
    </header>
  );
}
