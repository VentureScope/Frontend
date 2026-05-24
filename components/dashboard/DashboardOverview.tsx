"use client";

import { useState } from "react";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import InsightCard from "@/components/dashboard/InsightCard";
import ModuleGrid from "@/components/dashboard/ModuleGrid";
import DataSyncCard from "@/components/dashboard/DataSyncCard";
import MarketTrendsCard from "@/components/dashboard/MarketTrendsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SuggestedActions from "@/components/dashboard/SuggestedActions";
import CareerReadinessPanel from "@/components/dashboard/CareerReadinessPanel";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardOverview() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);
  const { data, loading, refreshReadiness } = useDashboardOverview(
    profile.careerInterest,
  );
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
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="vs-surface flex h-full min-h-0 flex-col p-6 sm:p-8 lg:col-span-2">
          <WelcomeHeader
            readinessScore={data.readinessScore}
            readinessLevel={data.readiness?.level}
            loading={loading}
          />
        </div>
        <InsightCard
          headline={data.insightHeadline}
          loading={loading}
          readiness={data.readiness}
          className="min-h-[220px] lg:min-h-0"
        />
      </div>

      <CareerReadinessPanel
        readiness={data.readiness}
        loading={loading}
        refreshing={refreshingReadiness}
        onRefresh={() => void handleRefreshReadiness()}
        variant="compact"
      />

      <ModuleGrid
        activeRoadmap={data.activeRoadmap}
        latestResume={data.latestResume}
        profileMatchPercent={data.profileMatchPercent}
        topJobMatch={data.topJobMatch}
        loading={loading}
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:items-stretch">
        <DataSyncCard items={data.syncItems} loading={loading} />
        <div className="lg:col-span-2">
          <MarketTrendsCard
            trending={data.trendingCareers}
            skills={data.inDemandSkills}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-2">
          <RecentActivity
            activities={data.activities}
            unreadCount={data.unreadNotifications}
            loading={loading}
          />
        </div>
        <SuggestedActions actions={data.suggestedActions} loading={loading} />
      </div>
    </div>
  );
}
