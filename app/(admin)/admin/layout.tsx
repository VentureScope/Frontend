"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/shell/AdminShell";
import { getCurrentAdminProfile } from "@/lib/admin-auth-api";
import { isAdminDemoEnabled } from "@/lib/admin-utils";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAdminStore((state) => state.authData.token);
  const user = useAdminStore((state) => state.authData.user);
  const setAuthData = useAdminStore((state) => state.setAuthData);
  const clearAuth = useAdminStore((state) => state.clearAuth);
  const isAuthenticated = Boolean(token);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/admin/sign-in");
      return;
    }

    if (token === "demo-admin-session" && isAdminDemoEnabled()) {
      return;
    }

    if (user?.is_admin === false) {
      clearAuth();
      router.replace("/admin/sign-in");
      return;
    }

    let cancelled = false;
    setIsValidating(true);

    (async () => {
      try {
        const profile = await getCurrentAdminProfile();
        if (cancelled) return;
        if (!profile.is_admin) {
          clearAuth();
          router.replace("/admin/sign-in");
          return;
        }
        const current = useAdminStore.getState().authData;
        setAuthData({ ...current, user: profile });
      } catch {
        if (!cancelled) {
          clearAuth();
          router.replace("/admin/sign-in");
        }
      } finally {
        if (!cancelled) {
          setIsValidating(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isHydrated,
    isAuthenticated,
    token,
    user?.is_admin,
    router,
    setAuthData,
    clearAuth,
  ]);

  if (!isHydrated || !isAuthenticated || isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-body text-muted-foreground">
        Verifying admin session…
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
