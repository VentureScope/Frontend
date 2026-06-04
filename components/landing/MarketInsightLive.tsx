"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInDemandSkills, getJobStats } from "@/lib/jobs-api";
import type { InDemandSkill, JobStats } from "@/types/jobs";
import { useLandingAuth } from "@/hooks/useLandingAuth";
import { SkillDemandPanel } from "@/components/landing/market/SkillDemandPanel";
import { MarketStatsPanel } from "@/components/landing/market/MarketStatsPanel";
import { LandingMarketAnalysisSection } from "@/components/landing/market/LandingMarketAnalysisSection";
import { ProfileMatchesPanel } from "@/components/landing/market/ProfileMatchesPanel";
import { MARKET_TOP_K } from "@/lib/job-market-insights";
import { MARKET_ALL_TIME_DAYS } from "@/lib/market-analytics-period";
import { MarketAnalyticsPeriodSelect } from "@/components/market/MarketAnalyticsPeriodSelect";
import { useMarketAnalyticsPeriod } from "@/hooks/useMarketAnalyticsPeriod";
import { logMarketSectionFailure } from "@/lib/log-jobs-api";

export default function MarketInsightLive() {
  const { days, lookbackPhrase } = useMarketAnalyticsPeriod();
  const { isAuthenticated, dashboardHref, registerHref, signInHref } =
    useLandingAuth();
  const [skills, setSkills] = useState<InDemandSkill[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [allTimeStats, setAllTimeStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [sk, st, allSt] = await Promise.all([
          getInDemandSkills({ limit: MARKET_TOP_K.skills, period: days }),
          getJobStats({ period: days }),
          getJobStats({ period: MARKET_ALL_TIME_DAYS }),
        ]);
        if (cancelled) {
          return;
        }
        setSkills(sk);
        setStats(st);
        setAllTimeStats(allSt);
        setUpdatedAt(new Date());
      } catch (err) {
        logMarketSectionFailure("MarketInsightLive", err);
        if (!cancelled) {
          setError("Could not load market analytics.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const updatedLabel =
    loading || updatedAt == null
      ? null
      : updatedAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <div className="bg-muted/50 pb-24">
      <div className="mx-auto max-w-7xl space-y-10 px-4 pt-8 sm:space-y-14 sm:px-6 sm:pt-16 lg:px-8">
        <header className="space-y-4">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-label text-primary">Live market intelligence</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Market Insights
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0">
              {isAuthenticated
                ? "Compare live hiring signals with projected demand—then continue in your dashboard for personalized matches and roadmaps."
                : "Explore in-demand skills, live job corpus stats, and projected role demand across Ethiopia's tech economy."}
            </p>
          </div>
          {updatedLabel && (
            <p className="text-center text-xs text-muted-foreground md:text-left">
              Live data last refreshed at {updatedLabel}
            </p>
          )}
        </header>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-label text-primary">Current market</p>
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Live snapshot
              </h2>
              <p className="text-sm text-muted-foreground">
                Skills and listings indexed in {lookbackPhrase}.
              </p>
            </div>
            <div className="flex items-center gap-3 self-center sm:self-auto">
              <MarketAnalyticsPeriodSelect disabled={loading} compact />
              <div
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
                aria-live="polite"
              >
                <RefreshCw
                  className={`h-4 w-4 shrink-0 text-primary ${loading ? "animate-spin" : ""}`}
                  aria-hidden
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {loading ? "Updating…" : updatedLabel ? updatedLabel : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
            <div className="lg:col-span-2">
              <SkillDemandPanel skills={skills} loading={loading} />
            </div>
            <MarketStatsPanel
              stats={stats}
              allTimeStats={allTimeStats}
              loading={loading}
            />
          </div>
        </section>

        <section aria-labelledby="forecast-heading" className="space-y-5">
          <LandingMarketAnalysisSection />
        </section>

        <section aria-labelledby="matches-heading" className="space-y-1">
          <p className="text-label text-primary">Personalized</p>
          <h2
            id="matches-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Profile-based matches
          </h2>
          <ProfileMatchesPanel signedIn={isAuthenticated} />
        </section>

        <section className="vs-dot-grid relative overflow-hidden rounded-xl border border-border bg-linear-to-b from-muted to-background p-8 text-center sm:rounded-xl sm:p-12 lg:p-20">
          <div className="relative z-10 mx-auto max-w-2xl space-y-6 sm:space-y-8">
            <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
              Turn insights into a career plan
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {isAuthenticated
                ? "Your dashboard uses this same market data for roadmaps, resumes, and ranked job matches."
                : "Generate learning roadmaps, tailored resumes, and profile-based job matches—all grounded in the same market data you see here."}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                asChild
                className="h-12 rounded-xl px-8 font-bold sm:h-14 sm:px-10"
              >
                <Link href={isAuthenticated ? dashboardHref : registerHref}>
                  {isAuthenticated ? "Open dashboard" : "Get started free"}
                </Link>
              </Button>
              {!isAuthenticated ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-xl border-border bg-card px-8 font-bold sm:h-14 sm:px-10"
                >
                  <Link href={signInHref}>Sign in</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-xl border-border bg-card px-8 font-bold sm:h-14 sm:px-10"
                >
                  <Link href="/dashboard/market-trends">Explore market trends</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
