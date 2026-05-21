"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/shell/AdminShell";
import { getCurrentAdminProfile } from "@/lib/admin-auth-api";
import {
  hasAdminMeBeenRevalidated,
  markAdminMeRevalidated,
} from "@/lib/admin-session-validation";
import { isAdminDemoEnabled } from "@/lib/admin-utils";
import {
  buildAdminSignInUrl,
  getClientReturnPath,
} from "@/lib/auth-redirect";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAdminStore((state) => state.authData.token);
  const user = useAdminStore((state) => state.authData.user);
  const setAuthData = useAdminStore((state) => state.setAuthData);
  const clearAuth = useAdminStore((state) => state.clearAuth);
  const isAuthenticated = Boolean(token);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isBlockingValidation, setIsBlockingValidation] = useState(false);
  const backgroundCheckStarted = useRef(false);

  const isDemoSession =
    token === "demo-admin-session" && isAdminDemoEnabled();
  const hasTrustedAdmin = user?.is_admin === true;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace(buildAdminSignInUrl(getClientReturnPath()));
      return;
    }

    if (isDemoSession) {
      return;
    }

    if (user?.is_admin === false) {
      clearAuth();
      router.replace(buildAdminSignInUrl(getClientReturnPath()));
      return;
    }

    async function revalidateInBackground() {
      try {
        const profile = await getCurrentAdminProfile();
        if (!profile.is_admin) {
          clearAuth();
          router.replace(buildAdminSignInUrl(getClientReturnPath()));
          return;
        }
        const current = useAdminStore.getState().authData;
        setAuthData({ ...current, user: profile });
        markAdminMeRevalidated();
      } catch {
        clearAuth();
        router.replace(buildAdminSignInUrl(getClientReturnPath()));
      }
    }

    if (hasTrustedAdmin) {
      if (!hasAdminMeBeenRevalidated() && !backgroundCheckStarted.current) {
        backgroundCheckStarted.current = true;
        void revalidateInBackground();
      }
      return;
    }

    let cancelled = false;
    setIsBlockingValidation(true);

    (async () => {
      try {
        const profile = await getCurrentAdminProfile();
        if (cancelled) return;
        if (!profile.is_admin) {
          clearAuth();
          router.replace(buildAdminSignInUrl(getClientReturnPath()));
          return;
        }
        const current = useAdminStore.getState().authData;
        setAuthData({ ...current, user: profile });
        markAdminMeRevalidated();
      } catch {
        if (!cancelled) {
          clearAuth();
          router.replace(buildAdminSignInUrl(getClientReturnPath()));
        }
      } finally {
        if (!cancelled) {
          setIsBlockingValidation(false);
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
    isDemoSession,
    hasTrustedAdmin,
    user?.is_admin,
    router,
    setAuthData,
    clearAuth,
  ]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-body text-muted-foreground">
        Loading admin session…
      </div>
    );
  }

  if (!isDemoSession && !hasTrustedAdmin && isBlockingValidation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-body text-muted-foreground">
        Verifying admin access…
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
