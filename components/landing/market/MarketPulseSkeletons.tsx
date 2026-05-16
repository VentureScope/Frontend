import { Skeleton } from "@/components/ui/skeleton";

function sk(className?: string) {
  return <Skeleton className={className ?? "bg-slate-100"} />;
}

export function SkillDemandSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between gap-2">
            {sk("h-4 w-32")}
            {sk("h-4 w-12")}
          </div>
          {sk("h-2 w-full rounded-full")}
        </div>
      ))}
    </div>
  );
}

export function TrendingRolesSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
        >
          {sk("h-10 w-10 shrink-0 rounded-xl")}
          <div className="flex-1 space-y-2">
            {sk("h-4 w-36")}
            {sk("h-3 w-28")}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MarketStatsSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full min-h-[240px] space-y-6">
      <div className="space-y-3">
        {sk("h-5 w-40 bg-blue-400/30")}
        {sk("h-3 w-full max-w-xs bg-blue-400/20")}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            {sk("h-2 w-12 bg-blue-400/20")}
            {sk("h-7 w-14 bg-blue-400/30")}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryJobsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-3"
        >
          {sk("h-4 w-full")}
          {sk("h-3 w-2/3")}
          {sk("h-5 w-24 rounded-full")}
        </div>
      ))}
    </div>
  );
}

export function ProfileMatchesSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-100 bg-white p-4 flex justify-between gap-3"
        >
          <div className="flex-1 space-y-2">
            {sk("h-4 w-40")}
            {sk("h-3 w-28")}
          </div>
          {sk("h-2 w-16 rounded-full")}
        </div>
      ))}
    </div>
  );
}

export function MarketPulseGridSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="lg:col-span-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {sk("h-5 w-40 mb-6")}
        <SkillDemandSkeleton />
      </div>
      <div className="lg:col-span-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {sk("h-5 w-36 mb-6")}
        <TrendingRolesSkeleton rows={3} />
      </div>
      <div className="lg:col-span-3 rounded-2xl bg-[#1d59db] p-6 shadow-sm min-h-[240px]">
        <MarketStatsSkeleton />
      </div>
    </div>
  );
}
