"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { buildSignInUrl } from "@/lib/auth-redirect";
import {
  getPostOnboardingPath,
  isOnboardingComplete,
  ONBOARDING_PATH,
} from "@/lib/onboarding";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAppStore((state) => state.authData.token);
  const userId = useAppStore((state) => state.authData.user?.id);
  const isLoggingOut = useAppStore((state) => state.isLoggingOut);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || isLoggingOut) {
      return;
    }
    if (!token) {
      router.replace(buildSignInUrl(ONBOARDING_PATH));
      return;
    }
    if (userId && isOnboardingComplete(userId)) {
      router.replace(getPostOnboardingPath(userId));
    }
  }, [isHydrated, isLoggingOut, token, userId, router]);

  if (isLoggingOut) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Signing out…
      </div>
    );
  }

  if (!isHydrated || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="VentureScope"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="text-sm font-bold text-foreground">
              VentureScope
            </span>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Profile setup
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
