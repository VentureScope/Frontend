"use client";

import {
  Building2,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminLogout } from "@/lib/admin-auth-api";
import { useAdminStore } from "@/store/useAdminStore";
import { cn } from "@/lib/utils";

export const ADMIN_SIDEBAR_WIDTH_EXPANDED = "16rem";
export const ADMIN_SIDEBAR_WIDTH_COLLAPSED = "4.5rem";

type NavItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Platform",
    items: [
      { name: "Overview", icon: LayoutDashboard, href: "/admin" },
      { name: "Users", icon: Users, href: "/admin/users" },
      { name: "Organizations", icon: Building2, href: "/admin/organizations" },
    ],
  },
  {
    label: "System",
    items: [{ name: "Settings", icon: Settings, href: "/admin/settings" }],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({
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
  const clearAuth = useAdminStore((state) => state.clearAuth);
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
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await adminLogout();
    } catch {
      // Always clear local admin session.
    } finally {
      clearAuth();
      router.push("/admin/sign-in");
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
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-sidebar transition-[width,transform] duration-300 ease-in-out",
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
            href="/admin"
            className={cn(
              "flex min-w-0 items-center rounded-md transition-opacity hover:opacity-90",
              isCollapsed ? "justify-center" : "gap-3",
            )}
            onClick={onClose}
            title="Admin Console"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold leading-none text-sidebar-foreground">
                  Admin Console
                </h2>
                <p className="text-label mt-1 text-primary">VentureScope</p>
              </div>
            )}
          </Link>

          {onToggleCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
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
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={isCollapsed ? "Sign out" : undefined}
            className={cn(
              "text-btn flex items-center rounded-md border border-border bg-transparent font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive disabled:opacity-60",
              isCollapsed
                ? "h-10 w-full justify-center"
                : "w-full justify-center gap-2 py-2.5",
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {!isCollapsed && (isLoggingOut ? "Signing out…" : "Sign out")}
          </button>
        </div>
      </aside>
    </>
  );
}
