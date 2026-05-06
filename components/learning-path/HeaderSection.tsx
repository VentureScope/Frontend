import { Sparkles, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HeaderSection = () => {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-8 bg-blue-600" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
            Strategic Intelligence
          </p>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-[#0f172a]">
          Learning Paths
        </h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-slate-500">
          Customized intelligence frameworks and adaptive roadmaps designed for
          your unique career transition into emerging technology roles.
        </p>
      </div>

      <Button
        asChild
        className="h-12 gap-2 rounded-full bg-[#0052cc] px-8 font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
      >
        <Link href="/dashboard/learning-path/new-roadmap">
          <Plus />
          New Roadmap</Link>
      </Button>
    </div>
  );
};
