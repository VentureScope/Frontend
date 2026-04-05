// components/resume/AtsAnalytics.tsx
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AtsAnalytics() {
  return (
    <div className="rounded-[40px] bg-white p-10 shadow-sm border border-slate-100 space-y-10">
      <div className="flex items-center gap-10">
        {/* ATS Score Circle */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg className="h-full w-full -rotate-90">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#f1f5f9" strokeWidth="12" />
            <circle cx="56" cy="56" r="48" fill="none" stroke="#1d59db" strokeWidth="12" 
              strokeDasharray="301" strokeDashoffset="36" strokeLinecap="round" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-slate-900">88</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ATS Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Critical Suggestions</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[13px] font-bold text-rose-600">
              <AlertCircle size={16} />
              <span>Missing keyword: "Stakeholder Management"</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-blue-600">
              <CheckCircle2 size={16} />
              <span>Quantifiable results found (40% increase)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
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
