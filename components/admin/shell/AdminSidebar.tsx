"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  Tags,
  Database,
  FileText,
  GitBranch,
  HardDrive,
  LayoutDashboard,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Server,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ADMIN_SIDEBAR_EXPANDED = "13.75rem"; // 220px
export const ADMIN_SIDEBAR_COLLAPSED = "3rem"; // 48px

type NavItem = { name: string; href: string; icon: LucideIcon };

const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Platform",
    items: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Directory", href: "/admin/directory", icon: Users },
      { name: "Permissions", href: "/admin/permissions", icon: Shield },
    ],
  },
  {
    label: "Data Pipeline",
    items: [
      { name: "Transcripts", href: "/admin/transcripts", icon: FileText },
      { name: "Embeddings", href: "/admin/embeddings", icon: Database },
      { name: "GitHub Syncs", href: "/admin/github-syncs", icon: GitBranch },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { name: "Role Taxonomy", href: "/admin/taxonomy", icon: Tags },
      { name: "Knowledge Base", href: "/admin/knowledge", icon: BookOpen },
      { name: "Chat Logs", href: "/admin/chat-logs", icon: MessageSquare },
      { name: "Prompt Config", href: "/admin/prompt-config", icon: Bot },
    ],
  },
  {
    label: "Communications",
    items: [
      { name: "Broadcasts", href: "/admin/broadcasts", icon: Bell },
      { name: "System Alerts", href: "/admin/alerts", icon: Activity },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { name: "Technical Health", href: "/admin/system", icon: Server },
      { name: "Storage", href: "/admin/system#storage", icon: HardDrive },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "System Config", href: "/admin/config", icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href.includes("#")) return pathname === href.split("#")[0];
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      style={{ width: collapsed ? ADMIN_SIDEBAR_COLLAPSED : ADMIN_SIDEBAR_EXPANDED }}
      className="flex h-full shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 transition-[width] duration-200"
    >
      <div
        className={cn(
          "flex h-12 shrink-0 items-center border-b border-zinc-800 px-2",
          collapsed ? "justify-center" : "justify-end",
        )}
      >
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 text-zinc-500 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="scrollbar-none flex-1 overflow-y-auto py-2">
        {NAV.map((group) => (
          <div key={group.label} className="mb-3">
            {!collapsed && (
              <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-zinc-600">
                {group.label}
              </p>
            )}
            <ul>
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.name : undefined}
                      className={cn(
                        "flex items-center py-1.5 text-sm transition-colors",
                        collapsed
                          ? "justify-center px-0"
                          : "gap-2.5 px-3",
                        active
                          ? "border-l-2 border-emerald-400 bg-zinc-800 text-white"
                          : "border-l-2 border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                      )}
                    >
                      <item.icon size={16} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
