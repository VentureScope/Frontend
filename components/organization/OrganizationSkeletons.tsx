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

export function OrganizationHubNavGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="vs-surface-accent flex flex-col gap-3 rounded-md p-5"
        >
          <div className="flex items-center gap-3">
            <OrgSk className="h-10 w-10 shrink-0 rounded-md" />
            <OrgSk className="h-4 w-28" />
          </div>
          <OrgSk className="h-3 w-full" />
          <OrgSk className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function OrganizationMemberDetailSkeleton() {
  return (
    <>
      <OrgSk className="mb-6 h-4 w-36" />
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <OrgSk className="h-14 w-14 shrink-0 rounded-full" />
          <div className="space-y-2">
            <OrgSk className="h-8 w-48 max-w-full" />
            <OrgSk className="h-4 w-32" />
            <OrgSk className="h-4 w-56" />
          </div>
        </div>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <OrgSk key={i} className="h-[72px] rounded-md" />
        ))}
      </div>
      <OrganizationProfileSectionSkeleton lines={4} />
    </>
  );
}

export function OrganizationsListPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <OrgSk className="h-9 w-64 max-w-full" />
          <OrgSk className="h-4 w-full max-w-xl" />
        </div>
        <OrgSk className="h-11 w-44 shrink-0 rounded-md" />
      </header>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <OrganizationCardGridSkeleton count={2} />
      </div>
    </div>
  );
}

export function OrganizationHubPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <OrgSk className="mb-6 h-4 w-32" />
      <OrganizationHubHeaderSkeleton />
      <OrganizationHubMetaSkeleton />
      <OrganizationHubNavGridSkeleton />
    </div>
  );
}

export function OrganizationCompanyProfileRouteSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <OrgSk className="mb-6 h-4 w-40" />
      <div className="mb-8 space-y-2">
        <OrgSk className="h-3 w-24" />
        <OrgSk className="h-8 w-48 max-w-full" />
        <OrgSk className="h-4 w-full max-w-xl" />
      </div>
      <OrganizationProfilePageSkeleton />
    </div>
  );
}

export function OrganizationMembersPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <OrgSk className="mb-6 h-4 w-36" />
      <div className="mb-8 space-y-2">
        <OrgSk className="h-3 w-24" />
        <OrgSk className="h-8 w-32 max-w-full" />
        <OrgSk className="h-4 w-full max-w-xl" />
      </div>
      <OrganizationMembersListSkeleton count={4} />
    </div>
  );
}

export function OrganizationTeamRoadmapsPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <OrgSk className="mb-6 h-4 w-36" />
      <div className="mb-8 space-y-2">
        <OrgSk className="h-3 w-24" />
        <OrgSk className="h-8 w-40 max-w-full" />
        <OrgSk className="h-4 w-full max-w-xl" />
      </div>
      <OrganizationRoadmapsGridSkeleton count={3} />
    </div>
  );
}

export function OrganizationInviteAcceptPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <OrgSk className="mb-6 h-4 w-28" />
      <div className="mb-8 space-y-2">
        <OrgSk className="h-3 w-24" />
        <OrgSk className="h-8 w-44 max-w-full" />
        <OrgSk className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <OrganizationInviteAcceptDetailsSkeleton />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <OrgSk className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function OrganizationMyMemberProfilePageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 space-y-2">
        <OrgSk className="h-3 w-24" />
        <OrgSk className="h-8 w-56 max-w-full" />
        <OrgSk className="h-4 w-full max-w-2xl" />
      </div>
      <OrgSk className="h-24 w-full rounded-md" />
      <OrgSk className="mt-8 h-10 w-full max-w-md rounded-md" />
      <div className="mt-10">
        <OrganizationProfilePageSkeleton />
      </div>
    </div>
  );
}

/** Mirrors the accept-invite details card while JWT / preview loads. */
export function OrganizationInviteAcceptDetailsSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/30 px-6 py-6 sm:px-8">
        <OrgSk className="h-3 w-36" />
        <div className="mt-4 flex items-start gap-4">
          <OrgSk className="h-16 w-16 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <OrgSk className="h-7 w-48 max-w-full" />
            <OrgSk className="h-4 w-32 max-w-full" />
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-8">
        <div className="space-y-2">
          <OrgSk className="h-3 w-40" />
          <OrgSk className="h-4 w-full" />
          <OrgSk className="h-4 w-full max-w-lg" />
          <OrgSk className="h-4 w-3/4 max-w-md" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <OrgSk className="h-[72px] rounded-lg" />
          <OrgSk className="h-[72px] rounded-lg" />
          <OrgSk className="h-[72px] rounded-lg sm:col-span-2" />
          <OrgSk className="h-[72px] rounded-lg sm:col-span-2" />
        </div>

        <OrgSk className="h-[52px] w-full rounded-lg" />
      </div>
    </div>
  );
}
