"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { WizardStepIntro } from "@/components/organization/create/WizardStepIntro";
import type { OrganizationCreateForm } from "@/types/organization-create";

type Props = {
  form: OrganizationCreateForm;
  onChange: (patch: Partial<OrganizationCreateForm>) => void;
};

export function StepIdentityNames({ form, onChange }: Props) {
  return (
    <div className="space-y-6">
      <WizardStepIntro
        title="Organization names"
        description="Establish how your organization is registered and how it appears in the network."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Legal name
          </FieldLabel>
          <Input
            value={form.legalName}
            onChange={(e) => onChange({ legalName: e.target.value })}
            placeholder="e.g. Acme Corporation Inc."
            className="h-11 border-border bg-muted"
          />
          <FieldDescription>
            The official registered name of your entity.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Display name
          </FieldLabel>
          <Input
            value={form.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            placeholder="e.g. Acme Corp"
            className="h-11 border-border bg-muted"
          />
          <FieldDescription>How you will be known in the network.</FieldDescription>
        </Field>
      </div>
    </div>
  );
}
