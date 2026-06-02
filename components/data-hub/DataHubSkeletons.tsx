import { Skeleton } from "@/components/ui/skeleton";

function sk(className?: string) {
  return <Skeleton className={className ?? "bg-muted"} />;
}

export function DataHubSummarySkeleton() {
  return (
    <div className="mb-8 space-y-4">
      {sk("h-24 w-full rounded-xl")}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>{sk("h-20 rounded-xl")}</div>
        ))}
      </div>
    </div>
  );
}

export function DataHubProfileCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            {sk("h-12 w-12 shrink-0 rounded-lg")}
            <div className="space-y-2">
              {sk("h-5 w-36")}
              {sk("h-4 w-48")}
            </div>
          </div>
          {sk("h-6 w-20 rounded-full")}
        </div>
        {sk("h-16 w-full rounded-lg")}
      </div>
      <div className="mt-8 border-t border-border pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {sk("h-3 w-32")}
          {sk("h-10 w-full rounded-lg sm:w-28")}
        </div>
      </div>
    </div>
  );
}

export function DataHubSkillsCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            {sk("h-12 w-12 shrink-0 rounded-lg")}
            <div className="space-y-2">
              {sk("h-5 w-40")}
              {sk("h-4 w-52")}
            </div>
          </div>
          {sk("h-6 w-16 rounded-full")}
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>{sk("h-7 w-20 rounded-md")}</div>
          ))}
        </div>
        {sk("h-4 w-44")}
      </div>
      <div className="mt-6 border-t border-border pt-4">{sk("h-4 w-24")}</div>
    </div>
  );
}

export function ExtensionCardVersionSkeleton() {
  return <Skeleton className="mt-2 h-4 w-48 bg-muted" />;
}

export function OnboardingStepsSkeleton() {
  return (
    <section className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="vs-surface flex flex-col gap-6 p-10">
          {sk("h-12 w-16")}
          <div className="space-y-3">
            {sk("h-6 w-40")}
            {sk("h-4 w-full")}
            {sk("h-4 w-3/4")}
          </div>
        </div>
      ))}
    </section>
  );
}
