"use client";

import {
  LayoutDashboard,
  Map,
  MessageSquare,
  FileText,
  Database,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  MapPinned,
  Users,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutUser } from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export const SIDEBAR_WIDTH_EXPANDED = "16rem";
export const SIDEBAR_WIDTH_COLLAPSED = "4.5rem";

type NavItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { name: "Learning Path", icon: Map, href: "/dashboard/learning-path" },
      { name: "AI Advisor", icon: MessageSquare, href: "/dashboard/ai-advisor" },
      {
        name: "Resume Builder",
        icon: FileText,
        href: "/dashboard/resume-builder",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Data Hub", icon: Database, href: "/dashboard/data-hub" },
      {
        name: "Market Trends",
        icon: BarChart3,
        href: "/dashboard/market-trends",
      },
    ],
  },
  {
    label: "Organization",
    items: [
      {
        name: "Organizations",
        icon: Building2,
        href: "/dashboard/organization",
      },
      {
        name: "My Roadmaps",
        icon: MapPinned,
        href: "/dashboard/organization/roadmaps",
      },
      {
        name: "My Org Profile",
        icon: Users,
        href: "/dashboard/organization/profile",
      },
      {
        name: "Org Advisor",
        icon: Bot,
        href: "/dashboard/organization/advisor",
      },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/dashboard/organization") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapsed,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const clearAuth = useAppStore((state) => state.clearAuth);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const isCollapsed = collapsed && isDesktop;

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // Always clear local auth so users can exit even if backend logout fails.
    } finally {
      clearAuth();
      router.push("/");
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <div
        role="presentation"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-sidebar transition-[width,transform] duration-300 ease-in-out lg:w-64",
          isCollapsed && "lg:!w-[4.5rem]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 border-b border-border/80",
            isCollapsed
              ? "flex-col items-center gap-2 px-2 py-3"
              : "h-[4.25rem] items-center justify-between gap-2 px-3",
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex min-w-0 items-center rounded-md transition-opacity hover:opacity-90",
              isCollapsed ? "justify-center" : "gap-3",
            )}
            onClick={onClose}
            title="VentureScope"
          >
            <Image
              src="/logo.png"
              alt="VentureScope Logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold leading-none tracking-tight text-sidebar-foreground">
                  VentureScope
                </h2>
                <p className="text-label mt-1 text-primary">Intelligence Layer</p>
              </div>
            )}
          </Link>

          {onToggleCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className={cn(
                "hidden shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex",
                "h-8 w-8",
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" strokeWidth={2} />
              ) : (
                <PanelLeftClose className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          ) : null}
        </div>

        <nav
          className={cn(
            "scrollbar-none flex-1 overflow-y-auto py-4",
            isCollapsed ? "space-y-4 px-2" : "space-y-6 px-3",
          )}
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className="text-label mb-2 px-3 text-muted-foreground">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        title={isCollapsed ? item.name : undefined}
                        aria-label={isCollapsed ? item.name : undefined}
                        className={cn(
                          "flex items-center rounded-md text-btn transition-colors",
                          isCollapsed
                            ? "justify-center px-0 py-2.5"
                            : "w-full gap-3 py-2.5 pl-3 pr-3",
                          active
                            ? isCollapsed
                              ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                              : "vs-nav-active"
                            : isCollapsed
                              ? "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                              : "border-l-2 border-transparent text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                        )}
                      >
                        <item.icon
                          size={18}
                          className={cn(
                            "shrink-0",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={cn("shrink-0 border-t border-border", isCollapsed ? "p-2" : "p-4")}>
          <button
            type="button"
            onClick={() => {
              onClose?.();
              handleLogout();
            }}
            disabled={isLoggingOut}
            title={isCollapsed ? (isLoggingOut ? "Logging out…" : "Logout") : undefined}
            className={cn(
              "text-btn flex items-center rounded-md border border-border bg-transparent font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive disabled:opacity-60",
              isCollapsed
                ? "h-10 w-full justify-center px-0 py-0"
                : "w-full justify-center gap-2 py-2.5",
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {!isCollapsed && (isLoggingOut ? "Logging out..." : "Logout")}
          </button>
        </div>
      </aside>
    </>
  );
}
