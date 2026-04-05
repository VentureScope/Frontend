import { TrendingUp } from "lucide-react";

export default function JobListingsStat() {
  return (
    <div className="flex flex-col justify-between rounded-[32px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md">
      <div className="space-y-4">
        {/* Uppercase Label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
          Total Job Listings Scraped
        </p>

        {/* Large Counter */}
        <h2 className="text-5xl font-black tracking-tighter text-slate-900">
          14,282
        </h2>
      </div>

      {/* Trend Indicator */}
      <div className="mt-8 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[11px] font-bold text-emerald-600 w-fit border border-emerald-100/50">
        <TrendingUp size={14} strokeWidth={3} />
        <span>+12.4% vs last month</span>
      </div>
    </div>
  );
}
