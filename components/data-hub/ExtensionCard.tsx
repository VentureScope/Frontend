import { Chrome, ShieldCheck, Zap, Download } from "lucide-react";
import { isTranscriptSynced } from "@/lib/data-hub-utils";
import type { TranscriptResponse } from "@/types/transcript";

type ExtensionCardProps = {
  transcript?: TranscriptResponse | null;
  versionCount?: number;
};

export default function ExtensionCard({
  transcript = null,
  versionCount = 0,
}: ExtensionCardProps) {
  const hasRecords = isTranscriptSynced(transcript);

  return (
    <div className="vs-surface-accent flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-start justify-between gap-3">
          <div className="vs-icon-tile vs-icon-tile-secondary h-10 w-10 sm:h-12 sm:w-12">
            <Chrome className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span
            className={
              hasRecords
                ? "vs-badge vs-badge-success"
                : "vs-badge bg-muted text-muted-foreground"
            }
          >
            {hasRecords ? "Records synced" : "Awaiting data"}
          </span>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            Browser Extension
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Automate academic data extraction. Pull grades and transcripts from
            university portals — uploads to{" "}
            <code className="text-[10px]">POST /api/transcripts/</code>.
          </p>
          {hasRecords && versionCount > 0 ? (
            <p className="text-xs font-semibold text-primary">
              {versionCount} transcript version
              {versionCount === 1 ? "" : "s"} stored on your account.
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 rounded-md border border-primary/15 bg-primary/5 p-3 sm:gap-3 sm:p-4">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
            <span className="text-[10px] font-semibold text-foreground sm:text-xs">
              Secure data extraction
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-accent/15 bg-accent/5 p-3 sm:gap-3 sm:p-4">
            <Zap className="h-4 w-4 shrink-0 text-accent sm:h-5 sm:w-5" />
            <span className="text-[10px] font-semibold text-foreground sm:text-xs">
              One-click transcript parsing
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-md border border-primary/25 bg-primary/10 py-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 sm:mt-10 sm:py-3.5 sm:text-sm"
      >
        <Download className="h-4 w-4 sm:h-5 sm:w-5" /> Install Extension
      </button>
    </div>
  );
}
