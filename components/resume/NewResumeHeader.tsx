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
          className="h-11 rounded-full bg-primary px-8 font-semibold text-white hover:bg-primary/90 shadow-md disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
              Generating??
            </>
          ) : (
            "Generate resume"
          )}
        </Button>
      </div>

      <div className="max-w-2xl space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          AI resume builder
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-[52px]">
          Target your next role
        </h1>
        <p className="text-[17px] leading-relaxed text-muted-foreground">
          Choose a current trending role. We&apos;ll generate a tailored resume
          aligned with market demand and your profile.
        </p>
      </div>
    </div>
  );
}
