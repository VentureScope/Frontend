"use client";

import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import type { CommandSearchItem } from "@/components/shared/CommandSearch";

const CommandSearch = dynamic(
  () =>
    import("@/components/shared/CommandSearch").then((m) => ({
      default: m.CommandSearch,
    })),
  { ssr: false },
);

const TopNavDeferredWidgets = dynamic(
  () =>
    import("@/components/dashboard/layout/TopNavDeferredWidgets").then(
      (m) => ({
        default: m.TopNavDeferredWidgets,
      }),
    ),
  { ssr: false },
);

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
    label: "Invitations",
    path: "/dashboard/organization/invites",
    group: "Organization",
  },
  {
    label: "My Roadmaps",
    path: "/dashboard/organization/roadmaps",
    group: "Organization",
  },
];

type TopNavProps = {
  breadcrumb: string;
  onMenuClick?: () => void;
};

function TopNavActionsPlaceholder() {
  return (
    <>
      <div className="h-9 w-9 rounded-lg bg-muted" aria-hidden />
      <div className="h-9 w-9 rounded-lg bg-muted" aria-hidden />
      <div className="h-9 w-9 rounded-full bg-muted" aria-hidden />
    </>
  );
}

export default function TopNav({ breadcrumb, onMenuClick }: TopNavProps) {
  const user = useAppStore((state) => state.authData.user);
  const isAdmin = Boolean(user?.is_admin);
  const profile = getUserProfileView(user);
  const widgetsReady = useDeferredMount(800);
  const searchReady = useDeferredMount(1200);

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
          {widgetsReady ? (
            <TopNavDeferredWidgets profile={profile} isAdmin={isAdmin} />
          ) : (
            <TopNavActionsPlaceholder />
          )}
        </div>

        {searchReady ? (
          <CommandSearch
            items={DASHBOARD_SEARCH_ITEMS}
            placeholder="Search pages…"
            className="col-span-3 min-w-0 md:col-span-1 md:col-start-3 md:row-start-1"
          />
        ) : (
          <div
            className="col-span-3 hidden h-10 min-w-0 rounded-lg bg-muted md:col-span-1 md:col-start-3 md:block md:row-start-1"
            aria-hidden
          />
        )}
      </div>
    </header>
  );
}
