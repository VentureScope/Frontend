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
          className="text-btn flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={18} />
          Back to Hub
        </Link>
        <Button
          type="button"
          disabled={!onGenerate || isGenerating}
          onClick={onGenerate}
          className="h-11 rounded-lg bg-primary px-8 font-medium text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            "Generate Roadmap"
          )}
        </Button>
      </div>

      <div className="max-w-2xl space-y-4">
        <p className="text-label text-primary">Strategic Intelligence</p>
        <h1 className="text-h1 text-foreground">Design Your Next Evolution</h1>
        <p className="text-body text-muted-foreground">
          Select a target role to generate a personalized, data-backed learning
          roadmap. Our AI analyzes millions of career trajectories to map your
          optimal path.
        </p>
      </div>
    </div>
  );
};
