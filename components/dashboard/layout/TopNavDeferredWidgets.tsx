"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { NotificationPanel } from "@/components/dashboard/layout/NotificationPanel";
import { DashboardHelpPanel } from "@/components/dashboard/layout/DashboardHelpPanel";
import { ThemeToggle } from "@/components/theme-toggle";
import { getUserProfileView } from "@/lib/user-profile";
import { cn } from "@/lib/utils";

export type TopNavDeferredWidgetsProps = {
  profile: ReturnType<typeof getUserProfileView>;
  isAdmin: boolean;
};

export function TopNavDeferredWidgets({
  profile,
  isAdmin,
}: TopNavDeferredWidgetsProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

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
        onOpenChange={(next) => {
          setNotificationsOpen(next);
          if (next) setHelpOpen(false);
        }}
      />
      <DashboardHelpPanel
        open={helpOpen}
        onOpenChange={(next) => {
          setHelpOpen(next);
          if (next) setNotificationsOpen(false);
        }}
      />
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
