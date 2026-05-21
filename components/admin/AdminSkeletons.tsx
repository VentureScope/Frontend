import { Skeleton } from "@/components/ui/skeleton";
import { adminCard, adminSection } from "@/components/admin/ui/admin-styles";
import { cn } from "@/lib/utils";

function AdminSk({ className }: { className?: string }) {
  return <Skeleton className={cn("bg-muted", className)} />;
}

export function AdminPageHeaderSkeleton({
  withSearch = false,
  actionCount = 1,
}: {
  withSearch?: boolean;
  actionCount?: number;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-2">
        <AdminSk className="h-7 w-48 max-w-full" />
        <AdminSk className="h-4 w-full max-w-md" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {withSearch ? <AdminSk className="h-10 w-56 rounded-md" /> : null}
        {Array.from({ length: actionCount }).map((_, i) => (
          <AdminSk key={i} className="h-9 w-24 rounded-md" />
        ))}
      </div>
    </div>
  );
}

export function AdminStatCardsSkeleton({
  count = 4,
  cols = 4,
}: {
  count?: number;
  cols?: 2 | 3 | 4;
}) {
  const grid =
    cols === 2
      ? "grid-cols-2"
      : cols === 3
        ? "grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4";
  return (
    <div className={cn("mb-4 grid gap-3", grid)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(adminCard, "space-y-2 p-4")}>
          <AdminSk className="h-3 w-20" />
          <AdminSk className="h-8 w-16" />
          <AdminSk className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function AdminFilterChipsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <AdminSk key={i} className="h-8 w-20 rounded-md" />
      ))}
    </div>
  );
}

export function AdminTabsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mb-4 flex gap-2 border-b border-border pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <AdminSk key={i} className="h-8 w-24 rounded-md" />
      ))}
    </div>
  );
}

export function AdminTableSkeleton({
  columns = 5,
  rows = 8,
  className,
}: {
  columns?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden border border-border", className)}>
      <div className="flex gap-3 border-b border-border bg-muted/30 px-3 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <AdminSk key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex gap-3 border-b border-border/60 px-3 py-3 last:border-b-0 odd:bg-muted/20"
        >
          {Array.from({ length: columns }).map((_, col) => (
            <AdminSk
              key={col}
              className={cn(
                "h-4 flex-1",
                col === 0 && "max-w-[40%]",
                col === columns - 1 && "max-w-[4rem]",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AdminListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="border border-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 border-b border-border/60 px-4 py-4 last:border-b-0"
        >
          <AdminSk className="h-5 w-16 shrink-0 rounded-sm" />
          <div className="min-w-0 flex-1 space-y-2">
            <AdminSk className="h-4 w-3/4" />
            <AdminSk className="h-3 w-full" />
            <AdminSk className="h-3 w-1/2" />
          </div>
          <AdminSk className="h-8 w-20 shrink-0 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function ChartBlockSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className={cn(adminSection, "mb-6 space-y-3")}>
      <AdminSk className="h-3 w-36" />
      <AdminSk
        className={tall ? "h-56 w-full rounded-lg" : "h-48 w-full rounded-lg"}
      />
    </div>
  );
}

export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mb-4 flex justify-between gap-3">
        <AdminSk className="h-4 w-full max-w-lg" />
        <AdminSk className="h-9 w-20 rounded-md" />
      </div>
      <AdminStatCardsSkeleton count={4} cols={4} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className={cn(adminCard, "space-y-3 p-4 lg:col-span-3")}>
          <AdminSk className="h-4 w-32" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3 py-2">
              <AdminSk className="h-3 w-14" />
              <AdminSk className="h-5 w-16 rounded-sm" />
              <AdminSk className="h-3 flex-1" />
            </div>
          ))}
        </div>
        <div className={cn(adminCard, "p-4 lg:col-span-2")}>
          <AdminSk className="h-4 w-28 mb-4" />
          <AdminSk className="mx-auto h-40 w-40 rounded-full" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <AdminSk className="h-3 w-20" />
                <AdminSk className="h-3 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <AdminTableSkeleton columns={5} rows={5} />
    </div>
  );
}

