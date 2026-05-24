import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CreateOrgRoadmapHeader({
  orgId,
  orgName,
  onGenerate,
  isGenerating,
  canGenerate,
}: {
  orgId: string;
  orgName: string;
  onGenerate?: () => void;
  isGenerating?: boolean;
  canGenerate?: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/dashboard/organization/${orgId}/roadmaps`}
          className="text-btn flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={18} />
          Back to {orgName}
        </Link>
        <Button
          type="button"
          disabled={!canGenerate || !onGenerate || isGenerating}
          onClick={onGenerate}
          className="h-11 shrink-0 rounded-lg bg-primary px-8 font-medium text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            "Generate roadmap"
          )}
        </Button>
      </div>

      <div className="max-w-2xl space-y-4">
        <p className="text-label text-primary">Organization learning</p>
        <h1 className="text-h1 text-foreground">Create a team roadmap</h1>
        <p className="text-body text-muted-foreground">
          Choose a practice area, set the professional outcome you want the team
          to reach, and generate a shared path for {orgName}. Company and team
          context are applied automatically; market trends are optional.
        </p>
      </div>
    </div>
  );
}
