"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar, {
  ADMIN_SIDEBAR_WIDTH_COLLAPSED,
  ADMIN_SIDEBAR_WIDTH_EXPANDED,
} from "@/components/admin/layout/AdminSidebar";
import AdminTopNav from "@/components/admin/layout/AdminTopNav";
import { getAdminBreadcrumb } from "@/lib/admin-breadcrumb";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAdminStore((state) => state.authData.token);
  const isAuthenticated = Boolean(token);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarCollapsed = useAdminStore((state) => state.sidebarCollapsed);
  const toggleSidebarCollapsed = useAdminStore(
    (state) => state.toggleSidebarCollapsed,
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/admin/sign-in");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-body text-muted-foreground">
        Verifying admin session…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
      />
      <div
        className="flex min-h-screen flex-col transition-[padding-left] duration-300 ease-in-out max-lg:!pl-0"
        style={{
          paddingLeft: sidebarCollapsed
            ? ADMIN_SIDEBAR_WIDTH_COLLAPSED
            : ADMIN_SIDEBAR_WIDTH_EXPANDED,
        }}
      >
        <AdminTopNav
          breadcrumb={getAdminBreadcrumb(pathname)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
