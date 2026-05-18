"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationCard } from "@/components/organization/OrganizationCard";
import { ExpandNetworkCard } from "@/components/organization/ExpandNetworkCard";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";

export default function OrganizationsPage() {
  const router = useRouter();

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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_ORGANIZATIONS.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
        <ExpandNetworkCard />
      </div>
    </div>
  );
}