export function UserDirectorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AdminSk className="h-7 w-36" />
          <AdminSk className="h-6 w-20 rounded-sm" />
        </div>
        <AdminSk className="h-10 w-56 rounded-md" />
      </div>
      <AdminTabsSkeleton count={4} />
      <AdminTableSkeleton columns={6} rows={10} />
      <div className="flex justify-between pt-2">
        <AdminSk className="h-4 w-32" />
        <div className="flex gap-2">
          <AdminSk className="h-9 w-24 rounded-md" />
          <AdminSk className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function AdminPermissionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AdminSk className="h-5 w-5 rounded" />
            <AdminSk className="h-7 w-36" />
          </div>
          <AdminSk className="h-4 w-full max-w-xl" />
        </div>
        <AdminSk className="h-9 w-36 rounded-md" />
      </div>
      <div className="flex gap-3">
        <AdminSk className="h-10 w-56 rounded-md" />
        <AdminSk className="h-4 w-28" />
      </div>
      <AdminTableSkeleton columns={4} rows={6} />
    </div>
  );
}

export function AdminAlertsSkeleton() {
  return (
    <div className="space-y-4">
      <AdminPageHeaderSkeleton actionCount={2} />
      <AdminFilterChipsSkeleton count={3} />
      <div className="flex gap-4">
        <AdminSk className="h-4 w-24" />
        <AdminSk className="h-4 w-4 rounded" />
      </div>
      <AdminListSkeleton rows={8} />
    </div>
  );
}

export function TechnicalHealthSkeleton() {
  return (
    <div className="space-y-4">
      <AdminPageHeaderSkeleton actionCount={1} />
      <ChartBlockSkeleton />
      <ChartBlockSkeleton />
      <div className={cn(adminSection, "mb-6 space-y-4")}>
        <AdminSk className="h-3 w-40" />
        <AdminSk className="h-4 w-32" />
        <AdminSk className="h-10 w-full max-w-md rounded-lg" />
        <AdminTableSkeleton columns={4} rows={5} />
      </div>
      <div className={cn(adminSection, "space-y-4")}>
        <AdminSk className="h-3 w-20" />
        <AdminStatCardsSkeleton count={4} cols={4} />
        <AdminSk className="h-40 w-full rounded-lg" />
        <AdminTableSkeleton columns={5} rows={4} />
      </div>
    </div>
  );
}

export function AdminTranscriptsSkeleton() {
  return (
    <div className="space-y-4">
      <AdminPageHeaderSkeleton actionCount={2} />
      <AdminStatCardsSkeleton count={3} cols={3} />
      <ChartBlockSkeleton />
      <AdminTableSkeleton columns={5} rows={6} />
    </div>
  );
}

export function EmbeddingsMonitorSkeleton() {
  return (
    <div className="space-y-4">
      <AdminPageHeaderSkeleton actionCount={2} />
      <AdminStatCardsSkeleton count={3} cols={3} />
      <AdminFilterChipsSkeleton count={5} />
      <AdminTableSkeleton columns={7} rows={10} />
      <div className="flex justify-between pt-2">
        <AdminSk className="h-4 w-40" />
        <div className="flex gap-2">
          <AdminSk className="h-9 w-24 rounded-md" />
          <AdminSk className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function AdminGitHubSyncsSkeleton() {
  return (
    <div className="space-y-4">
      <AdminPageHeaderSkeleton actionCount={1} />
      <AdminStatCardsSkeleton count={3} cols={3} />
      <AdminTableSkeleton columns={5} rows={8} />
    </div>
  );
}

export function AdminTaxonomySkeleton() {
  return (
    <div className="space-y-4">
      <AdminPageHeaderSkeleton actionCount={1} />
      <AdminStatCardsSkeleton count={2} cols={2} />
      <AdminFilterChipsSkeleton count={4} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-border bg-card">
          <AdminSk className="h-10 w-full border-b border-border" />
          <AdminTableSkeleton columns={4} rows={6} className="border-0" />
        </div>
        <div className="border border-border bg-card">
          <AdminSk className="h-10 w-full border-b border-border" />
          <AdminTableSkeleton columns={2} rows={8} className="border-0" />
        </div>
      </div>
    </div>
  );
}
