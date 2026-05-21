"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SettingsMfaBadgeSkeleton() {
  return <Skeleton className="h-6 w-16 rounded-full" />;
}

export function SettingsMfaToggleSkeleton() {
  return <Skeleton className="h-6 w-11 shrink-0 rounded-full" />;
}

function SettingsMfaFactorRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-12 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function SettingsMfaFactorsSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="grid gap-3">
        <SettingsMfaFactorRowSkeleton />
        <SettingsMfaFactorRowSkeleton />
      </div>
    </div>
  );
}
