"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AdminSidebar,
  ADMIN_SIDEBAR_COLLAPSED,
  ADMIN_SIDEBAR_EXPANDED,
} from "@/components/admin/shell/AdminSidebar";
import { AdminTopbar } from "@/components/admin/shell/AdminTopbar";
import { getAdminBreadcrumb } from "@/lib/admin-breadcrumb";
import { useAdminStore } from "@/store/useAdminStore";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useAdminStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useAdminStore((s) => s.toggleSidebarCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const readHash = () => setHash(window.location.hash);
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-background">
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />
      <div
        className="flex min-h-screen flex-col transition-[padding-left] duration-300 ease-in-out max-lg:!pl-0"
        style={{
          paddingLeft: collapsed
            ? ADMIN_SIDEBAR_COLLAPSED
            : ADMIN_SIDEBAR_EXPANDED,
        }}
      >
        <AdminTopbar
          breadcrumb={getAdminBreadcrumb(pathname, hash)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
