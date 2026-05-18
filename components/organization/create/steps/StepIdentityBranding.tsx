"use client";

import { useRef } from "react";
import { ImageIcon, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { WizardStepIntro } from "@/components/organization/create/WizardStepIntro";
import type { OrganizationCreateForm } from "@/types/organization-create";

type Props = {
  form: OrganizationCreateForm;
  onChange: (patch: Partial<OrganizationCreateForm>) => void;
};

export function StepIdentityBranding({ form, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange({ logoDataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <WizardStepIntro
        title="Branding"
        description="Add a tagline and logo so members recognize your workspace at a glance."
      />
      <Field>
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Organization tagline
        </FieldLabel>
        <div className="relative">
          <Input
            value={form.tagline}
            onChange={(e) => onChange({ tagline: e.target.value.slice(0, 60) })}
            placeholder="Innovating the future of intelligence"
            maxLength={60}
            className="h-11 border-border bg-muted pr-10"
          />
          <Sparkles className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <FieldDescription>
          A short, memorable summary of your mission (max 60 characters).
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Organization logo
        </FieldLabel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
            {form.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoDataUrl}
                alt="Organization logo preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/svg+xml"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => fileRef.current?.click()}
              >
                Upload image
              </Button>
              {form.logoDataUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onChange({ logoDataUrl: null })}
                >
                  Remove
                </Button>
              )}
            </div>
            <FieldDescription>
              Recommended size: 512×512px. Formats: JPG, PNG, SVG.
            </FieldDescription>
          </div>
        </div>
      </Field>
    </div>
  );
}
