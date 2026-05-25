"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Tags,
  ChevronDown,
  Database,
  FileText,
  GitBranch,
  HardDrive,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Server,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ADMIN_SIDEBAR_EXPANDED = "16rem";
export const ADMIN_SIDEBAR_COLLAPSED = "4.5rem";

type NavLink = {
  type: "link";
  name: string;
  href: string;
  icon: LucideIcon;
};

type NavCollapsible = {
  type: "collapsible";
  name: string;
  icon: LucideIcon;
  baseHref: string;
  children: { name: string; href: string; icon: LucideIcon }[];
};

type NavEntry = NavLink | NavCollapsible;

type NavGroup = { label: string; items: NavEntry[] };

const NAV: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { type: "link", name: "Overview", href: "/admin", icon: LayoutDashboard },
      { type: "link", name: "Directory", href: "/admin/directory", icon: Users },
      {
        type: "link",
        name: "Permissions",
        href: "/admin/permissions",
        icon: Shield,
      },
    ],
  },
  {
    label: "Data Pipeline",
    items: [
      {
        type: "link",
        name: "Transcripts",
        href: "/admin/transcripts",
        icon: FileText,
      },
      {
        type: "link",
        name: "ML-Runs",
        href: "/admin/ml-runs",
        icon: Database,
      },
      {
        type: "link",
        name: "GitHub Syncs",
        href: "/admin/github-syncs",
        icon: GitBranch,
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { type: "link", name: "Role Taxonomy", href: "/admin/taxonomy", icon: Tags },
    ],
  },
  {
    label: "Communications",
    items: [
      {
        type: "link",
        name: "System Alerts",
        href: "/admin/alerts",
        icon: Activity,
      },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      {
        type: "collapsible",
        name: "Technical Health",
        icon: Server,
        baseHref: "/admin/system",
        children: [
          {
            name: "Storage",
            href: "/admin/system#storage",
            icon: HardDrive,
          },
        ],
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        type: "link",
        name: "System Config",
        href: "/admin/config",
        icon: Settings,
      },
    ],
  },
];

function isLinkActive(pathname: string, href: string, currentHash = "") {
  if (href === "/admin") return pathname === "/admin";
  const [path, hashPart] = href.split("#");
  const onPath = pathname === path || pathname.startsWith(`${path}/`);
  if (!onPath) return false;
  if (hashPart) {
    return currentHash === `#${hashPart}` || currentHash.includes(hashPart);
  }
  if (path === "/admin/system") {
    return !currentHash.includes("storage");
  }
  return true;
}

function isTechnicalHealthRoute(pathname: string) {
  return pathname === "/admin/system" || pathname.startsWith("/admin/system/");
}

function linkClassName(active: boolean, collapsed: boolean) {
  return cn(
    "flex items-center rounded-md text-btn transition-colors",
    collapsed ? "justify-center px-0 py-2.5" : "w-full gap-3 py-2.5 pl-3 pr-3",
    active
      ? collapsed
        ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
        : "vs-nav-active"
      : collapsed
        ? "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
        : "border-l-2 border-transparent text-muted-foreground hover:bg-primary/5 hover:text-foreground",
  );
}

function childLinkClassName(active: boolean) {
  return cn(
    "flex w-full items-center gap-2.5 rounded-md py-2 pl-9 pr-3 text-btn transition-colors",
    active
      ? "bg-primary/10 font-medium text-primary"
      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
  );
}

export function AdminSidebar({
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
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const [hash, setHash] = useState("");
  const [infraOpen, setInfraOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const readHash = () => setHash(window.location.hash);
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [pathname]);

  useEffect(() => {
    if (isTechnicalHealthRoute(pathname)) {
      setInfraOpen(true);
    }
  }, [pathname, hash]);

  const isCollapsed = collapsed && isDesktop;

  function renderLink(item: NavLink) {
    const active = isLinkActive(pathname, item.href, hash);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onClose}
          title={isCollapsed ? item.name : undefined}
          className={linkClassName(active, isCollapsed)}
        >
          <item.icon
            size={18}
            className={cn(
              "shrink-0",
              active ? "text-primary" : "text-muted-foreground",
            )}
          />
          {!isCollapsed && <span className="truncate">{item.name}</span>}
        </Link>
      </li>
    );
  }

  function renderCollapsible(item: NavCollapsible) {
    const onSystemPage = isTechnicalHealthRoute(pathname);
    const parentActive = onSystemPage && !hash.includes("storage");

    if (isCollapsed) {
      const active = onSystemPage;
      return (
        <li key={item.baseHref}>
          <Link
            href={item.baseHref}
            onClick={onClose}
            title={item.name}
            className={linkClassName(active, true)}
          >
            <item.icon
              size={18}
              className={cn(
                "shrink-0",
                active ? "text-primary" : "text-muted-foreground",
              )}
            />
          </Link>
        </li>
      );
    }

    return (
      <li key={item.baseHref}>
        <div
          className={cn(
            "rounded-md",
            onSystemPage && "bg-primary/5",
          )}
        >
          <div className="flex items-center">
            <Link
              href={item.baseHref}
              onClick={onClose}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-3 py-2.5 pl-3 pr-1 text-btn transition-colors",
                parentActive
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  "shrink-0",
                  onSystemPage ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
            <button
              type="button"
              onClick={() => setInfraOpen((o) => !o)}
              className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-expanded={infraOpen}
              aria-label={infraOpen ? "Collapse Technical Health" : "Expand Technical Health"}
            >
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform",
                  infraOpen && "rotate-180",
                )}
              />
            </button>
          </div>
          {infraOpen ? (
            <ul className="pb-1">
              {item.children.map((child) => {
                const active = isLinkActive(pathname, child.href, hash);
                return (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={onClose}
                      className={childLinkClassName(active)}
                    >
                      <child.icon size={16} className="shrink-0 opacity-80" />
                      <span className="truncate">{child.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </li>
    );
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
            title="VentureScope Admin"
          >
            <Image
              src="/logo.png"
              alt="VentureScope"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold leading-none tracking-tight text-sidebar-foreground">
                  VentureScope
                </h2>
                <p className="text-label mt-1 text-primary">Admin Console</p>
              </div>
            )}
          </Link>

          {onToggleCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className={cn(
                "hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex",
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
          {NAV.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className="text-label mb-2 px-3 text-muted-foreground">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) =>
                  item.type === "link"
                    ? renderLink(item)
                    : renderCollapsible(item),
                )}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
