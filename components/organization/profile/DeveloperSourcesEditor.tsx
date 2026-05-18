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
import type {
  DeveloperEcosystemEntry,
  DeveloperSourceKind,
  DeveloperSourceVisibility,
} from "@/types/organization-create";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function newEntryId() {
  return `dev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function needsConnection(
  kind: DeveloperSourceKind,
  visibility: DeveloperSourceVisibility,
) {
  return kind === "organization" || visibility === "private";
}

type Props = {
  sources: DeveloperEcosystemEntry[];
  onChange: (sources: DeveloperEcosystemEntry[]) => void;
  readOnly?: boolean;
};

export function DeveloperSourcesEditor({
  sources,
  onChange,
  readOnly = false,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [kind, setKind] = useState<DeveloperSourceKind>("repository");
  const [identifier, setIdentifier] = useState("");
  const [visibility, setVisibility] =
    useState<DeveloperSourceVisibility>("public");
  const [pendingConnected, setPendingConnected] = useState(false);

  const requiresConnect = needsConnection(kind, visibility);

  function removeEntry(id: string) {
    onChange(sources.filter((e) => e.id !== id));
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

    const duplicate = sources.some(
      (e) =>
        e.kind === kind && e.identifier.toLowerCase() === value.toLowerCase(),
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

    onChange([...sources, entry]);
    resetAddForm();
    toast.success("Source added.");
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Link GitHub organizations and repositories to power engineering insights.
        Public repos can be added without OAuth.
      </p>

      {sources.length > 0 && (
        <ul className="space-y-2">
          {sources.map((entry) => (
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
                  <span className="text-muted-foreground">
                    {entry.kind === "organization" ? "Org · " : "Repo · "}
                  </span>
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
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                  aria-label="Remove source"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {readOnly && sources.length === 0 && (
        <p className="text-sm text-muted-foreground">No developer sources linked.</p>
      )}

      {!readOnly && (
        <>
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add GitHub source
            </button>
          ) : (
            <div className="vs-surface-accent space-y-4 rounded-md p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground">New source</p>
                <button
                  type="button"
                  onClick={resetAddForm}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted"
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
                      {
                        value: "repository" as const,
                        label: "Repository",
                        icon: FolderGit2,
                      },
                      {
                        value: "organization" as const,
                        label: "Organization",
                        icon: Building2,
                      },
                    ] as const
                  ).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setKind(value);
                        setPendingConnected(false);
                        if (value === "organization") setVisibility("private");
                      }}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-medium",
                        kind === value
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground",
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
              </Field>

              {kind === "repository" && (
                <Field>
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Visibility
                  </FieldLabel>
                  <div className="flex gap-2">
                    {(["public", "private"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setVisibility(v);
                          setPendingConnected(false);
                        }}
                        className={cn(
                          "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium capitalize",
                          visibility === v
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground",
                        )}
                      >
                        {v}
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
                    <div>
                      <p className="text-xs font-medium">GitHub access</p>
                      <p className="text-[10px] text-muted-foreground">
                        Required for{" "}
                        {kind === "organization" ? "organizations" : "private repos"}
                      </p>
                    </div>
                  </div>
                  {pendingConnected ? (
                    <span className="text-[10px] font-semibold uppercase text-primary">
                      Connected
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 px-2 text-[10px] font-semibold uppercase text-primary"
                      onClick={handleConnect}
                    >
                      <Link2 className="h-3 w-3" />
                      Connect
                    </Button>
                  )}
                </div>
              )}

              <Button type="button" size="sm" className="h-9 w-full" onClick={addEntry}>
                Add source
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
