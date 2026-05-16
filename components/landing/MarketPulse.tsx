"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getInDemandSkills,
  getJobStats,
  getTrendingCareers,
} from "@/lib/jobs-api";
import type { InDemandSkill, JobStats, TrendingCareer } from "@/types/jobs";
import { SkillDemandPanel } from "@/components/landing/market/SkillDemandPanel";
import { TrendingRolesPanel } from "@/components/landing/market/TrendingRolesPanel";
import { MarketStatsPanel } from "@/components/landing/market/MarketStatsPanel";
import { MARKET_TOP_K, statsInsight } from "@/lib/job-market-insights";
import { getMarketPulseFallbackData } from "@/lib/market-pulse-fallback";
import { MarketPulseGridSkeleton } from "@/components/landing/market/MarketPulseSkeletons";

const HOME_TRENDING_LIMIT = 3;

export default function MarketPulse() {
  const [skills, setSkills] = useState<InDemandSkill[]>([]);
  const [trending, setTrending] = useState<TrendingCareer[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setUsingFallback(false);
      try {
        const [sk, tr, st] = await Promise.all([
          getInDemandSkills({ limit: MARKET_TOP_K.skills }),
          getTrendingCareers({ limit: HOME_TRENDING_LIMIT, period: 30 }),
          getJobStats(),
        ]);
        if (!cancelled) {
          setSkills(sk);
          setTrending(tr);
          setStats(st);
        }
      } catch {
        if (!cancelled) {
          const fallback = getMarketPulseFallbackData();
          setSkills(fallback.skills);
          setTrending(fallback.trending);
          setStats(fallback.stats);
          setUsingFallback(true);
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
  }, []);

  const headline = stats && !loading ? statsInsight(stats) : null;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-blue-50/80 via-white to-slate-50/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-10 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                <Radio className="h-3 w-3" />
                Live market pulse
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Ethiopia Tech Market Pulse
              </h2>
              <p className="text-base text-slate-500 leading-relaxed">
                Hiring signals from VentureScope—see which skills and roles are
                gaining traction across the tech economy.
              </p>
              {headline && !loading && (
                <p className="text-sm text-slate-600 leading-relaxed rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  {headline}
                </p>
              )}
              {usingFallback && !loading && (
                <p className="text-xs text-slate-400">
                  Showing sample market data while live feeds reconnect.
                </p>
              )}
            </div>
            <Button
              asChild
              size="lg"
              className="h-12 shrink-0 rounded-full bg-[#1d59db] px-7 font-semibold shadow-lg shadow-blue-200/60 hover:bg-blue-700"
            >
              <Link href="/market-insight" className="gap-2">
                Full market report
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10">
            {loading ? (
              <MarketPulseGridSkeleton />
            ) : (
              <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
                <div className="lg:col-span-5 flex">
                  <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 sm:p-6">
                    <SkillDemandPanel
                      skills={skills}
                      loading={false}
                      compact
                      title="In-demand skills"
                    />
                  </div>
                </div>

                <div className="lg:col-span-4 flex">
                  <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 sm:p-6">
                    <TrendingRolesPanel
                      careers={trending}
                      loading={false}
                      compact
                      limit={HOME_TRENDING_LIMIT}
                      showGrowth={false}
                      showInsight={false}
                      title="Trending careers"
                    />
                  </div>
                </div>

                <div className="lg:col-span-3 flex">
                  <div className="flex-1 w-full">
                    <MarketStatsPanel
                      stats={stats}
                      loading={false}
                      showCta={false}
                      variant="hero"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
