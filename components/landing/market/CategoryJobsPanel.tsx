"use client";

import { Building2, MapPin } from "lucide-react";
import type { JobByCategoryRow } from "@/types/jobs";
import { MARKET_TOP_K, parseCategoryJob } from "@/lib/job-market-insights";
import { CategoryJobsSkeleton } from "@/components/landing/market/MarketPulseSkeletons";

export function CategoryJobsPanel({
  jobs,
  categoryName,
  loading,
  limit = MARKET_TOP_K.categoryJobs,
}: {
  jobs: JobByCategoryRow[];
  categoryName: string | null;
  loading: boolean;
  limit?: number;
}) {
  const parsed = jobs
    .slice(0, limit)
    .map((row, i) => parseCategoryJob(row, i));

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
        Open roles in {categoryName ?? "this category"}
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
        Top {limit} openings for{" "}
        <span className="font-semibold text-slate-700">
          {categoryName ?? "the leading trending career"}
        </span>
        .
      </p>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {loading ? (
          <div className="col-span-full">
            <CategoryJobsSkeleton count={limit} />
          </div>
        ) : parsed.length === 0 ? (
          <p className="text-sm text-slate-500 col-span-full">
            No listings returned for this category right now. Check back after
            the next data refresh.
          </p>
        ) : (
          parsed.map((job) => (
            <article
              key={job.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
            >
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {job.title}
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                {job.company}
              </p>
              {(job.location || job.jobType) && (
                <p className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                  {job.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-medium text-slate-600 border border-slate-100">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                  )}
                  {job.jobType && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 font-bold text-blue-700 uppercase tracking-wide">
                      {job.jobType}
                    </span>
                  )}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
