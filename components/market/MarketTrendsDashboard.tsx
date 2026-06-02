"use client";

import { useEffect, useMemo, useState } from "react";
import MarketForecastChart from "@/components/market/MarketForcastChart";
import { MarketAnalyticsPeriodSelect } from "@/components/market/MarketAnalyticsPeriodSelect";
import InDemandSkills from "@/components/market/InDemandSkills";
import JobListingsStat from "@/components/market/JobListingsStat";
import TopHiringCompanies from "@/components/market/TopHiringCompanies";
import EmergingTrends from "@/components/market/EmergingTrends";
import IntelligenceLayerSummary from "@/components/market/IntelligenceLayerSummary";
import { TrendingRolesPanel } from "@/components/landing/market/TrendingRolesPanel";
import { useMarketAnalyticsPeriod } from "@/hooks/useMarketAnalyticsPeriod";
import {
  getInDemandSkills,
  getJobStats,
  getJobsByCategory,
  getTrendingCareers,
} from "@/lib/jobs-api";
import {
  aggregateTopHiringCompanies,
  buildEmergingTrendItems,
  MARKET_TOP_K,
  parseCategoryJob,
  statsInsight,
  topSkillInsight,
  type HiringCompanyRow,
} from "@/lib/job-market-insights";
import type {
  InDemandSkill,
  JobByCategoryRow,
  JobStats,
  TrendingCareer,
} from "@/types/jobs";

export default function MarketTrendsDashboard() {
  const { days, lookbackPhrase } = useMarketAnalyticsPeriod();
  const [stats, setStats] = useState<JobStats | null>(null);
  const [allTimeStats, setAllTimeStats] = useState<JobStats | null>(null);
  const [skills, setSkills] = useState<InDemandSkill[]>([]);
  const [trending, setTrending] = useState<TrendingCareer[]>([]);
  const [topCompanies, setTopCompanies] = useState<HiringCompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [st, allSt, sk, tr] = await Promise.all([
          getJobStats({ period: days }),
          getJobStats({ period: 3650 }),
          getInDemandSkills({ limit: MARKET_TOP_K.skills, period: days }),
          getTrendingCareers({ limit: 8, period: days }),
        ]);
        if (!cancelled) {
          setStats(st);
          setAllTimeStats(allSt);
          setSkills(sk);
          setTrending(tr);
          if (tr.length === 0) {
            setError("No trending roles returned from the market API.");
          }
        }

        const categories = tr
          .slice(0, 3)
          .map((c) => c.name)
          .filter(Boolean);
        if (categories.length > 0 && !cancelled) {
          setLoadingCompanies(true);
          try {
            const batches = await Promise.all(
              categories.map((category) =>
                getJobsByCategory({ category, limit: 40 }).catch(
                  () => [] as JobByCategoryRow[],
                ),
              ),
            );
            if (!cancelled) {
              const parsed = batches.flatMap((rows, batchIndex) =>
                rows.map((row, i) =>
                  parseCategoryJob(row, batchIndex * 100 + i),
                ),
              );
              setTopCompanies(
                aggregateTopHiringCompanies(
                  parsed,
                  MARKET_TOP_K.hiringCompanies,
                ),
              );
            }
          } catch {
            if (!cancelled) {
              setTopCompanies([]);
            }
          } finally {
            if (!cancelled) {
              setLoadingCompanies(false);
            }
          }
        }
      } catch {
        if (!cancelled) {
          setError(
            "Some market data could not be loaded. Forecasts may still be available.",
          );
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

  const emergingTrends = useMemo(
    () => buildEmergingTrendItems(trending, skills, 2, lookbackPhrase),
    [trending, skills, lookbackPhrase],
  );

  const intelligenceInsight = useMemo(() => {
    const skillLine = topSkillInsight(skills);
    const statsLine = stats ? statsInsight(stats) : null;
    const lead = trending[0];
    const trendingLine = lead
      ? `${lead.name} leads hiring volume with ${lead.job_count.toLocaleString()} indexed openings.`
      : null;
    return skillLine ?? statsLine ?? trendingLine;
  }, [skills, stats, trending]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-label text-primary">Career intelligence</p>
          <h1 className="text-h1 text-foreground">Market Trends & Forecasting</h1>
          <p className="max-w-2xl text-body text-muted-foreground">
            Real-time career intelligence and AI-driven posting forecasts for
            Ethiopia&apos;s tech ecosystem.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <MarketAnalyticsPeriodSelect disabled={loading} compact />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-8">
          <MarketForecastChart periodDays={days} />

          <div className="vs-surface overflow-hidden p-6 sm:p-8">
            <TrendingRolesPanel
              careers={trending}
              loading={loading}
              limit={6}
              title="Trending roles"
              embedded
              showInsight
              lookbackPhrase={lookbackPhrase}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
            <JobListingsStat stats={stats} allTimeStats={allTimeStats} loading={loading} />
            <TopHiringCompanies
              companies={topCompanies}
              loading={loading || loadingCompanies}
            />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <InDemandSkills skills={skills} loading={loading} />
          <EmergingTrends items={emergingTrends} loading={loading} />
          <IntelligenceLayerSummary insight={intelligenceInsight} />
        </div>
      </div>
    </div>
  );
}
