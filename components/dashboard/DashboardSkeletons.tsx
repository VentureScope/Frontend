import { Skeleton } from "@/components/ui/skeleton";

function sk(className?: string) {
  return <Skeleton className={className ?? "bg-muted"} />;
}

export function WelcomeHeaderSkeleton() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:flex-col lg:items-start">
      <div className="space-y-3 sm:space-y-4">
        {sk("h-9 w-64 max-w-full sm:h-10")}
        {sk("h-4 w-full max-w-md")}
        {sk("h-4 w-4/5 max-w-sm")}
      </div>
      {sk("h-24 w-24 shrink-0 rounded-md sm:h-28 sm:w-28")}
    </div>
  );
}

export function InsightCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`vs-surface-accent flex h-full min-h-[220px] flex-col p-6 sm:p-8 lg:min-h-0 ${className ?? ""}`}
    >
      {sk("h-6 w-28 rounded-md")}
      <div className="flex flex-1 flex-col justify-center space-y-3 py-4">
        {sk("h-5 w-full")}
        {sk("h-5 w-11/12")}
        {sk("h-4 w-2/3")}
      </div>
      {sk("h-5 w-36")}
    </div>
  );
}

export function ModuleCardSkeleton() {
  return (
    <div className="vs-surface p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        {sk("h-11 w-11 rounded-lg")}
        {sk("h-4 w-24")}
      </div>
      <div className="mb-6 space-y-2 sm:mb-8">
        {sk("h-6 w-3/4")}
        {sk("h-4 w-1/2")}
      </div>
      {sk("h-2 w-full rounded-full")}
    </div>
  );
}

export function ModuleResumeCardSkeleton() {
  return (
    <div className="vs-surface flex flex-col p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        {sk("h-11 w-11 rounded-lg")}
        <div className="space-y-1 text-right">
          {sk("ml-auto h-3 w-20")}
          {sk("ml-auto h-7 w-14")}
        </div>
      </div>
      {sk("mb-6 h-6 w-40 sm:mb-8")}
      <div className="mt-auto space-y-2">
        {sk("h-11 w-full rounded-md")}
        {sk("h-11 w-full rounded-md")}
      </div>
    </div>
  );
}

export function ModuleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      <ModuleCardSkeleton />
      <div className="vs-surface p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          {sk("h-11 w-11 rounded-lg")}
          {sk("h-6 w-16 rounded-full")}
        </div>
        {sk("mb-4 h-6 w-48 sm:mb-6")}
        {sk("h-12 w-full rounded-md")}
        {sk("mt-3 h-4 w-32")}
      </div>
      <ModuleResumeCardSkeleton />
    </div>
  );
}

export function DataSyncCardSkeleton() {
  return (
    <div className="vs-surface h-full p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center gap-3 sm:mb-10 sm:gap-4">
        {sk("h-10 w-10 shrink-0 rounded-lg sm:h-12 sm:w-12")}
        <div className="flex-1 space-y-2">
          {sk("h-6 w-40")}
          {sk("h-3 w-28")}
        </div>
      </div>
      <div className="space-y-6 sm:space-y-8">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {sk("h-10 w-10 rounded-lg")}
              {sk("h-4 w-32")}
            </div>
            {sk("h-6 w-24 rounded-full")}
          </div>
        ))}
      </div>
      {sk("mt-8 h-4 w-28")}
    </div>
  );
}

export function MarketTrendsCardSkeleton() {
  return (
    <div className="vs-surface p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          {sk("h-7 w-40")}
          {sk("h-4 w-56")}
        </div>
        <div className="flex gap-2">
          {sk("h-7 w-16 rounded-md")}
          {sk("h-7 w-20 rounded-md")}
        </div>
      </div>
      <div className="flex h-32 items-end justify-between gap-2 sm:h-48 sm:gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[45%] w-full rounded-md bg-muted sm:h-[60%]"
          />
        ))}
      </div>
      {sk("mt-4 h-4 w-44")}
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="vs-surface p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        {sk("h-7 w-40")}
        {sk("h-4 w-24")}
      </div>
      <div className="space-y-8 sm:space-y-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4 sm:gap-5">
            {sk("mt-2 h-2 w-2 shrink-0 rounded-full")}
            <div className="min-w-0 flex-1 space-y-2">
              {sk("h-4 w-full max-w-md")}
              <div className="flex gap-2">
                {sk("h-3 w-16")}
                {sk("h-5 w-24 rounded-full")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SuggestedActionsSkeleton() {
  return (
    <div className="vs-surface-accent flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
      <div className="space-y-6 sm:space-y-10">
        {sk("h-7 w-44")}
        <div className="space-y-3 sm:space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-md border border-border bg-card p-5 sm:p-6 lg:p-8"
            >
              <div className="flex gap-3 sm:gap-4">
                {sk("h-10 w-10 shrink-0 rounded-full")}
                <div className="flex-1 space-y-2">
                  {sk("h-4 w-3/4")}
                  {sk("h-3 w-full")}
                  {sk("h-3 w-5/6")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {sk("mt-8 h-5 w-40 sm:mt-10")}
    </div>
  );
}
