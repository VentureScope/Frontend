"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getInDemandSkills,
  getJobStats,
  getTrendingCareers,
} from "@/lib/jobs-api";
import type { InDemandSkill, JobStats, TrendingCareer } from "@/types/jobs";
import { MarketStatsPanel } from "@/components/landing/market/MarketStatsPanel";
import { SkillDemandPanel } from "@/components/landing/market/SkillDemandPanel";
import { TrendingRolesPanel } from "@/components/landing/market/TrendingRolesPanel";
import { MARKET_TOP_K, trendingInsight } from "@/lib/job-market-insights";

export function AboutMarketInsights() {
  const [skills, setSkills] = useState<InDemandSkill[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [trending, setTrending] = useState<TrendingCareer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sk, st, tr] = await Promise.all([
          getInDemandSkills({ limit: 5 }),
          getJobStats(),
          getTrendingCareers({ limit: 4, period: 30 }),
        ]);
        if (!cancelled) {
          setSkills(sk);
          setStats(st);
          setTrending(tr);
        }
      } catch {
        /* keep section with empty states */
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

  const trendNote = trendingInsight(trending);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div className="max-w-xl text-center md:text-left">
          <span className="vs-accent-chip inline-flex rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            Data-backed mission
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">
            The market we&apos;re building for
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            VentureScope indexes real job postings and employer activity so
            graduates see where demand is—not guesswork from outdated advice.
          </p>
          {trendNote && !loading && (
            <p className="mt-4 text-sm text-muted-foreground border-l-2 border-primary pl-3 leading-relaxed">
              {trendNote}
            </p>
          )}
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-border text-primary font-bold shrink-0"
        >
          <Link href="/market-insight">
            Full market report <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <MarketStatsPanel stats={stats} loading={loading} variant="inline" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8 shadow-sm">
          <SkillDemandPanel
            skills={skills}
            loading={loading}
            compact
            title="Top skills in demand"
          />
        </div>
        <TrendingRolesPanel careers={trending} loading={loading} />
      </div>
    </section>
  );
}
