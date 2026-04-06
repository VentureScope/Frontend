import {
  LayoutDashboard,
  Map,
  MessageSquare,
  FileText,
  Database,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/lib/auth-api";
import { useAppStore } from "@/store/useAppStore";

export default function Sidebar() {
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

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Learning Path", icon: Map, href: "/dashboard/learning-path" },
    { name: "AI Advisor", icon: MessageSquare, href: "/dashboard/ai-advisor" },
    {
      name: "Resume Builder",
      icon: FileText,
      href: "/dashboard/resume-builder",
    },
    { name: "Data Hub", icon: Database, href: "/dashboard/data-hub" },
    {
      name: "Market Trends",
      icon: BarChart3,
      href: "/dashboard/market-trends",
    },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-100 bg-white hidden lg:flex flex-col">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 rounded-md">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              VentureScope
            </h2>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1">
              Intelligence Layer
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {menu.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon
                size={20}
                className={active ? "text-blue-600" : "text-slate-400"}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d59db] py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-colors hover:bg-blue-700"
        >
          <LogOut size={16} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
