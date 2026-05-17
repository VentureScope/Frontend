import { TrendingUp } from "lucide-react";

export default function JobListingsStat() {
  return (
    <div className="flex flex-col justify-between rounded-lg sm:rounded-xl border border-border bg-card p-6 sm:p-10 shadow-sm transition-all hover:shadow-md">
      <div className="space-y-4">
        {/* Uppercase Label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Total Job Listings Scraped
        </p>

        {/* Large Counter */}
        <h2 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
          14,282
        </h2>
      </div>

      {/* Trend Indicator */}
      <div className="mt-6 flex w-fit items-center gap-2 rounded-full border border-success/20 bg-success/15 px-3 py-2 text-[10px] font-bold text-success sm:mt-8 sm:px-4 sm:text-[11px]">
        <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
        <span>+12.4% vs last month</span>
      </div>
    </div>
  );
}
