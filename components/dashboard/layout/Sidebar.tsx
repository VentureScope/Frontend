import {
  LayoutDashboard,
  Map,
  MessageSquare,
  FileText,
  Database,
  BarChart3,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

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
    label: "Account",
    items: [
      { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const clearAuth = useAppStore((state) => state.clearAuth);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border/80 p-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md"
            onClick={onClose}
          >
            <Image
              src="/logo.png"
              alt="VentureScope Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <div>
              <h2 className="text-lg font-semibold leading-none tracking-tight text-sidebar-foreground">
                VentureScope
              </h2>
              <p className="text-label mt-1.5 text-primary">Intelligence Layer</p>
            </div>
          </Link>
        </div>

        <nav className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4 pb-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-label mb-2 px-3 text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md py-2.5 pl-3 pr-3 text-btn transition-colors",
                          active
                            ? "vs-nav-active"
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
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={() => {
              onClose?.();
              handleLogout();
            }}
            disabled={isLoggingOut}
            className="text-btn flex w-full items-center justify-center gap-2 rounded-md border border-border bg-transparent py-2.5 font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive disabled:opacity-60"
          >
            <LogOut size={16} className="shrink-0" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

