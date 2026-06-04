"use client";

import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrendingRolesPanel } from "@/components/landing/market/TrendingRolesPanel";
import { MarketStatsPanel } from "@/components/landing/market/MarketStatsPanel";
import { MarketAnalyticsPeriodSelect } from "@/components/market/MarketAnalyticsPeriodSelect";
import { useLandingAuth } from "@/hooks/useLandingAuth";
import { useLandingMarketPulse } from "@/hooks/useLandingMarketPulse";
import { MARKET_TOP_K } from "@/lib/job-market-insights";
import { MarketPulseRolesSkeleton } from "@/components/landing/market/MarketPulseSkeletons";

export default function MarketPulse() {
  const { isAuthenticated } = useLandingAuth();
  const { trending, stats, loading, usingFallback, lookbackPhrase } =
    useLandingMarketPulse({
      includeSkills: false,
      includeTrending: true,
    });

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/50 via-background to-muted/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-lg bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-xl border border-border/80 bg-card/90 p-6 sm:p-10 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <span className="vs-accent-chip inline-flex items-center gap-2 rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <Radio className="h-3 w-3 shrink-0" />
                Live market pulse
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight sm:text-4xl">
                Ethiopia Tech Market Pulse
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                Hiring signals from VentureScope—see which roles are gaining
                traction and where employers are hiring across the tech economy.
              </p>
              {usingFallback && !loading && (
                <p className="text-xs text-muted-foreground">
                  Showing sample market data while live feeds reconnect. Start
                  the API server on port 8000 if you are developing locally.
                </p>
              )}
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto lg:min-w-[200px]">
              <MarketAnalyticsPeriodSelect disabled={loading} compact />
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-md px-7 font-semibold sm:w-auto"
              >
                <Link
                  href={
                    isAuthenticated
                      ? "/dashboard/market-trends"
                      : "/market-insight"
                  }
                  className="inline-flex items-center justify-center gap-2"
                >
                  {isAuthenticated ? "Your market trends" : "Full market report"}
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {loading ? (
              <MarketPulseRolesSkeleton />
            ) : (
              <>
                <div className="min-w-0">
                  <p className="mb-3 text-label text-primary">Market overview</p>
                  <MarketStatsPanel
                    stats={stats}
                    loading={false}
                    variant="inline"
                    showCta={false}
                  />
                </div>

                <div className="min-w-0 rounded-lg border border-border bg-muted/50 p-5 sm:p-6">
                  <TrendingRolesPanel
                    careers={trending}
                    loading={false}
                    limit={MARKET_TOP_K.trending}
                    showGrowth
                    showInsight
                    title="Trending careers"
                    lookbackPhrase={lookbackPhrase}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
