"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  CORE_SERVICE_OPTIONS,
  TECH_STACK_SUGGESTIONS,
} from "@/lib/organization-create-constants";
import { cn } from "@/lib/utils";

function serviceLabel(id: string): string {
  const preset = CORE_SERVICE_OPTIONS.find((o) => o.id === id);
  if (preset) return preset.title;
  return id.replace(/^custom-/, "").replace(/-/g, " ");
}

type Props = {
  coreServices: string[];
  customServices: string[];
  techStacks: string[];
  onChange: (patch: {
    coreServices?: string[];
    customServices?: string[];
    techStacks?: string[];
  }) => void;
  readOnly?: boolean;
};

export function ServicesTechStackEditor({
  coreServices,
  customServices,
  techStacks,
  onChange,
  readOnly = false,
}: Props) {
  const [showCustomService, setShowCustomService] = useState(false);
  const [customServiceName, setCustomServiceName] = useState("");
  const [techInput, setTechInput] = useState("");

  const allServices = [...coreServices, ...customServices];

  function toggleService(id: string) {
    const next = allServices.includes(id)
      ? allServices.filter((s) => s !== id)
      : [...allServices, id];
    onChange({
      coreServices: next.filter((id) =>
        CORE_SERVICE_OPTIONS.some((o) => o.id === id),
      ),
      customServices: next.filter(
        (id) => !CORE_SERVICE_OPTIONS.some((o) => o.id === id),
      ),
    });
  }

  function addCustomService() {
    const name = customServiceName.trim();
    if (!name) return;
    const id = `custom-${name.toLowerCase().replace(/\s+/g, "-")}`;
    if (allServices.includes(id)) {
      setCustomServiceName("");
      return;
    }
    onChange({ customServices: [...customServices, id] });
    setCustomServiceName("");
    setShowCustomService(false);
  }

  function addTechStack(value: string) {
    const v = value.trim();
    if (!v) return;
    const exists = techStacks.some(
      (t) => t.toLowerCase() === v.toLowerCase(),
    );
    if (exists) return;
    onChange({ techStacks: [...techStacks, v] });
    setTechInput("");
  }

  function removeTechStack(tech: string) {
    onChange({ techStacks: techStacks.filter((t) => t !== tech) });
  }

  if (readOnly) {
    return (
      <div className="space-y-6">
        <Field>
          <FieldLabel>Services & disciplines</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {allServices.length === 0 ? (
              <span className="text-sm text-muted-foreground">None listed</span>
            ) : (
              allServices.map((id) => (
                <span
                  key={id}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {serviceLabel(id)}
                </span>
              ))
            )}
          </div>
        </Field>
        <Field>
          <FieldLabel>Tech stack</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {techStacks.length === 0 ? (
              <span className="text-sm text-muted-foreground">None listed</span>
            ) : (
              techStacks.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
                >
                  {tech}
                </span>
              ))
            )}
          </div>
        </Field>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Field>
        <FieldLabel>Services & disciplines</FieldLabel>
        <FieldDescription className="mb-3">
          Select all areas your organization delivers. Add custom disciplines if
          needed.
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
          {!showCustomService ? (
            <button
              type="button"
              onClick={() => setShowCustomService(true)}
              className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border p-4 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            >
              <Plus className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Add custom
              </span>
            </button>
          ) : (
            <div className="flex min-h-[120px] flex-col justify-center gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 p-4">
              <Input
                value={customServiceName}
                onChange={(e) => setCustomServiceName(e.target.value)}
                placeholder="Service name"
                className="h-10 bg-card text-sm"
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
                  disabled={!customServiceName.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowCustomService(false);
                    setCustomServiceName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        {customServices.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {customServices.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {serviceLabel(id)}
                <button
                  type="button"
                  className="hover:text-primary/80"
                  onClick={() =>
                    onChange({
                      customServices: customServices.filter((c) => c !== id),
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

      <Field>
        <FieldLabel>Tech stack</FieldLabel>
        <FieldDescription className="mb-3">
          Add languages, frameworks, and infrastructure your teams use.
        </FieldDescription>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK_SUGGESTIONS.map((tech) => {
            const selected = techStacks.some(
              (t) => t.toLowerCase() === tech.toLowerCase(),
            );
            return (
              <button
                key={tech}
                type="button"
                onClick={() =>
                  selected ? removeTechStack(tech) : addTechStack(tech)
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selected
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {tech}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Custom technology"
            className="h-9 flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTechStack(techInput);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addTechStack(techInput)}
            disabled={!techInput.trim()}
          >
            Add
          </Button>
        </div>
        {techStacks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {techStacks.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechStack(tech)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${tech}`}
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
