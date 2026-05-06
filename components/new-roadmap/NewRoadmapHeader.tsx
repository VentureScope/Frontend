import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const NewRoadmapHeader = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/learning-path"
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Hub
        </Link>
        <Button className="h-11 rounded-full bg-[#2563eb] px-8 font-semibold text-white hover:bg-blue-700 shadow-md">
          Generate Roadmap
        </Button>
      </div>

      <div className="max-w-2xl space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563eb]">
          Strategic Intelligence
        </p>
        <h1 className="text-[52px] font-bold leading-tight tracking-tight text-[#0f172a]">
          Design Your Next Evolution
        </h1>
        <p className="text-[17px] leading-relaxed text-slate-500">
          Select a target role to generate a personalized, data-backed learning
          roadmap. Our AI analyzes millions of career trajectories to map your
          optimal path.
        </p>
      </div>
    </div>
  );
};
