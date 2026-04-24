// components/resume/AtsAnalytics.tsx
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AtsAnalytics() {
  return (
    <div className="space-y-7 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:space-y-10 sm:p-7 lg:rounded-[40px] lg:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-10">
        {/* ATS Score Circle */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28">
          <svg className="h-full w-full -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="12"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="#1d59db"
              strokeWidth="12"
              strokeDasharray="301"
              strokeDashoffset="36"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black text-slate-900 sm:text-3xl">
              88
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              ATS Score
            </span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-3 sm:space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Critical Suggestions
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-[13px] font-bold text-rose-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span className="wrap-break-word">
                Missing keyword: "Stakeholder Management"
              </span>
            </div>
            <div className="flex items-start gap-2 text-[13px] font-bold text-blue-600">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span className="wrap-break-word">
                Quantifiable results found (40% increase)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
          <span>Keyword Density</span>
          <span>Optimal (4.2%)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-[80%] bg-blue-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// components/resume/ResumePreview.tsx
