"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/shell/AdminShell";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAdminStore((state) => state.authData.token);
  const isAuthenticated = Boolean(token);
  const [isHydrated, setIsHydrated] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-mono text-sm text-zinc-500">
        Verifying admin session…
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
