"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_MEMBER_PATH,
  buildRegisterUrl,
  buildSignInUrl,
} from "@/lib/auth-redirect";
import { useAppStore } from "@/store/useAppStore";

/** Auth-aware links and labels for public marketing pages. */
export function useLandingAuth() {
  const pathname = usePathname();
  const token = useAppStore((state) => state.authData.token);
  const user = useAppStore((state) => state.authData.user);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isAuthenticated = Boolean(token);
  const firstName = user?.full_name?.split(/\s+/)[0] ?? null;
  const returnPath = pathname || "/";

  return {
    isHydrated,
    isAuthenticated,
    firstName,
    dashboardHref: DEFAULT_MEMBER_PATH,
    marketInsightHref: "/market-insight",
    marketTrendsHref: "/dashboard/market-trends",
    learningPathHref: "/dashboard/learning-path",
    profileHref: "/dashboard/profile",
    dataHubHref: "/dashboard/data-hub",
    signInHref: buildSignInUrl(returnPath),
    registerHref: buildRegisterUrl(returnPath),
  };
}
