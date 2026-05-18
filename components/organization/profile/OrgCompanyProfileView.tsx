"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Globe,
  Linkedin,
  Plus,
  Save,
  Trash2,
  Twitter,
} from "lucide-react";
import { OrganizationPageHeader } from "@/components/organization/OrganizationPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { DeveloperSourcesEditor } from "@/components/organization/profile/DeveloperSourcesEditor";
import { OrganizationProductsEditor } from "@/components/organization/profile/OrganizationProductsEditor";
import { ServicesTechStackEditor } from "@/components/organization/profile/ServicesTechStackEditor";
import { INDUSTRY_VERTICALS } from "@/lib/organization-create-constants";
import { normalizeOrganizationProfile } from "@/lib/organization-profile-normalize";
import {
  getOrganizationProfile,
  saveOrganizationProfile,
} from "@/lib/organization-profiles-storage";
import type {
  OrganizationCustomField,
  OrganizationProfile,
} from "@/types/organization-profile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function newCustomFieldId() {
  return `cf-${Date.now()}`;
}

type Props = {
  orgId: string;
  orgName: string;
};

export function OrgCompanyProfileView({ orgId, orgName }: Props) {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<OrganizationProfile | null>(null);

  useEffect(() => {
    const loaded = getOrganizationProfile(orgId);
    if (loaded) {
      const normalized = normalizeOrganizationProfile(loaded);
      setProfile(normalized);
      setDraft(normalized);
    }
  }, [orgId]);

  function patchDraft(updates: Partial<OrganizationProfile>) {
    setDraft((prev) => (prev ? { ...prev, ...updates } : prev));
  }

  function handleSave() {
    if (!draft) return;
    if (!draft.displayName.trim() && !draft.legalName.trim()) {
      toast.error("Add a legal or display name.");
      return;
    }
    saveOrganizationProfile(draft);
    setProfile(draft);
    setIsEditing(false);
    toast.success("Company profile saved.");
  }

  function handleCancel() {
    setDraft(profile);
    setIsEditing(false);
  }

  function addCustomField() {
    if (!draft) return;
    patchDraft({
      customFields: [
        ...draft.customFields,
        { id: newCustomFieldId(), label: "", value: "" },
      ],
    });
  }

  function updateCustomField(
    id: string,
    patch: Partial<OrganizationCustomField>,
  ) {
    if (!draft) return;
    patchDraft({
      customFields: draft.customFields.map((f) =>
        f.id === id ? { ...f, ...patch } : f,
      ),
    });
  }

  function removeCustomField(id: string) {
    if (!draft) return;
    patchDraft({
      customFields: draft.customFields.filter((f) => f.id !== id),
    });
  }

  if (!profile || !draft) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Loading company profile…</p>
      </div>
    );
  }

  const data = isEditing ? draft : profile;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href={`/dashboard/organization/${orgId}`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {orgName}
      </Link>

      <OrganizationPageHeader
        label={orgName}
        title="Company profile"
        description="Company information from setup—identity, services, tech stack, products, developer integrations, and links. Owners and admins can edit and extend this profile."
        icon={Building2}
      />

      <div className="mb-8 flex flex-wrap items-center justify-end gap-3">
        {!isEditing ? (
          <Button size="sm" onClick={() => setIsEditing(true)}>
            Edit profile
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" className="gap-1.5" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </>
        )}
      </div>

      <div className="space-y-8">
        <section className="vs-surface space-y-5 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">Identity & branding</h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {data.logoDataUrl ? (
              <Image
                src={data.logoDataUrl}
                alt=""
                width={80}
                height={80}
                className="h-20 w-20 rounded-md border border-border object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted text-2xl font-bold text-muted-foreground">
                {(data.displayName || data.legalName).charAt(0)}
              </div>
            )}
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Legal name</FieldLabel>
                {isEditing ? (
                  <Input
                    value={draft.legalName}
                    onChange={(e) => patchDraft({ legalName: e.target.value })}
                    className="h-9"
                  />
                ) : (
                  <p className="text-sm text-foreground">
                    {data.legalName || "—"}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel>Display name</FieldLabel>
                {isEditing ? (
                  <Input
                    value={draft.displayName}
                    onChange={(e) => patchDraft({ displayName: e.target.value })}
                    className="h-9"
                  />
                ) : (
                  <p className="text-sm text-foreground">
                    {data.displayName || "—"}
                  </p>
                )}
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel>Tagline</FieldLabel>
                {isEditing ? (
                  <Input
                    value={draft.tagline}
                    onChange={(e) => patchDraft({ tagline: e.target.value })}
                    className="h-9"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {data.tagline || "—"}
                  </p>
                )}
              </Field>
            </div>
          </div>
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">About</h2>
          <Field>
            <FieldLabel>Description</FieldLabel>
            {isEditing ? (
              <textarea
                value={draft.description}
                onChange={(e) => patchDraft({ description: e.target.value })}
                rows={5}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {data.description || "No description yet."}
              </p>
            )}
          </Field>
          <Field>
            <FieldLabel>Industry</FieldLabel>
            {isEditing ? (
              <select
                value={draft.industryVertical}
                onChange={(e) =>
                  patchDraft({ industryVertical: e.target.value })
                }
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
              >
                <option value="">Select industry</option>
                {INDUSTRY_VERTICALS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-foreground">
                {data.industryVertical || "—"}
              </p>
            )}
          </Field>
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Services & tech stack
          </h2>
          <ServicesTechStackEditor
            coreServices={data.coreServices}
            customServices={data.customServices}
            techStacks={data.techStacks}
            onChange={(patch) => patchDraft(patch)}
            readOnly={!isEditing}
          />
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">Products</h2>
          <OrganizationProductsEditor
            products={data.products}
            onChange={(products) => patchDraft({ products })}
            readOnly={!isEditing}
          />
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Developer integrations
          </h2>
          <DeveloperSourcesEditor
            sources={data.developerSources}
            onChange={(developerSources) => patchDraft({ developerSources })}
            readOnly={!isEditing}
          />
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">Web & social</h2>
          <div className="grid gap-4 sm:grid-cols-1">
            {(
              [
                {
                  key: "website" as const,
                  label: "Website",
                  icon: Globe,
                  placeholder: "https://",
                },
                {
                  key: "linkedIn" as const,
                  label: "LinkedIn",
                  icon: Linkedin,
                  placeholder: "https://linkedin.com/company/…",
                },
                {
                  key: "twitter" as const,
                  label: "X (Twitter)",
                  icon: Twitter,
                  placeholder: "https://x.com/…",
                },
              ] as const
            ).map(({ key, label, icon: Icon, placeholder }) => (
              <Field key={key}>
                <FieldLabel className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </FieldLabel>
                {isEditing ? (
                  <Input
                    value={draft[key]}
                    onChange={(e) => patchDraft({ [key]: e.target.value })}
                    placeholder={placeholder}
                    className="h-9"
                  />
                ) : data[key] ? (
                  <a
                    href={data[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {data[key]}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </Field>
            ))}
          </div>
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Additional company information
          </h2>
          <p className="text-xs text-muted-foreground">
            Extend your public company profile beyond the setup wizard.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                { key: "headquarters" as const, label: "Headquarters" },
                { key: "foundedYear" as const, label: "Founded" },
                { key: "companySize" as const, label: "Company size" },
                { key: "contactEmail" as const, label: "Contact email" },
                { key: "contactPhone" as const, label: "Contact phone" },
              ] as const
            ).map(({ key, label }) => (
              <Field key={key}>
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                  <Input
                    value={draft[key]}
                    onChange={(e) => patchDraft({ [key]: e.target.value })}
                    className="h-9"
                  />
                ) : (
                  <p className="text-sm text-foreground">{data[key] || "—"}</p>
                )}
              </Field>
            ))}
          </div>
          <Field>
            <FieldLabel>Mission statement</FieldLabel>
            {isEditing ? (
              <textarea
                value={draft.missionStatement}
                onChange={(e) =>
                  patchDraft({ missionStatement: e.target.value })
                }
                rows={3}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
                placeholder="What drives your organization?"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {data.missionStatement || "—"}
              </p>
            )}
          </Field>
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground">Custom fields</h2>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={addCustomField}
              >
                <Plus className="h-3.5 w-3.5" />
                Add field
              </Button>
            )}
          </div>
          {data.customFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Add certifications, regions, partner programs, or any detail your team should see."
                : "No custom fields yet."}
            </p>
          ) : (
            <ul className="space-y-3">
              {data.customFields.map((field) => (
                <li
                  key={field.id}
                  className={cn(
                    "grid gap-3 rounded-md border border-border p-3",
                    isEditing ? "sm:grid-cols-[1fr_1fr_auto]" : "sm:grid-cols-2",
                  )}
                >
                  {isEditing ? (
                    <>
                      <Input
                        value={field.label}
                        onChange={(e) =>
                          updateCustomField(field.id, { label: e.target.value })
                        }
                        placeholder="Label"
                        className="h-9"
                      />
                      <Input
                        value={field.value}
                        onChange={(e) =>
                          updateCustomField(field.id, { value: e.target.value })
                        }
                        placeholder="Value"
                        className="h-9"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove field"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {field.label}
                      </p>
                      <p className="text-sm text-foreground">{field.value}</p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {profile.updatedAt && (
          <p className="text-center text-[10px] text-muted-foreground">
            Last updated {new Date(profile.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
