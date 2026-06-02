import { Skeleton } from "@/components/ui/skeleton";

function sk(className?: string) {
  return <Skeleton className={className ?? "bg-muted"} />;
}

export function ResumeCardsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            {sk("aspect-[3/4] w-full sm:w-32 rounded-lg")}
            <div className="flex-1 space-y-3">
              {sk("h-6 w-48")}
              {sk("h-4 w-32")}
              {sk("h-3 w-24")}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {sk("h-12 w-full")}
                {sk("h-12 w-full")}
              </div>
              <div className="mt-4 flex gap-3">
                {sk("h-10 flex-1 rounded-lg")}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResumePortfolioSummarySkeleton() {
  return (
    <div className="h-fit rounded-lg border border-border bg-card p-6">
      {sk("h-5 w-40")}
      {sk("mt-3 h-4 w-full")}
      <div className="mt-4 space-y-3">
        {sk("h-4 w-full")}
        {sk("h-4 w-full")}
        {sk("h-4 w-3/4")}
      </div>
    </div>
  );
}

/** @deprecated Use ResumeCardsSkeleton + ResumePortfolioSummarySkeleton */
export function ResumeListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ResumeCardsSkeleton count={count} />
      </div>
      <ResumePortfolioSummarySkeleton />
    </div>
  );
}

export function ResumeDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        {sk("h-10 w-10 rounded-full")}
        <div className="space-y-2">
          {sk("h-6 w-56")}
          {sk("h-4 w-36")}
        </div>
      </div>
      {sk("h-[600px] w-full rounded-xl")}
    </div>
  );
}

/** Editor sticky header + document area while detail loads. */
export function ResumeEditorShellSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-background px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1680px] items-center gap-3">
          {sk("h-10 w-10 shrink-0 rounded-full")}
          <div className="min-w-0 flex-1 space-y-2">
            {sk("h-5 w-48 max-w-full")}
            {sk("h-3 w-64 max-w-full")}
          </div>
          <div className="hidden gap-2 sm:flex">
            {sk("h-9 w-20 rounded-md")}
            {sk("h-9 w-16 rounded-md")}
            {sk("h-9 w-28 rounded-md")}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)]">
          <div className="space-y-2">
            {sk("h-3 w-20")}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>{sk("h-10 w-full rounded-lg")}</div>
            ))}
          </div>
          {sk("h-[640px] w-full rounded-xl")}
        </div>
      </div>
    </div>
  );
}
