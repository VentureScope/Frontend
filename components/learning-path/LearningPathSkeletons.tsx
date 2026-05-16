import { Skeleton } from "@/components/ui/skeleton";

function sk(className?: string) {
  return <Skeleton className={className ?? "bg-muted"} />;
}

/** List page: roadmap cards while `GET /api/roadmaps` loads */
export function LearningPathListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-8 space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <PathCardSkeleton key={i} />
      ))}
    </div>
  );
}

function PathCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-5">
          {sk("h-12 w-12 shrink-0 rounded-xl")}
          <div className="min-w-0 flex-1 space-y-2">
            {sk("h-6 w-3/4 max-w-xs")}
            {sk("h-4 w-1/2 max-w-[200px]")}
          </div>
        </div>
        <div className="hidden w-64 shrink-0 space-y-2 md:block">
          <div className="flex justify-between">
            {sk("h-3 w-16")}
            {sk("h-3 w-20")}
          </div>
          {sk("h-2 w-full rounded-full")}
        </div>
        {sk("h-6 w-6 shrink-0 rounded-full")}
      </div>
    </div>
  );
}

/** Expanded PathCard: weeks & resources while `GET /api/roadmaps/{id}` loads */
export function PathCardModulesSkeleton() {
  return (
    <div className="relative space-y-12 py-2">
      {[0, 1].map((moduleIndex) => (
        <div key={moduleIndex} className="relative pl-12">
          {sk("absolute left-0 top-0 h-8 w-8 rounded-full")}
          {sk("mb-6 h-6 w-64 max-w-full")}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[0, 1].map((r) => (
              <div
                key={r}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                {sk("h-16 w-16 shrink-0 rounded-xl")}
                <div className="flex-1 space-y-2">
                  {sk("h-3 w-20")}
                  {sk("h-4 w-full")}
                  {sk("h-3 w-3/4")}
                </div>
                {sk("h-6 w-6 shrink-0 rounded-full")}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Standalone roadmap detail page */
export function RoadmapDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {sk("h-10 w-10 rounded-full")}
            <div className="space-y-2">
              {sk("h-4 w-48")}
              {sk("h-3 w-24")}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {sk("hidden h-10 w-28 rounded-full sm:block")}
            {sk("h-10 w-36 rounded-full")}
            {sk("h-10 w-10 rounded-full")}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            {sk("h-14 w-14 rounded-2xl")}
            <div className="space-y-2">
              {sk("h-10 w-80 max-w-full")}
              {sk("h-6 w-56 max-w-full")}
            </div>
          </div>
          <div className="w-full space-y-3 md:w-80">
            <div className="flex justify-between">
              {sk("h-3 w-28")}
              {sk("h-3 w-24")}
            </div>
            {sk("h-3 w-full rounded-full")}
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-card p-8 shadow-sm sm:p-12">
          <RoadmapStepsSkeleton stepCount={3} />
        </div>
      </div>
    </div>
  );
}

function RoadmapStepsSkeleton({ stepCount = 3 }: { stepCount?: number }) {
  return (
    <div className="relative space-y-20">
      {Array.from({ length: stepCount }).map((_, i) => (
        <div key={i} className="relative pl-16">
          {sk("absolute left-0 top-0 h-10 w-10 rounded-full")}
          <div className="space-y-8">
            <div className="space-y-2">
              {sk("h-8 w-72 max-w-full")}
              {sk("h-4 w-full max-w-lg")}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {[0, 1].map((r) => (
                <div
                  key={r}
                  className="flex items-center justify-between rounded-[24px] border border-border p-5"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-5">
                    {sk("h-20 w-20 shrink-0 rounded-2xl")}
                    <div className="min-w-0 flex-1 space-y-2">
                      {sk("h-3 w-24")}
                      {sk("h-5 w-full")}
                      {sk("h-4 w-3/4")}
                    </div>
                  </div>
                  {sk("h-7 w-7 shrink-0 rounded-full")}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** New roadmap: role rows while trending careers load */
export function NewRoadmapRolesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-[24px] border border-border bg-card p-6"
        >
          <div className="flex min-w-0 flex-1 items-center gap-6">
            {sk("h-6 w-6 shrink-0 rounded-full")}
            {sk("h-14 w-14 shrink-0 rounded-2xl")}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-3">
                {sk("h-6 w-48 max-w-full")}
                {sk("h-5 w-24 rounded-md")}
              </div>
              {sk("h-4 w-full max-w-md")}
            </div>
          </div>
          <div className="shrink-0 space-y-2 pl-4 text-right">
            {sk("ml-auto h-8 w-16")}
            {sk("h-3 w-24")}
          </div>
        </div>
      ))}
    </div>
  );
}
