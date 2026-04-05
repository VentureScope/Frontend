import RoadmapHeader from "@/components/learning-path/RoadmapHeader";
import RoadmapTimeline from "@/components/learning-path/RoadmapTimeline";
import MarketFitCard from "@/components/learning-path/MarketFitCard";
import CredentialsCard from "@/components/learning-path/CredentialsCard";
import AdvisorTipCard from "@/components/learning-path/AdvisorTipCard";

export default function LearningPathPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Top Header Section */}
        <RoadmapHeader />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Roadmap Timeline (Left Column) */}
          <div className="lg:col-span-8">
            <RoadmapTimeline />
          </div>

          {/* Sidebar Insights (Right Column) */}
          <div className="space-y-8 lg:col-span-4">
            <MarketFitCard />
            <CredentialsCard />
            <AdvisorTipCard />
          </div>
        </div>
      </div>
    </div>
  );
}
