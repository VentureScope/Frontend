"use client";

import { Building2, Check } from "lucide-react";
import type { OrganizationListItem } from "@/types/organization";
import { cn } from "@/lib/utils";

type OrgAdvisorOrgPickerProps = {
  organizations: OrganizationListItem[];
  value: string;
  onChange: (orgId: string) => void;
};

export function OrgAdvisorOrgPicker({
  organizations,
  value,
  onChange,
}: OrgAdvisorOrgPickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Organization
      </p>
      <ul className="space-y-1.5" role="listbox" aria-label="Select organization">
        {organizations.map((org) => {
          const selected = value === org.id;
          return (
            <li key={org.id} role="option" aria-selected={selected}>
              <button
                type="button"
                onClick={() => onChange(org.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border-primary/35 bg-primary/10"
                    : "border-border bg-card hover:border-primary/20 hover:bg-muted/50",
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                    selected
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      selected ? "text-primary" : "text-foreground",
                    )}
                  >
                    {org.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {org.memberCount.toLocaleString()} members · {org.activeProjects}{" "}
                    projects
                  </p>
                </div>
                {selected ? (
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
