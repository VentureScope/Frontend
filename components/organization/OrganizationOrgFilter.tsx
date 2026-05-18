"use client";

import { Building2 } from "lucide-react";
import type { OrganizationListItem } from "@/types/organization";
import { cn } from "@/lib/utils";

export const ALL_ORGS_FILTER = "all";

type Props = {
  organizations: OrganizationListItem[];
  value: string;
  onChange: (orgId: string) => void;
  className?: string;
};

export function OrganizationOrgFilter({
  organizations,
  value,
  onChange,
  className,
}: Props) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <p className="text-label text-muted-foreground">Filter by organization</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(ALL_ORGS_FILTER)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            value === ALL_ORGS_FILTER
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          All organizations
        </button>
        {organizations.map((org) => (
          <button
            key={org.id}
            type="button"
            onClick={() => onChange(org.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              value === org.id
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {org.name}
          </button>
        ))}
      </div>
    </div>
  );
}
