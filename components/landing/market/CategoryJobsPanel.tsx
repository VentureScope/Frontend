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
    <div className="rounded-2xl sm:rounded-3xl bg-card p-6 sm:p-8 lg:p-10 border border-border shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-foreground">
        Open roles in {categoryName ?? "this category"}
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-6 leading-relaxed">
        Top {limit} openings for{" "}
        <span className="font-semibold text-muted-foreground">
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
          <p className="text-sm text-muted-foreground col-span-full">
            No listings returned for this category right now. Check back after
            the next data refresh.
          </p>
        ) : (
          parsed.map((job) => (
            <article
              key={job.id}
              className="p-4 sm:p-5 rounded-2xl bg-muted/80 border border-border hover:border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <h3 className="font-bold text-foreground text-sm leading-snug">
                {job.title}
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                {job.company}
              </p>
              {(job.location || job.jobType) && (
                <p className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                  {job.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 font-medium text-muted-foreground border border-border">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                  )}
                  {job.jobType && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary uppercase tracking-wide">
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
