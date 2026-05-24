import type { HiringCompanyRow } from "@/lib/job-market-insights";

const TILE_CLASSES = [
  "vs-icon-tile vs-icon-tile-primary",
  "vs-icon-tile vs-icon-tile-accent",
  "vs-icon-tile vs-icon-tile-secondary",
] as const;

export default function TopHiringCompanies({
  companies,
  loading,
}: {
  companies: HiringCompanyRow[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:rounded-xl sm:p-8">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            Top Hiring Companies
          </h3>
          <p className="mt-1 text-[11px] text-muted-foreground">
            From indexed listings in leading role categories
          </p>
        </div>
        <span className="shrink-0 text-right text-[9px] font-bold uppercase leading-none tracking-widest text-muted-foreground sm:text-[10px]">
          Ethiopia
          <br />
          Market
        </span>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-32 rounded bg-muted" />
                  <div className="h-2 w-20 rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-8 rounded bg-muted" />
            </div>
          ))
        ) : companies.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No employer ranking available yet. Check back after the next data
            refresh.
          </p>
        ) : (
          companies.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex min-w-0 items-center gap-3 overflow-hidden sm:gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold ${TILE_CLASSES[i % TILE_CLASSES.length]}`}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 pr-2">
                  <p className="mb-0.5 truncate text-sm font-bold leading-tight text-foreground sm:mb-1 sm:text-base sm:leading-none">
                    {c.name}
                  </p>
                  <p className="truncate text-[10px] font-medium text-muted-foreground">
                    {c.category ?? "Multiple categories"}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold text-foreground sm:text-sm">
                {c.count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
