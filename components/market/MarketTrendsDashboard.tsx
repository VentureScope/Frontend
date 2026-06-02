"use client";

import { formatRelativeTime } from "@/lib/dashboard-utils";
import { CurrentMarketPanel } from "@/components/market/CurrentMarketPanel";
import { FutureMarketPanel } from "@/components/market/FutureMarketPanel";
import { MarketAnalyticsPeriodSelect } from "@/components/market/MarketAnalyticsPeriodSelect";
import {
  MARKET_TRENDS_CURRENT_TAB,
} from "@/lib/market-trends-tabs";
import {
  MarketTrendsTabs,
} from "@/components/market/MarketTrendsTabs";
import { useMarketTrendsPage } from "@/hooks/useMarketTrendsPage";

export default function MarketTrendsDashboard() {
  const page = useMarketTrendsPage();

  const updatedLabel =
    page.updatedAt != null
      ? `Updated ${formatRelativeTime(new Date(page.updatedAt).toISOString())}`
      : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-label text-primary">Career intelligence</p>
          <h1 className="text-h1 text-foreground">Market Trends</h1>
          <p className="max-w-2xl text-body text-muted-foreground">
            {page.careerInterest ? (
              <>
                Explore live hiring signals and projected demand for
                Ethiopia&apos;s tech market. Your target role{" "}
                <span className="font-semibold text-foreground">
                  {page.careerInterest}
                </span>{" "}
                is pre-selected in forecasts when available.
              </>
            ) : (
              <>
                Explore live hiring signals and projected demand for
                Ethiopia&apos;s tech market — current listings and ensemble
                forecasts in one place.
              </>
            )}
          </p>
          {updatedLabel && (
            <p className="text-xs text-muted-foreground">
              {updatedLabel}
              {page.isRefetching ? " · Refreshing…" : ""}
            </p>
          )}
        </div>
        {page.activeTab === MARKET_TRENDS_CURRENT_TAB ? (
          <MarketAnalyticsPeriodSelect busy={page.isRefetching} compact />
        ) : null}
      </header>

      <MarketTrendsTabs
        activeTab={page.activeTab}
        onTabChange={page.handleTabChange}
      />

      {page.activeTab === MARKET_TRENDS_CURRENT_TAB ? (
        <CurrentMarketPanel
          trending={page.trending}
          skills={page.skills}
          topCompanies={page.topCompanies}
          companyCategories={page.companyCategories}
          currentInsights={page.currentInsights}
          lookbackPhrase={page.lookbackPhrase}
          loadingTrending={page.loading.trending}
          loadingSkills={page.loading.skills}
          loadingCompanies={page.loading.companies}
          errors={page.errors}
          onRetryTrending={page.retryTrending}
          onRetrySkills={page.retrySkills}
          onRetryCompanies={page.retryCompanies}
        />
      ) : (
        <FutureMarketPanel
          forecasts={page.forecasts}
          forecastBars={page.forecastBars}
          forecastMeta={page.forecastMeta}
          futureInsights={page.futureInsights}
          selectedRoleId={page.selectedRoleId}
          onSelectRoleId={page.setSelectedRoleId}
          loading={page.loading.future}
          error={page.errors.future}
          empty={page.forecastsEmpty}
          onRetry={page.retryForecasts}
        />
      )}
    </div>
  );
}
