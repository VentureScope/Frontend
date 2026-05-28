"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation";

import Sidebar, {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from "@/components/dashboard/layout/Sidebar";
import TopNav from "@/components/dashboard/layout/TopNav";
import { useAppStore } from "@/store/useAppStore";
import { getMfaAalCached } from "@/lib/mfa-aal-cache";
import { getDashboardBreadcrumb } from "@/lib/dashboard-breadcrumb";
import {
  buildMfaChallengeUrl,
  buildSignInUrl,
  getClientReturnPath,
} from "@/lib/auth-redirect";
import { ONBOARDING_PATH, shouldShowOnboarding } from "@/lib/onboarding";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  // TODO: Re-enable real auth checks once backend integration is complete.
  const token = useAppStore((state) => state.authData.token);
  const userId = useAppStore((state) => state.authData.user?.id);
  const isLoggingOut = useAppStore((state) => state.isLoggingOut);
  const isAuthenticated = Boolean(token);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  const toggleSidebarCollapsed = useAppStore(
    (state) => state.toggleSidebarCollapsed,
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || isLoggingOut) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(buildSignInUrl(getClientReturnPath()));
      return;
    }

    // Check MFA/AAL requirement
    async function checkMFA() {
      try {
        const aal = await getMfaAalCached();
        // If user has MFA enabled (aal2 next level) but is currently at aal1,
        // redirect to challenge page.
        if (aal.current_level === "aal1" && aal.next_level === "aal2") {
          router.replace(buildMfaChallengeUrl(getClientReturnPath()));
        }
      } catch (err) {
        console.error("MFA check failed", err);
      }
    }
    
    checkMFA();

    if (userId && shouldShowOnboarding(userId)) {
      router.replace(ONBOARDING_PATH);
    }
  }, [isHydrated, isAuthenticated, isLoggingOut, router, userId]);

  if (isLoggingOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-body text-muted-foreground">
        Signing out…
      </div>
    );
  }

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-body text-muted-foreground">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
      />
      <div
        className="flex min-h-screen flex-col transition-[padding-left] duration-300 ease-in-out max-lg:!pl-0"
        style={{
          paddingLeft: sidebarCollapsed
            ? SIDEBAR_WIDTH_COLLAPSED
            : SIDEBAR_WIDTH_EXPANDED,
        }}
      >
        <TopNav
          breadcrumb={getDashboardBreadcrumb(pathname)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
