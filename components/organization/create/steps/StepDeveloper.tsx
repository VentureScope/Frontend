"use client";

import { useState } from "react";
import {
  Building2,
  FolderGit2,
  Github,
  Link2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { WizardStepIntro } from "@/components/organization/create/WizardStepIntro";
import type {
  DeveloperEcosystemEntry,
  DeveloperSourceKind,
  DeveloperSourceVisibility,
  OrganizationCreateForm,
} from "@/types/organization-create";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  form: OrganizationCreateForm;
  onChange: (patch: Partial<OrganizationCreateForm>) => void;
};

function newEntryId() {
  return `dev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function needsConnection(
  kind: DeveloperSourceKind,
  visibility: DeveloperSourceVisibility,
) {
  return kind === "organization" || visibility === "private";
}


export function StepDeveloper({ form, onChange }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [kind, setKind] = useState<DeveloperSourceKind>("repository");
  const [identifier, setIdentifier] = useState("");
  const [visibility, setVisibility] =
    useState<DeveloperSourceVisibility>("public");
  const [pendingConnected, setPendingConnected] = useState(false);

  const requiresConnect = needsConnection(kind, visibility);

  function updateSources(sources: DeveloperEcosystemEntry[]) {
    onChange({ developerSources: sources });
  }

  function removeEntry(id: string) {
    updateSources(form.developerSources.filter((e) => e.id !== id));
  }

  function resetAddForm() {
    setShowAddForm(false);
    setKind("repository");
    setIdentifier("");
    setVisibility("public");
    setPendingConnected(false);
  }

  function handleConnect() {
    if (!identifier.trim()) {
      toast.error("Enter a GitHub org or repository first.");
      return;
    }
    setPendingConnected(true);
    toast.success("GitHub connected for this source.");
  }

  function addEntry() {
    const value = identifier.trim().replace(/^@/, "");
    if (!value) {
      toast.error(
        kind === "organization"
          ? "Enter a GitHub organization name."
          : "Enter a repository as owner/repo.",
      );
      return;
    }

    if (kind === "repository" && !value.includes("/")) {
      toast.error("Use the format owner/repository (e.g. acme-corp/api).");
      return;
    }

    const duplicate = form.developerSources.some(
      (e) =>
        e.kind === kind &&
        e.identifier.toLowerCase() === value.toLowerCase(),
    );
    if (duplicate) {
      toast.error("This source is already added.");
      return;
    }

    if (requiresConnect && !pendingConnected) {
      toast.error("Connect GitHub before adding this source.");
      return;
    }

    const entry: DeveloperEcosystemEntry = {
      id: newEntryId(),
      kind,
      identifier: value,
      visibility: kind === "organization" ? "private" : visibility,
      connected: requiresConnect ? pendingConnected : true,
    };

    updateSources([...form.developerSources, entry]);
    resetAddForm();
    toast.success("Source added.");
  }

  return (
    <div className="space-y-5">
      <WizardStepIntro
        title="Developer ecosystem"
        description="Add GitHub organizations or repositories to track engineering activity. Public repositories can be added without connecting."
      />

      {form.developerSources.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Added sources ({form.developerSources.length})
            </p>
            {!showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                aria-label="Add another source"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        <ul className="space-y-2">
          {form.developerSources.map((entry) => (
            <li
              key={entry.id}
              className="vs-surface flex items-center gap-3 rounded-md px-3 py-2.5"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  entry.kind === "organization"
                    ? "vs-icon-tile-accent"
                    : "vs-icon-tile-primary",
                )}
              >
                {entry.kind === "organization" ? (
                  <Building2 className="h-4 w-4" />
                ) : (
                  <FolderGit2 className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {entry.kind === "organization" ? (
                    <span className="text-muted-foreground">Org · </span>
                  ) : (
                    <span className="text-muted-foreground">Repo · </span>
                  )}
                  {entry.identifier}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {entry.kind === "repository" && entry.visibility === "public"
                    ? "Public — no connection required"
                    : entry.connected
                      ? "Connected"
                      : "Not connected"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Remove source"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        </div>
      )}

      {!showAddForm && form.developerSources.length === 0 ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add GitHub source
        </button>
      ) : showAddForm ? (
        <div className="vs-surface-accent space-y-4 rounded-md p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-foreground">New source</p>
            <button
              type="button"
              onClick={resetAddForm}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <Field>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Source type
            </FieldLabel>
            <div className="flex gap-2">
              {(
                [
                  { value: "repository" as const, label: "Repository", icon: FolderGit2 },
                  { value: "organization" as const, label: "Organization", icon: Building2 },
                ] as const
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setKind(value);
                    setPendingConnected(false);
                    if (value === "organization") {
                      setVisibility("private");
                    }
                  }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-medium transition-colors",
                    kind === value
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {kind === "organization" ? "Organization name" : "Repository"}
            </FieldLabel>
            <Input
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setPendingConnected(false);
              }}
              placeholder={
                kind === "organization" ? "acme-corp" : "owner/repository"
              }
              className="h-9 border-border bg-card text-sm"
            />
            <FieldDescription>
              {kind === "organization"
                ? "GitHub organization slug (e.g. acme-corp)."
                : "Full name including owner (e.g. acme-corp/platform)."}
            </FieldDescription>
          </Field>

          {kind === "repository" && (
            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Visibility
              </FieldLabel>
              <div className="flex gap-2">
                {(
                  [
                    { value: "public" as const, label: "Public" },
                    { value: "private" as const, label: "Private" },
                  ] as const
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setVisibility(value);
                      setPendingConnected(false);
                    }}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                      visibility === value
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {visibility === "public" && (
                <FieldDescription>
                  Public repositories are indexed without GitHub OAuth.
                </FieldDescription>
              )}
            </Field>
          )}

          {requiresConnect && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <Github className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    GitHub access
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Required for{" "}
                    {kind === "organization" ? "organizations" : "private repos"}
                  </p>
                </div>
              </div>
              {pendingConnected ? (
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  Connected
                </span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 shrink-0 gap-1 border-primary/25 px-2 text-[10px] font-semibold uppercase tracking-wide text-primary hover:bg-primary/5"
                  onClick={handleConnect}
                >
                  <Link2 className="h-3 w-3" />
                  Connect
                </Button>
              )}
            </div>
          )}

          <Button
            type="button"
            size="sm"
            className="h-9 w-full"
            onClick={addEntry}
          >
            Add source
          </Button>
        </div>
      ) : null}
    </div>
  );
}
