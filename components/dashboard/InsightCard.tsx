import { Sparkles, ArrowRight } from "lucide-react";

export default function InsightCard() {
  return (
    <div className="flex flex-col justify-between rounded-3xl sm:rounded-[40px] bg-[#b0002d] p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-rose-900/10 min-h-75 lg:min-h-0">
      <div className="space-y-4 sm:space-y-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 sm:px-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
          <Sparkles className="h-3 w-3 shrink-0" /> AI Insight
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
          Your skill alignment for Senior DevOps roles is 92%. Check the gaps
          now.
        </h2>
      </div>

      <button className="flex items-center w-fit gap-2 text-base sm:text-lg font-bold transition-transform hover:translate-x-2 mt-8 lg:mt-0">
        Analyze Gaps <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  );
}
