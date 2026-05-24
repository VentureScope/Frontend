"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Globe,
  ImageIcon,
  Linkedin,
  Save,
  Twitter,
} from "lucide-react";
import { OrganizationPageHeader } from "@/components/organization/OrganizationPageHeader";
import {
  OrganizationProfilePageSkeleton,
} from "@/components/organization/OrganizationSkeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { DeveloperSourcesEditor } from "@/components/organization/profile/DeveloperSourcesEditor";
import { OrganizationProductsEditor } from "@/components/organization/profile/OrganizationProductsEditor";
import { ServicesTechStackEditor } from "@/components/organization/profile/ServicesTechStackEditor";
import { INDUSTRY_VERTICALS } from "@/lib/organization-create-constants";
import {
  dataUrlToLogoFile,
  isSupportedOrganizationLogoMime,
} from "@/lib/organization-logo-utils";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import type { OrganizationProfile } from "@/types/organization-profile";
import { toast } from "sonner";

function resolveLogoSrc(
  profile: OrganizationProfile,
  preview: string | null,
): string | null {
  if (preview) return preview;
  return profile.logoDataUrl ?? profile.logoUrl ?? null;
}

type Props = {
  orgId: string;
};

export function OrgCompanyProfileView({ orgId }: Props) {
  const {
    profile,
    displayName,
    loading,
    saving,
    error,
    notFound,
    canEdit,
    reload,
    saveProfile,
  } = useOrganizationProfile(orgId);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<OrganizationProfile | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && !isEditing) {
      setDraft(profile);
    }
  }, [profile, isEditing]);

  function startEditing() {
    if (!profile) return;
    setDraft({ ...profile, logoDataUrl: null });
    setLogoPreview(null);
    setLogoFile(null);
    setRemoveLogo(false);
    setIsEditing(true);
  }

  function patchDraft(updates: Partial<OrganizationProfile>) {
    setDraft((prev) => (prev ? { ...prev, ...updates } : prev));
  }

  function handleLogoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isSupportedOrganizationLogoMime(file.type)) {
      toast.error("Logo must be JPG, PNG, or WEBP.");
      return;
    }
    setLogoFile(file);
    setRemoveLogo(false);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRemoveLogo() {
    setLogoPreview(null);
    setLogoFile(null);
    setRemoveLogo(true);
  }

  async function handleSave() {
    if (!draft) return;
    if (!draft.displayName.trim() && !draft.legalName.trim()) {
      toast.error("Add a display name.");
      return;
    }

    let fileToUpload = logoFile;
    if (!fileToUpload && logoPreview && !removeLogo) {
      fileToUpload = dataUrlToLogoFile(logoPreview);
    }

    try {
      await saveProfile(draft, {
        logoFile: fileToUpload,
        removeLogo,
      });
      setIsEditing(false);
      setLogoPreview(null);
      setLogoFile(null);
      setRemoveLogo(false);
      toast.success("Company profile saved.");
    } catch {
      toast.error("Could not save company profile.");
    }
  }

  function handleCancel() {
    setDraft(profile);
    setLogoPreview(null);
    setLogoFile(null);
    setRemoveLogo(false);
    setIsEditing(false);
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Organization not found.</p>
        <Button type="button" variant="outline" className="mt-4" asChild>
          <Link href="/dashboard/organization">Back to organizations</Link>
        </Button>
      </div>
    );
  }

  if (loading || !profile || !draft) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <OrgSkBackLink orgName="Organization" orgId={orgId} />
        <OrganizationPageHeader
          label="Organization"
          title="Company profile"
          description="Loading company profile…"
          icon={Building2}
        />
        <OrganizationProfilePageSkeleton />
      </div>
    );
  }

  const data = isEditing ? draft : profile;
  const logoSrc = isEditing
    ? removeLogo
      ? null
      : resolveLogoSrc(draft, logoPreview)
    : resolveLogoSrc(profile, null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <OrgSkBackLink orgName={displayName} orgId={orgId} />

      <OrganizationPageHeader
        label={displayName}
        title="Company profile"
        description={
          canEdit
            ? "Company information from setup—identity, services, developer integrations, and links. Owners can edit fields synced with the server."
            : "View your organization's profile. Contact the owner to request changes."
        }
        icon={Building2}
      />

      {error ? (
        <div className="mb-6 flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void reload()}
          >
            Retry
          </Button>
        </div>
      ) : null}

      <div className="mb-8 flex flex-wrap items-center justify-end gap-3">
        {canEdit && !isEditing ? (
          <Button size="sm" onClick={startEditing} disabled={saving}>
            Edit profile
          </Button>
        ) : canEdit && isEditing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </>
        ) : null}
      </div>

      <div className="space-y-8">
        <section className="vs-surface space-y-5 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Identity & branding
          </h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex flex-col items-start gap-2">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                {logoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              {isEditing && canEdit ? (
                <>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleLogoPick}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={saving}
                    >
                      {logoSrc ? "Change logo" : "Upload logo"}
                    </Button>
                    {(logoSrc || profile.logoUrl) && !removeLogo ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={handleRemoveLogo}
                        disabled={saving}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Legal name</FieldLabel>
                <p className="text-sm text-foreground">
                  {data.legalName || "—"}
                </p>
                {isEditing ? (
                  <FieldDescription>
                    Legal name is set at creation and cannot be changed here.
                  </FieldDescription>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Display name</FieldLabel>
                {isEditing ? (
                  <Input
                    value={draft.displayName}
                    onChange={(e) =>
                      patchDraft({ displayName: e.target.value })
                    }
                    className="h-9"
                    disabled={saving}
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
                    disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
          {isEditing ? null : (
            <FieldDescription>
              Additional tech stack labels are not stored on the server yet.
            </FieldDescription>
          )}
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">Products</h2>
          <FieldDescription className="mb-2">
            Product catalog is not synced with the API yet.
          </FieldDescription>
          <OrganizationProductsEditor
            products={data.products}
            onChange={(products) => patchDraft({ products })}
            readOnly
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
                  apiSynced: true,
                },
                {
                  key: "linkedIn" as const,
                  label: "LinkedIn",
                  icon: Linkedin,
                  placeholder: "https://linkedin.com/company/…",
                  apiSynced: true,
                },
                {
                  key: "twitter" as const,
                  label: "X (Twitter)",
                  icon: Twitter,
                  placeholder: "https://x.com/…",
                  apiSynced: false,
                },
              ] as const
            ).map(({ key, label, icon: Icon, placeholder, apiSynced }) => (
              <Field key={key}>
                <FieldLabel className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {!apiSynced ? (
                    <span className="text-[10px] font-normal text-muted-foreground">
                      (not synced)
                    </span>
                  ) : null}
                </FieldLabel>
                {isEditing && apiSynced ? (
                  <Input
                    value={draft[key]}
                    onChange={(e) => patchDraft({ [key]: e.target.value })}
                    placeholder={placeholder}
                    className="h-9"
                    disabled={saving}
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

        <section className="vs-surface space-y-4 rounded-md p-6 opacity-80">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              Custom fields
            </h2>
          </div>
          <FieldDescription>Not stored on the server yet.</FieldDescription>
          {data.customFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom fields yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.customFields.map((field) => (
                <li
                  key={field.id}
                  className="grid gap-3 rounded-md border border-border p-3 sm:grid-cols-2"
                >
                  <p className="text-xs font-semibold text-muted-foreground">
                    {field.label}
                  </p>
                  <p className="text-sm text-foreground">{field.value}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {profile.updatedAt ? (
          <p className="text-center text-[10px] text-muted-foreground">
            Last updated {new Date(profile.updatedAt).toLocaleString()}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function OrgSkBackLink({
  orgName,
  orgId,
}: {
  orgName: string;
  orgId: string;
}) {
  return (
    <Link
      href={`/dashboard/organization/${orgId}`}
      className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to {orgName}
    </Link>
  );
}
