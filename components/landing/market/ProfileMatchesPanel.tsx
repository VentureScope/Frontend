"use client";

import Link from "next/link";
import { Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingAuth } from "@/hooks/useLandingAuth";

/** Job match API is disabled (501); no fetch until backend is live. */
export function ProfileMatchesPanel({ signedIn }: { signedIn: boolean }) {
  const { signInHref } = useLandingAuth();

  if (!signedIn) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center">
        <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="text-sm font-bold text-foreground">
          Personalized job matches
        </h3>
        <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Sign in to see openings ranked against your skills, education, and
          GitHub activity—not just generic listings.
        </p>
        <Button asChild className="mt-4 rounded-lg" size="sm">
          <Link href={signInHref}>Sign in for matches</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-border bg-muted/60 p-5 sm:p-6">
      <h3 className="text-sm font-bold text-foreground mb-1">
        Matched to your profile
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Personalized job matches are coming soon. Explore market demand and
        trending roles in your dashboard in the meantime.
      </p>
      <Link
        href="/dashboard/market-trends"
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
      >
        <Briefcase className="h-3.5 w-3.5" />
        Explore hiring demand
      </Link>
    </div>
  );
}
