// components/dashboard/ModuleGrid.tsx
import { BookOpen, HelpCircle, FileText, Send } from "lucide-react";

export default function ModuleGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      {/* Active Module */}
      <div className="rounded-2xl sm:rounded-[32px] border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div className="rounded-xl bg-primary/10 p-2 sm:p-3 text-primary">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Active Module
          </span>
        </div>
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Advanced ARIMA Modeling
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Mastering Time Series Analysis
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-muted-foreground">
            <span>Progress</span>
            <span>62%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "62%" }} />
          </div>
        </div>
      </div>

      {/* AI Advisor Input */}
      <div className="rounded-2xl sm:rounded-[32px] border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div className="rounded-xl bg-accent p-2 sm:p-3 text-[var(--brand-accent)]">
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-1 rounded">
            Online
          </span>
        </div>
        <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-foreground">
          Ask your advisor anything
        </h3>
        <div className="relative">
          <input
            placeholder="How can I negotiate my salary?"
            className="w-full rounded-xl sm:rounded-2xl bg-muted border-none p-4 sm:p-5 pr-10 sm:pr-12 text-xs sm:text-sm text-muted-foreground focus:ring-2 focus:ring-primary/20"
          />
          <Send className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary cursor-pointer" />
        </div>
      </div>

      {/* Resume Card */}
      <div className="rounded-2xl sm:rounded-[32px] border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div className="rounded-xl bg-orange-50 p-2 sm:p-3 text-orange-600">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="text-right">
            <p className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              ATS Match
            </p>
            <p className="text-lg sm:text-xl font-bold text-orange-600">92%</p>
          </div>
        </div>
        <h3 className="mb-6 sm:mb-8 text-lg sm:text-xl font-bold text-foreground">
          Resume Version 4.2
        </h3>
        <button className="w-full rounded-xl sm:rounded-2xl bg-primary/10 py-3 sm:py-4 text-sm sm:text-base font-bold text-primary hover:bg-primary/15 transition-colors">
          Build New Resume
        </button>
      </div>
    </div>
  );
}
