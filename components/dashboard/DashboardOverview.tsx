"use client";

import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import InsightCard from "@/components/dashboard/InsightCard";
import ModuleGrid from "@/components/dashboard/ModuleGrid";
import DataSyncCard from "@/components/dashboard/DataSyncCard";
import MarketTrendsCard from "@/components/dashboard/MarketTrendsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SuggestedActions from "@/components/dashboard/SuggestedActions";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardOverview() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);
  const { data, loading } = useDashboardOverview(profile.careerInterest);

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WelcomeHeader
            readinessScore={data.readinessScore}
            loading={loading}
          />
        </div>
        <InsightCard headline={data.insightHeadline} loading={loading} />
      </div>

      <ModuleGrid
        activeRoadmap={data.activeRoadmap}
        latestResume={data.latestResume}
        profileMatchPercent={data.profileMatchPercent}
        loading={loading}
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <DataSyncCard items={data.syncItems} loading={loading} />
        <div className="lg:col-span-2">
          <MarketTrendsCard
            trending={data.trendingCareers}
            skills={data.inDemandSkills}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
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
