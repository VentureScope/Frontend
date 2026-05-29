"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";

/** Job match API is disabled (501); card shows CTA until backend is live. */
export default function ProfileJobMatchesCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">Top job matches</h3>
        <Link
          href="/dashboard/market-trends"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Market trends →
        </Link>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Personalized job matches are coming soon. Explore market demand and
        trending roles in the meantime.
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
