"use client";

import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { AdminSidebar } from "@/components/admin/shell/AdminSidebar";
import { AdminTopbar } from "@/components/admin/shell/AdminTopbar";
import { useAdminStore } from "@/store/useAdminStore";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-admin-sans",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-admin-mono",
});

export function AdminShell({ children }: { children: React.ReactNode }) {
  const collapsed = useAdminStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useAdminStore((s) => s.toggleSidebarCollapsed);

  return (
    <div
      className={`${dmSans.variable} ${ibmMono.variable} flex min-h-screen min-w-[1280px] flex-col bg-zinc-950 font-sans text-zinc-300`}
      style={{ fontFamily: "var(--font-admin-sans), sans-serif" }}
    >
      <AdminTopbar />
      <div className="flex min-h-0 flex-1">
        <AdminSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
        <main className="min-w-0 flex-1 overflow-auto p-4 [&_.font-mono]:font-[family-name:var(--font-admin-mono)]">
          {children}
        </main>
      </div>
    </div>
  );
}
