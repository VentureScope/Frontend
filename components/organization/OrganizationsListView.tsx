"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationCard } from "@/components/organization/OrganizationCard";
import { ExpandNetworkCard } from "@/components/organization/ExpandNetworkCard";
import { OrganizationCardGridSkeleton } from "@/components/organization/OrganizationSkeletons";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";

export function OrganizationsListView() {
  const router = useRouter();
  const { organizations, loading, error, reload } = useOrganizationsList();

  function openCreate() {
    router.push("/dashboard/organization/new");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-h1 text-foreground">Your Organizations</h1>
          <p className="text-body text-muted-foreground">
            Manage your teams, view analytics, and oversee active projects
            across your corporate ecosystem.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="h-11 shrink-0 gap-2 px-5 font-semibold sm:self-start"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" />
          Create organization
        </Button>
      </header>

      {error ? (
        <div className="mb-6 flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void reload()}
          >
            Retry
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <OrganizationCardGridSkeleton count={2} />
        ) : (
          organizations.map((org) => <OrganizationCard key={org.id} org={org} />)
        )}
        <ExpandNetworkCard />
      </div>

      {!loading && !error && organizations.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          You are not a member of any organizations yet. Create one or accept an
          invitation to get started.
        </p>
      ) : null}
    </div>
  );
}
