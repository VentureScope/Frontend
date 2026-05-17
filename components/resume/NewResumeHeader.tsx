import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NewResumeHeader({
  onGenerate,
  isGenerating,
}: {
  onGenerate?: () => void;
  isGenerating?: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/resume-builder"
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          Back to resumes
        </Link>
        <Button
          type="button"
          disabled={!onGenerate || isGenerating}
          onClick={onGenerate}
          className="h-11 rounded-lg bg-primary px-8 font-medium text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
              Generating…
            </>
          ) : (
            "Generate resume"
          )}
        </Button>
      </div>

      <div className="max-w-2xl space-y-4">
        <p className="text-label text-primary">AI resume builder</p>
        <h1 className="text-h1 text-foreground">Target your next role</h1>
        <p className="text-body text-muted-foreground">
          Choose a current trending role. We&apos;ll generate a tailored resume
          aligned with market demand and your profile.
        </p>
      </div>
    </div>
  );
}
