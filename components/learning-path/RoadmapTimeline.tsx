import { Check, Lock, ArrowRight, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoadmapTimeline() {
  return (
    <div className="relative pl-12">
      {/* The Continuous Vertical Line */}
      <div className="absolute left-[23px] top-4 bottom-0 w-[3px] bg-slate-100" />
      <div className="absolute left-[23px] top-4 h-[300px] w-[3px] bg-blue-600" />

      <div className="space-y-12">
        {/* COMPLETED MODULE */}
        <div className="relative">
          <div className="absolute -left-[37px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 ring-8 ring-white">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 opacity-70 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-blue-600">
                Completed
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Oct 2023
              </span>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">
              Foundational ML Architecture
            </h3>
            <p className="mb-6 text-slate-500 leading-relaxed">
              Mastered core concepts of supervised learning, cross-validation,
              and bias-variance tradeoff.
            </p>
            <div className="flex gap-2">
              {["Scikit-Learn", "Pandas"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVE MODULE */}
        <div className="relative">
          <div className="absolute -left-[37px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 ring-8 ring-blue-50">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
          <div className="rounded-[40px] border-2 border-blue-100 bg-white p-10 shadow-xl shadow-blue-500/5">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-full bg-blue-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                Active Focus
              </span>
              <div className="flex -space-x-2">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                  className="h-8 w-8 rounded-full border-2 border-white bg-slate-100"
                />
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-50 text-[10px] font-bold text-blue-600">
                  +3
                </div>
              </div>
            </div>
            <h3 className="mb-4 text-3xl font-black text-slate-900">
              Advanced ARIMA Modeling
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-slate-500">
              Deep dive into time-series forecasting for volatile market data.
              Includes SARIMA, VAR, and GARCH implementations.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="rounded-2xl bg-blue-50/50 p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">
                  Progress
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-1.5 flex-1 rounded-full bg-blue-100">
                    <div className="h-full w-[62%] rounded-full bg-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-blue-600">62%</span>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Due Date
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Friday, Nov 24
                </p>
              </div>
            </div>
            <Button className="h-14 w-full rounded-2xl bg-blue-600 text-base font-bold hover:bg-blue-700">
              Resume Module <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* LOCKED MODULE */}
        <div className="relative">
          <div className="absolute -left-[37px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-8 ring-white">
            <div className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
          <div className="rounded-[32px] border border-slate-50 bg-slate-50/50 p-8 opacity-60">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-slate-200 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Locked
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Coming Dec 2023
              </span>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">
              Mastering FastAPI & CI/CD
            </h3>
            <p className="mb-6 text-slate-500 leading-relaxed">
              Productionizing models with high-performance async APIs and
              automated testing pipelines.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-600">
              <Lock size={12} /> Requires ARIMA Completion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
