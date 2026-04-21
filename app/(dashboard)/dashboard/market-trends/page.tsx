import MarketForecastChart from "@/components/market/MarketForcastChart";
import InDemandSkills from "@/components/market/InDemandSkills";
import JobListingsStat from "@/components/market/JobListingsStat";
import TopHiringCompanies from "@/components/market/TopHiringCompanies";
import EmergingTrends from "@/components/market/EmergingTrends";
import IntelligenceLayerSummary from "@/components/market/IntelligenceLayerSummary";

export default function MarketTrendsPage() {
  return (
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-10">
        {/* Page Header */}
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a]">
            Market Trends & Forecasting
          </h1>
          <p className="text-base sm:text-lg text-slate-500">
            Real-time career intelligence and AI-driven growth projections for
            Ethiopia's tech ecosystem.
          </p>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Left Content Column */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-8">
            <div className="w-full">
              <MarketForecastChart />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <JobListingsStat />
              <TopHiringCompanies />
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-4">
            <InDemandSkills />
            <EmergingTrends />
            <IntelligenceLayerSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
