import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import InsightCard from "@/components/dashboard/InsightCard";
import ModuleGrid from "@/components/dashboard/ModuleGrid";
import DataSyncCard from "@/components/dashboard/DataSyncCard";
import MarketTrendsCard from "@/components/dashboard/MarketTrendsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SuggestedActions from "@/components/dashboard/SuggestedActions";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Section: Welcome & Hero Insight */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WelcomeHeader />
          </div>
          <InsightCard />
        </div>

        {/* Second Section: Status & Interaction Grid */}
        <ModuleGrid />

        {/* Third Section: Data & Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DataSyncCard />
          <div className="lg:col-span-2">
            <MarketTrendsCard />
          </div>
        </div>

        {/* Bottom Section: Activity & Suggestions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <SuggestedActions />
        </div>
      </div>
    </div>
  );
}
