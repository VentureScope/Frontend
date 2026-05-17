import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import InsightCard from "@/components/dashboard/InsightCard";
import ModuleGrid from "@/components/dashboard/ModuleGrid";
import DataSyncCard from "@/components/dashboard/DataSyncCard";
import MarketTrendsCard from "@/components/dashboard/MarketTrendsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SuggestedActions from "@/components/dashboard/SuggestedActions";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WelcomeHeader />
        </div>
        <InsightCard />
      </div>

      <ModuleGrid />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <DataSyncCard />
        <div className="lg:col-span-2">
          <MarketTrendsCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <SuggestedActions />
      </div>
    </div>
  );
}
