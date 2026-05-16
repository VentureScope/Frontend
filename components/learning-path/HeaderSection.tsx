import { Sparkles, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HeaderSection = () => {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-8 bg-primary" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Strategic Intelligence
          </p>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Learning Paths
        </h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Customized intelligence frameworks and adaptive roadmaps designed for
          your unique career transition into emerging technology roles.
        </p>
      </div>

      <Button
        asChild
        className="h-12 gap-2 rounded-full bg-primary px-8 font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
      >
        <Link href="/dashboard/learning-path/new-roadmap">
          <Plus />
          New Roadmap</Link>
      </Button>
    </div>
  );
};
