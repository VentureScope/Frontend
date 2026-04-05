"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopNav from "@/components/dashboard/layout/TopNav";
// import { useAppStore } from "@/store/useAppStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  // TODO: Re-enable real auth checks once backend integration is complete.
  const isAuthenticated = true;
  // const token = useAppStore((state) => state.authData.token);
  // const [isHydrated, setIsHydrated] = useState(
  //   useAppStore.persist.hasHydrated(),
  // );

  const [isHydrated] = useState(true);

  useEffect(() => {
    // const unsubscribe = useAppStore.persist.onFinishHydration(() => {
    //   setIsHydrated(true);
    // });
    // return () => {
    //   unsubscribe();
    // };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-64">
        <TopNav breadcrumb="Dashboard" />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
