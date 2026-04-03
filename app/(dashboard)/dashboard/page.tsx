import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/Header";
import ScoreCard from "@/components/dashboard/ScoreCard";
import SkillGapItem from "@/components/dashboard/SkillGapItem";
import JobCard from "@/components/dashboard/JobCard";
export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <Header />

        {/* TOP SECTION */}
        <ScoreCard />

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="col-span-2 space-y-4">
            <h2 className="font-semibold">Skill Gaps</h2>

            <SkillGapItem />
            <SkillGapItem />
            <SkillGapItem />
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            <h2 className="font-semibold">Best Matches</h2>

            <JobCard />
            <JobCard />
            <JobCard />
          </div>

        </div>
      </main>
    </div>
  );
}