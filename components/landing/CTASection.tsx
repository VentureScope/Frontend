"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLandingAuth } from "@/hooks/useLandingAuth";

export default function CTASection() {
  const { isHydrated, isAuthenticated, dashboardHref, registerHref } =
    useLandingAuth();

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="vs-band relative mx-auto max-w-7xl overflow-hidden rounded-xl p-8 sm:p-12 lg:p-24">
        <div
          className="pointer-events-none absolute -left-1/10 -top-1/5 h-75 w-75 rounded-lg bg-primary/20 blur-[80px] sm:h-125 sm:w-125 sm:blur-[120px]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center sm:space-y-10">
          <h2 className="text-h1 leading-tight">
            {isAuthenticated
              ? "Your career intelligence is ready"
              : "Ready to upgrade your professional intelligence?"}
          </h2>
          <p className="text-body vs-band-muted">
            {isAuthenticated
              ? "Open your dashboard for roadmaps, resumes, advisor sessions, and live market matches tailored to your profile."
              : "Join thousands of Ethiopian tech professionals who are using VentureScope to navigate their career paths."}
          </p>
          <div className="flex flex-col flex-wrap justify-center gap-3 pt-4 sm:flex-row sm:gap-4">
            {isHydrated ? (
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-md px-8 font-semibold sm:h-14 sm:w-auto sm:px-10"
              >
                <Link href={isAuthenticated ? dashboardHref : registerHref}>
                  {isAuthenticated ? "Open dashboard" : "Create account"}
                </Link>
              </Button>
            ) : (
              <div className="mx-auto h-12 w-48 rounded-md bg-inverse-foreground/10 sm:h-14" />
            )}
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-md border-inverse-foreground/25 bg-inverse-foreground/10 px-8 font-semibold text-inverse-foreground hover:bg-inverse-foreground/15 sm:h-14 sm:w-auto sm:px-10"
              asChild
            >
              <Link
                href={
                  isAuthenticated ? "/dashboard/market-trends" : "/about"
                }
              >
                {isAuthenticated ? "View market trends" : "Learn more"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
