import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const NewRoadmapHeader = ({
  onGenerate,
  isGenerating,
}: {
  onGenerate?: () => void;
  isGenerating?: boolean;
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/learning-path"
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Hub
        </Link>
        <Button
          type="button"
          disabled={!onGenerate || isGenerating}
          onClick={onGenerate}
          className="h-11 rounded-full bg-[#2563eb] px-8 font-semibold text-white hover:bg-primary/90 shadow-md disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
              Generating…
            </>
          ) : (
            "Generate Roadmap"
          )}
        </Button>
      </div>

      <div className="max-w-2xl space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          Strategic Intelligence
        </p>
        <h1 className="text-[52px] font-bold leading-tight tracking-tight text-foreground">
          Design Your Next Evolution
        </h1>
        <p className="text-[17px] leading-relaxed text-muted-foreground">
          Select a target role to generate a personalized, data-backed learning
          roadmap. Our AI analyzes millions of career trajectories to map your
          optimal path.
        </p>
      </div>
    </div>
  );
};
