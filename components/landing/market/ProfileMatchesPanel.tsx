"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ProfileMatchesSkeleton } from "@/components/landing/market/MarketPulseSkeletons";
import { Button } from "@/components/ui/button";
import type { JobMatch } from "@/types/jobs";
import {
  MARKET_TOP_K,
  matchFitLabel,
  profileMatchesInsight,
} from "@/lib/job-market-insights";

export function ProfileMatchesPanel({
  matches,
  loading,
  signedIn,
  limit = MARKET_TOP_K.profileMatches,
}: {
  matches: JobMatch[];
  loading: boolean;
  signedIn: boolean;
  limit?: number;
}) {
  const topMatches = matches.slice(0, limit);
  const insight = profileMatchesInsight(topMatches);

  if (!signedIn) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-6 text-center">
        <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900">
          Personalized job matches
        </h3>
        <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          Sign in to see openings ranked against your skills, education, and
          GitHub activity—not just generic listings.
        </p>
        <Button asChild className="mt-4 rounded-full" size="sm">
          <Link href="/sign-in">Sign in for matches</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
      <h3 className="text-sm font-bold text-slate-900 mb-1">
        Matched to your profile
      </h3>
      {insight && !loading && (
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">{insight}</p>
      )}

      {loading ? (
        <ProfileMatchesSkeleton rows={limit} />
      ) : topMatches.length === 0 ? (
        <p className="text-xs text-slate-600 leading-relaxed">
          Complete your profile and connect GitHub to unlock ranked matches.
        </p>
      ) : (
        <ul className="space-y-3">
          {topMatches.map((m) => {
            const fit = matchFitLabel(m.distance);
            return (
              <li
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-white p-4 border border-slate-100"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {m.job_title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {m.company_name}
                    {m.city ? ` · ${m.city}` : ""}
                    {m.job_type ? ` · ${m.job_type}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${fit.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 w-20 text-right">
                    {fit.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
