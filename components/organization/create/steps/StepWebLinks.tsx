"use client";

import { Globe, Hash, Link2, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { WizardStepIntro } from "@/components/organization/create/WizardStepIntro";
import type { OrganizationCreateForm } from "@/types/organization-create";

type Props = {
  form: OrganizationCreateForm;
  onChange: (patch: Partial<OrganizationCreateForm>) => void;
};

function IconInput({
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Input> & { icon: typeof Globe }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input {...props} className="h-11 border-border bg-muted pl-10 pr-4" />
    </div>
  );
}

export function StepWebLinks({ form, onChange }: Props) {
  return (
    <div className="space-y-6">
      <WizardStepIntro
        title="Web & social links"
        description="Connect your organization's public profiles to enhance visibility and sync data automatically."
      />

      <section className="vs-surface space-y-5 rounded-md p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Web & social links</h3>
        </div>

        <Field>
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Company website
          </FieldLabel>
          <IconInput
            icon={Link2}
            value={form.website}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://www.example.com"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              LinkedIn page
            </FieldLabel>
            <IconInput
              icon={Linkedin}
              value={form.linkedIn}
              onChange={(e) => onChange({ linkedIn: e.target.value })}
              placeholder="linkedin.com/company/..."
            />
          </Field>
          <Field>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              X (Twitter) profile
            </FieldLabel>
            <IconInput
              icon={Hash}
              value={form.twitter}
              onChange={(e) => onChange({ twitter: e.target.value })}
              placeholder="@companyhandle"
            />
          </Field>
        </div>
      </section>
    </div>
  );
}
