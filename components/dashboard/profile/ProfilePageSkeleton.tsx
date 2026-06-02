import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-8 lg:space-y-8">
          <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
            <Skeleton className="h-28 w-28 rounded-[24px] lg:h-32 lg:w-32" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-56" />
              <Skeleton className="h-5 w-72 max-w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>

          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
