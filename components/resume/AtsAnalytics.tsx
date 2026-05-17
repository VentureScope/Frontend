// components/resume/AtsAnalytics.tsx
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AtsAnalytics() {
  return (
    <div className="space-y-7 rounded-xl border border-border bg-card p-5 shadow-sm sm:space-y-10 sm:p-7 lg:rounded-xl lg:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-10">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 112 112">
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="currentColor"
              className="text-muted"
              strokeWidth="12"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="12"
              strokeDasharray="301"
              strokeDashoffset="36"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-semibold text-foreground sm:text-3xl">
              88
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              ATS Score
            </span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-3 sm:space-y-4">
          <h3 className="text-lg font-bold text-foreground">
            Critical Suggestions
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-[13px] font-bold text-destructive">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span className="wrap-break-word">
                Missing keyword: &quot;Stakeholder Management&quot;
              </span>
            </div>
            <div className="flex items-start gap-2 text-[13px] font-bold text-primary">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span className="wrap-break-word">
                Quantifiable results found (40% increase)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:text-[11px]">
          <span>Keyword Density</span>
          <span>Optimal (4.2%)</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[80%] rounded-lg bg-primary" />
        </div>
      </div>
    </div>
  );
}
