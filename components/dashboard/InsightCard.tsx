import { Sparkles, ArrowRight } from "lucide-react";

export default function InsightCard() {
  return (
    <div className="flex flex-col justify-between rounded-[40px] bg-[#b0002d] p-10 text-white shadow-xl shadow-rose-900/10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
          <Sparkles className="h-3 w-3" /> AI Insight
        </div>
        <h2 className="text-3xl font-bold leading-tight">
          Your skill alignment for Senior DevOps roles is 92%. Check the gaps
          now.
        </h2>
      </div>

      <button className="flex items-center gap-2 text-lg font-bold transition-transform hover:translate-x-2">
        Analyze Gaps <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
