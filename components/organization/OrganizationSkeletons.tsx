import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function OrgSk({ className }: { className?: string }) {
  return <Skeleton className={cn("bg-muted", className)} />;
}

export function OrganizationCardSkeleton() {
  return (
    <article className="vs-surface flex flex-col rounded-md p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <OrgSk className="h-12 w-12 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1 space-y-2">
            <OrgSk className="h-5 w-36 max-w-full" />
            <OrgSk className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <OrgSk className="h-7 w-7 rounded-md" />
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <OrgSk className="h-[72px] rounded-md" />
        <OrgSk className="h-[72px] rounded-md" />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex -space-x-2">
          <OrgSk className="h-8 w-8 rounded-full" />
          <OrgSk className="h-8 w-8 rounded-full" />
        </div>
        <OrgSk className="h-4 w-28" />
      </div>
    </article>
  );
}

export function OrganizationCardGridSkeleton({ count = 2 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <OrganizationCardSkeleton key={i} />
      ))}
    </>
  );
}

export function OrganizationHubHeaderSkeleton() {
  return (
    <header className="mb-8 space-y-3">
      <OrgSk className="h-9 w-64 max-w-full" />
      <OrgSk className="h-4 w-full max-w-xl" />
      <OrgSk className="h-4 w-48 max-w-full" />
    </header>
  );
}

export function OrganizationHubMetaSkeleton() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <OrgSk className="h-6 w-20 rounded-full" />
      <OrgSk className="h-4 w-32" />
    </div>
  );
}

export function OrganizationProfileSectionSkeleton({
  lines = 3,
}: {
  lines?: number;
}) {
  return (
    <section className="vs-surface space-y-4 rounded-md p-6">
      <OrgSk className="h-5 w-40" />
      {Array.from({ length: lines }).map((_, i) => (
        <OrgSk key={i} className="h-4 w-full max-w-md" />
      ))}
    </section>
  );
}

export function OrganizationProfilePageSkeleton() {
  return (
    <div className="space-y-8">
      <OrganizationProfileSectionSkeleton lines={4} />
      <OrganizationProfileSectionSkeleton lines={3} />
      <OrganizationProfileSectionSkeleton lines={2} />
      <OrganizationProfileSectionSkeleton lines={2} />
    </div>
  );
}

export function OrganizationMembersListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <div className="vs-surface flex gap-4 rounded-md p-5">
            <OrgSk className="h-11 w-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <OrgSk className="h-4 w-40" />
              <OrgSk className="h-3 w-56" />
              <OrgSk className="h-3 w-32" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function OrganizationInvitesListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrgSk key={i} className="h-16 w-full rounded-md" />
      ))}
    </div>
  );
}

export function OrganizationRoadmapsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <OrgSk key={i} className="h-40 w-full rounded-[24px]" />
      ))}
    </div>
  );
}
