"use client";

import { ChevronDown } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { INDUSTRY_VERTICALS } from "@/lib/organization-create-constants";
import { WizardStepIntro } from "@/components/organization/create/WizardStepIntro";
import type { OrganizationCreateForm } from "@/types/organization-create";

type Props = {
  form: OrganizationCreateForm;
  onChange: (patch: Partial<OrganizationCreateForm>) => void;
};

export function StepIndustryVertical({ form, onChange }: Props) {
  return (
    <div className="space-y-6">
      <WizardStepIntro
        title="Industry vertical"
        description="Select the primary industry your organization operates in to tailor intelligence and benchmarks."
      />
      <Field>
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Industry vertical
        </FieldLabel>
        <div className="relative">
          <select
            value={form.industryVertical}
            onChange={(e) => onChange({ industryVertical: e.target.value })}
            className="h-11 w-full appearance-none rounded-md border border-border bg-muted px-4 pr-10 text-sm text-foreground outline-none focus:border-primary/35 focus:ring-1 focus:ring-primary/20"
          >
            <option value="">Select an industry...</option>
            {INDUSTRY_VERTICALS.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </Field>
    </div>
  );
}
