"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import InDemandSkills from "@/components/market/InDemandSkills";
import { MarketInsightStrip } from "@/components/market/MarketInsightStrip";
import { MarketSectionError } from "@/components/market/MarketSectionError";
import TopHiringCompanies from "@/components/market/TopHiringCompanies";
import { TrendingRolesPanel } from "@/components/landing/market/TrendingRolesPanel";
import { MARKET_TRENDS_PANEL_LIMIT } from "@/lib/queries/constants";
import type { HiringCompanyRow, MarketInsightCard } from "@/lib/job-market-insights";
import type { InDemandSkill, TrendingCareer } from "@/types/jobs";

type CurrentMarketPanelProps = {
  trending: TrendingCareer[];
  skills: InDemandSkill[];
  topCompanies: HiringCompanyRow[];
  companyCategories: string[];
  currentInsights: MarketInsightCard[];
  lookbackPhrase: string;
  loadingTrending: boolean;
  loadingSkills: boolean;
  loadingCompanies: boolean;
  errors: {
    trending: boolean;
    skills: boolean;
    companies: boolean;
  };
  onRetryTrending: () => void;
  onRetrySkills: () => void;
  onRetryCompanies: () => void;
};

export function CurrentMarketPanel({
  trending,
  skills,
  topCompanies,
  companyCategories,
  currentInsights,
  lookbackPhrase,
  loadingTrending,
  loadingSkills,
  loadingCompanies,
  errors,
  onRetryTrending,
  onRetrySkills,
  onRetryCompanies,
}: CurrentMarketPanelProps) {
  return (
    <div className="space-y-6">
      <MarketInsightStrip
        insights={currentInsights}
        loading={loadingTrending}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-8">
          {errors.trending ? (
            <MarketSectionError
              message="Trending roles could not be loaded."
              onRetry={onRetryTrending}
            />
          ) : (
            <div className="vs-surface overflow-hidden p-6 sm:p-8">
              <TrendingRolesPanel
                careers={trending}
                loading={loadingTrending}
                limit={MARKET_TRENDS_PANEL_LIMIT}
                title="Trending roles"
                embedded
                showInsight
                lookbackPhrase={lookbackPhrase}
              />
              <div className="mt-6 border-t border-border pt-4">
                <Button variant="outline" size="sm" className="gap-1.5" asChild>
                  <Link href="/dashboard/learning-path/new-roadmap">
                    Generate roadmap from a trending role
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          {errors.skills ? (
            <MarketSectionError
              message="In-demand skills could not be loaded."
              onRetry={onRetrySkills}
            />
          ) : (
            <InDemandSkills skills={skills} loading={loadingSkills} />
          )}
        </div>
      </div>

      {errors.companies ? (
        <MarketSectionError
          message="Top hiring companies could not be loaded."
          onRetry={onRetryCompanies}
        />
      ) : (
        <TopHiringCompanies
          companies={topCompanies}
          loading={loadingCompanies}
          categories={companyCategories}
        />
      )}

    </div>
  );
}
