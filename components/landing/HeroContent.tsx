"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLandingAuth } from "@/hooks/useLandingAuth";

export function HeroContent() {
  const { isHydrated, isAuthenticated, dashboardHref, registerHref } =
    useLandingAuth();

  const primaryHref = isAuthenticated ? dashboardHref : registerHref;
  const primaryLabel = isAuthenticated ? "Go to Dashboard" : "Join the Beta";

  return (
    <div className="space-y-8">
      <div className="vs-accent-chip inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
        <Sparkles className="h-3 w-3" />
        {isAuthenticated ? "Your workspace" : "The Intelligence Layer"}
      </div>

      <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
        Navigating Tech Careers in{" "}
        <span className="text-primary underline decoration-primary/30 decoration-4 underline-offset-4 sm:decoration-8 sm:underline-offset-8">
          Ethiopia.
        </span>
      </h1>

      <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
        {isAuthenticated
          ? "Pick up where you left off—roadmaps, resumes, market matches, and AI guidance are ready in your dashboard."
          : "Data-driven career guidance for the next generation of Ethiopian tech leaders. Bridge the gap between education and global employability."}
      </p>

      <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
        {isHydrated ? (
          <Button
            asChild
            size="lg"
            className="h-14 w-full rounded-md px-8 font-semibold sm:w-auto"
          >
            <Link href={primaryHref} className="flex w-full justify-center">
              {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div className="h-14 w-full rounded-md bg-muted sm:w-40" />
        )}
        <Button
          size="lg"
          variant="outline"
          className="h-14 w-full rounded-md border-primary/25 px-8 font-semibold text-primary hover:bg-primary/5 sm:w-auto"
          asChild
        >
          <Link
            href={
              isAuthenticated ? "/dashboard/market-trends" : "/market-insight"
            }
          >
            {isAuthenticated ? "Your market trends" : "Explore trends"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
