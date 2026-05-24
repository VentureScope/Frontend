"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Building2,
  MapPinned,
  Shield,
  UserCircle,
  UserCog,
} from "lucide-react";
import {
  OrganizationHubHeaderSkeleton,
  OrganizationHubMetaSkeleton,
} from "@/components/organization/OrganizationSkeletons";
import { Button } from "@/components/ui/button";
import type { OrganizationRole } from "@/types/organization";
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

function orgHref(orgId: string, segment: string) {
  return `/dashboard/organization/${orgId}/${segment}`;
}

const ORG_LINKS: {
  name: string;
  description: string;
  icon: typeof MapPinned;
  href: (orgId: string) => string;
}[] = [
  {
    name: "Company profile",
    description: "Legal identity, industry, services, and company details",
    icon: Building2,
    href: (id) => orgHref(id, "profile"),
  },
  {
    name: "Members",
    description: "Teammates, roles, and invitations",
    icon: UserCircle,
    href: (id) => orgHref(id, "members"),
  },
  {
    name: "Team roadmaps",
    description: "Shared learning paths for the organization",
    icon: MapPinned,
    href: (id) => orgHref(id, "roadmaps"),
  },
  {
    name: "Org Advisor",
    description: "AI guidance in your company context",
    icon: Bot,
    href: () => "/dashboard/organization/advisor",
  },
];

function RoleBadge({ role }: { role: OrganizationRole }) {
  const isOwner = role === "owner";

  return (
    <span
      className={cn(
        "vs-badge inline-flex items-center gap-1",
        isOwner ? "vs-badge-success" : "vs-badge-neutral",
      )}
    >
      {isOwner ? (
        <Shield className="h-3 w-3 shrink-0" aria-hidden />
      ) : (
        <UserCog className="h-3 w-3 shrink-0" aria-hidden />
      )}
      {role.toUpperCase()}
    </span>
  );
}

export function OrganizationHubView({ orgId }: { orgId: string }) {
  const { organization, loading, error, notFound, reload } =
    useOrganization(orgId);

  const displayName = organization?.displayName ?? "Organization";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/dashboard/organization"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All organizations
      </Link>

      {error ? (
        <div className="mb-6 flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void reload()}>
            Retry
          </Button>
        </div>
      ) : null}

      {notFound && !loading ? (
        <div className="mb-8 space-y-4">
          <h1 className="text-h1 text-foreground">Organization not found</h1>
          <p className="text-body text-muted-foreground">
            This organization does not exist or you do not have access to it.
          </p>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/organization">Back to organizations</Link>
          </Button>
        </div>
      ) : (
        <>
          {loading ? (
            <>
              <OrganizationHubHeaderSkeleton />
              <OrganizationHubMetaSkeleton />
            </>
          ) : (
            <>
              <header className="mb-4 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  {organization?.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={organization.logoUrl}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-md border border-border object-cover"
                    />
                  ) : null}
                  <h1 className="text-h1 text-foreground">{displayName}</h1>
                </div>
                {organization?.tagline ? (
                  <p className="text-body text-muted-foreground">
                    {organization.tagline}
                  </p>
                ) : (
                  <p className="text-body text-muted-foreground">
                    Manage this organization&apos;s company profile and members,
                    collaborate on team roadmaps, or consult the org advisor.
                  </p>
                )}
              </header>
              {organization ? (
                <div className="mb-8 flex flex-wrap items-center gap-3">
                  <RoleBadge role={organization.myRole} />
                  <span className="text-xs text-muted-foreground">
                    {organization.memberCount.toLocaleString()} member
                    {organization.memberCount === 1 ? "" : "s"}
                    {organization.industry
                      ? ` · ${organization.industry}`
                      : ""}
                  </span>
                </div>
              ) : null}
            </>
          )}

          {!notFound ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ORG_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href(orgId)}
                  className="vs-surface-accent flex flex-col gap-3 rounded-md p-5 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="vs-icon-tile-primary flex h-10 w-10 items-center justify-center rounded-md">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
