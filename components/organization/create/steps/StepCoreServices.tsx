"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { CORE_SERVICE_OPTIONS } from "@/lib/organization-create-constants";
import { WizardStepIntro } from "@/components/organization/create/WizardStepIntro";
import type { OrganizationCreateForm } from "@/types/organization-create";
import { cn } from "@/lib/utils";

type Props = {
  form: OrganizationCreateForm;
  onChange: (patch: Partial<OrganizationCreateForm>) => void;
};

export function StepCoreServices({ form, onChange }: Props) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");
  const allServices = [...form.coreServices, ...form.customServices];

  function toggleService(id: string) {
    const next = allServices.includes(id)
      ? allServices.filter((s) => s !== id)
      : [...allServices, id];
    const core = next.filter((id) =>
      CORE_SERVICE_OPTIONS.some((o) => o.id === id),
    );
    const custom = next.filter(
      (id) => !CORE_SERVICE_OPTIONS.some((o) => o.id === id),
    );
    onChange({ coreServices: core, customServices: custom });
  }

  function addCustomService() {
    const name = customName.trim();
    if (!name) return;
    const id = `custom-${name.toLowerCase().replace(/\s+/g, "-")}`;
    if (allServices.includes(id)) {
      setCustomName("");
      return;
    }
    onChange({ customServices: [...form.customServices, id] });
    setCustomName("");
    setShowCustomInput(false);
  }

  return (
    <div className="space-y-6">
      <WizardStepIntro
        title="Core technical services"
        description="Select the disciplines your teams focus on. You can add custom areas below."
      />

      <Field>
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Services
        </FieldLabel>
        <FieldDescription className="mb-3">
          Select all that apply to your organization.
        </FieldDescription>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_SERVICE_OPTIONS.map((service) => {
            const selected = allServices.includes(service.id);
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={cn(
                  "rounded-md border p-4 text-left transition-colors",
                  selected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card hover:border-primary/20",
                )}
              >
                <Icon
                  className={cn(
                    "mb-3 h-5 w-5",
                    selected ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <p className="text-sm font-semibold text-foreground">
                  {service.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </button>
            );
          })}

          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-transparent p-4 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Plus className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Add custom
              </span>
            </button>
          ) : (
            <div className="flex min-h-[120px] flex-col justify-center gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 p-4">
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Service name"
                className="h-10 border-border bg-card text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomService();
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="flex-1"
                  onClick={addCustomService}
                  disabled={!customName.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {form.customServices.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.customServices.map((id) => (
              <span
                key={id}
                className="vs-badge vs-badge-accent inline-flex items-center gap-1"
              >
                {id.replace(/^custom-/, "").replace(/-/g, " ")}
                <button
                  type="button"
                  className="ml-1 text-primary hover:text-primary/80"
                  onClick={() =>
                    onChange({
                      customServices: form.customServices.filter((c) => c !== id),
                    })
                  }
                  aria-label="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>
    </div>
  );
}
