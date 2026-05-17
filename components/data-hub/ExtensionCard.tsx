// components/data-hub/ExtensionCard.tsx
import { Chrome, ShieldCheck, Zap, Download } from "lucide-react";

export default function ExtensionCard() {
  return (
    <div className="vs-surface flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground sm:h-12 sm:w-12">
          <Chrome className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            Browser Extension
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Automate your academic data extraction. Seamlessly pull grades and
            transcripts from university portals with one click.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3 sm:gap-3 sm:p-4">
            <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground sm:h-5 sm:w-5" />
            <span className="text-[10px] font-semibold text-foreground sm:text-xs">
              Secure data extraction
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3 sm:gap-3 sm:p-4">
            <Zap className="h-4 w-4 shrink-0 text-muted-foreground sm:h-5 sm:w-5" />
            <span className="text-[10px] font-semibold text-foreground sm:text-xs">
              One-click transcript parsing
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-muted py-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/80 sm:mt-10 sm:py-3.5 sm:text-sm"
      >
        <Download className="h-4 w-4 sm:h-5 sm:w-5" /> Install Extension
      </button>
    </div>
  );
}
