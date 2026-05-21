"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLandingAuth } from "@/hooks/useLandingAuth";

export function AboutJoinCta() {
  const { isHydrated, isAuthenticated, dashboardHref, registerHref } =
    useLandingAuth();

  if (!isHydrated) {
    return (
      <div
        className="h-10 w-full rounded-md bg-muted sm:w-48"
        aria-hidden
      />
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      className="w-full rounded-md border-border font-semibold text-primary hover:bg-primary/5 sm:w-auto"
    >
      <Link href={isAuthenticated ? dashboardHref : registerHref}>
        {isAuthenticated ? "Open your dashboard" : "Join the movement"}
      </Link>
    </Button>
  );
}
