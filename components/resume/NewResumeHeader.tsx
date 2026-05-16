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
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to resumes
        </Link>
        <Button
          type="button"
          disabled={!onGenerate || isGenerating}
          onClick={onGenerate}
          className="h-11 rounded-full bg-[#2563eb] px-8 font-semibold text-white hover:bg-blue-700 shadow-md disabled:opacity-60"
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
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563eb]">
          AI resume builder
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[52px]">
          Target your next role
        </h1>
        <p className="text-[17px] leading-relaxed text-slate-500">
          Choose a current trending role. We&apos;ll generate a tailored resume
          aligned with market demand and your profile.
        </p>
      </div>
    </div>
  );
}
