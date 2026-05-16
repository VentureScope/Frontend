"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopNav from "@/components/dashboard/layout/TopNav";
import { useAppStore } from "@/store/useAppStore";
import { mfaGetAAL } from "@/lib/mfa-api";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  // TODO: Re-enable real auth checks once backend integration is complete.
  const token = useAppStore((state) => state.authData.token);
  const isAuthenticated = Boolean(token);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }

    // Check MFA/AAL requirement
    async function checkMFA() {
      try {
        const aal = await mfaGetAAL();
        // If user has MFA enabled (aal2 next level) but is currently at aal1,
        // redirect to challenge page.
        if (aal.current_level === "aal1" && aal.next_level === "aal2") {
          const currentPath = window.location.pathname;
          router.replace(`/mfa-challenge?redirect=${encodeURIComponent(currentPath)}`);
        }
      } catch (err) {
        console.error("MFA check failed", err);
      }
    }
    
    checkMFA();
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopNav
          breadcrumb="Dashboard"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
