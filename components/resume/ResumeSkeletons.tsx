import { Skeleton } from "@/components/ui/skeleton";

function sk(className?: string) {
  return <Skeleton className={className ?? "bg-muted"} />;
}

export function ResumeListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
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
                  {sk("h-10 flex-1 rounded-lg")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sk("h-48 rounded-lg lg:col-span-1")}
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
