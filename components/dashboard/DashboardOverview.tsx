"use client";

import { useState } from "react";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import InsightCard from "@/components/dashboard/InsightCard";
import ModuleGrid from "@/components/dashboard/ModuleGrid";
import DataSyncCard from "@/components/dashboard/DataSyncCard";
import MarketTrendsCard from "@/components/dashboard/MarketTrendsCard";
import JobListingsStat from "@/components/market/JobListingsStat";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SuggestedActions from "@/components/dashboard/SuggestedActions";
import CareerReadinessPanel from "@/components/dashboard/CareerReadinessPanel";
import { MarketAnalyticsPeriodSelect } from "@/components/market/MarketAnalyticsPeriodSelect";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardOverview() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);
  const { data, loading: sectionLoading, error, refreshReadiness, reload, lookbackPhrase } =
    useDashboardOverview(profile.careerInterest);
  const [refreshingReadiness, setRefreshingReadiness] = useState(false);

  const handleRefreshReadiness = async () => {
    setRefreshingReadiness(true);
    try {
      await refreshReadiness();
    } finally {
      setRefreshingReadiness(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      {error &&
      !sectionLoading.readiness &&
      !sectionLoading.roadmaps &&
      !sectionLoading.resumes ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-destructive">{error}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="shrink-0 text-xs font-semibold text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        <div className="vs-surface flex h-full min-h-0 flex-col p-6 sm:p-8 md:col-span-1 lg:col-span-2">
          <WelcomeHeader
            readinessScore={data.readinessScore}
            readinessLevel={data.readiness?.level}
            loading={sectionLoading.readiness}
          />
        </div>
        <InsightCard
          headline={data.insightHeadline}
          loading={sectionLoading.readiness}
          readiness={data.readiness}
          className="min-h-[220px] md:min-h-0 lg:min-h-0"
        />
      </div>

      <CareerReadinessPanel
        readiness={data.readiness}
        loading={sectionLoading.readiness}
        refreshing={refreshingReadiness}
        onRefresh={() => void handleRefreshReadiness()}
        variant="compact"
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-8">
          <ModuleGrid
            activeRoadmap={data.activeRoadmap}
            latestResume={data.latestResume}
            profileMatchPercent={data.profileMatchPercent}
            roadmapsLoading={sectionLoading.roadmaps}
            resumesLoading={sectionLoading.resumes}
          />
        </div>
        <div className="flex h-full min-h-0 lg:col-span-4">
          <DataSyncCard
            items={data.syncItems}
            loading={sectionLoading.sync}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Market analytics
          </p>
          <MarketAnalyticsPeriodSelect
            disabled={sectionLoading.market}
            compact
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-4">
            <JobListingsStat
              stats={data.jobStats}
              loading={sectionLoading.jobStats}
              lookbackPhrase={lookbackPhrase}
            />
          </div>
          <div className="lg:col-span-8">
            <MarketTrendsCard
              trending={data.trendingCareers}
              skills={data.inDemandSkills}
              loading={sectionLoading.market}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        <div className="md:col-span-1 lg:col-span-2">
          <RecentActivity
            activities={data.activities}
            unreadCount={data.unreadNotifications}
            loading={sectionLoading.notifications}
          />
        </div>
        <SuggestedActions
          actions={data.suggestedActions}
          loading={sectionLoading.suggestedActions}
        />
      </div>
    </div>
  );
}
