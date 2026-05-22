import { CORE_SERVICE_OPTIONS } from "@/lib/organization-create-constants";
import { mapDeveloperSourcesToApi } from "@/lib/organization-create-mapper";
import { parseOrganizationRole } from "@/lib/organization-permissions";
import type { DeveloperEcosystemEntry } from "@/types/organization-create";
import type {
  GitHubOrgEntryApi,
  GitHubRepoEntryApi,
  OrganizationOutApi,
  OrganizationUpdateApi,
} from "@/types/organization-api";
import type { OrganizationProfile } from "@/types/organization-profile";

const CORE_SERVICE_IDS = new Set(
  CORE_SERVICE_OPTIONS.map((option) => option.id),
);

function trimOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function splitCoreServices(services: string[] | null | undefined): {
  coreServices: string[];
  customServices: string[];
} {
  const coreServices: string[] = [];
  const customServices: string[] = [];
  for (const service of services ?? []) {
    const id = service.trim();
    if (!id) continue;
    if (CORE_SERVICE_IDS.has(id)) {
      coreServices.push(id);
    } else {
      customServices.push(id);
    }
  }
  return { coreServices, customServices };
}

function devEntryId(kind: string, name: string) {
  return `${kind}-${name}`;
}

export function apiGithubToDeveloperSources(
  github_orgs?: GitHubOrgEntryApi[] | null,
  github_repos?: GitHubRepoEntryApi[] | null,
): DeveloperEcosystemEntry[] {
  const sources: DeveloperEcosystemEntry[] = [];

  for (const org of github_orgs ?? []) {
    const name = org.name.trim();
    if (!name) continue;
    sources.push({
      id: devEntryId("organization", name),
      kind: "organization",
      identifier: name,
      visibility: "public",
      connected: true,
    });
  }

  for (const repo of github_repos ?? []) {
    const name = repo.name.trim();
    if (!name) continue;
    sources.push({
      id: devEntryId("repository", name),
      kind: "repository",
      identifier: name,
      visibility: "public",
      connected: true,
    });
  }

  return sources;
}

/** Map `OrganizationOut` to UI profile model. */
export function toOrganizationProfile(
  api: OrganizationOutApi,
): OrganizationProfile {
  const { coreServices, customServices } = splitCoreServices(api.core_services);

  return {
    orgId: api.id,
    legalName: api.legal_name,
    displayName: api.display_name,
    tagline: api.tagline ?? "",
    logoUrl: api.logo_url ?? null,
    logoDataUrl: null,
    description: api.description ?? "",
    industryVertical: api.industry ?? "",
    coreServices,
    customServices,
    techStacks: [],
    products: [],
    website: api.website_url ?? "",
    linkedIn: api.linkedin_url ?? "",
    twitter: "",
    developerSources: apiGithubToDeveloperSources(
      api.github_orgs,
      api.github_repos,
    ),
    headquarters: "",
    foundedYear: "",
    companySize: "",
    contactEmail: "",
    contactPhone: "",
    missionStatement: "",
    customFields: [],
    myRole: parseOrganizationRole(api.my_role),
    updatedAt: api.updated_at,
  };
}

/** Map editable profile fields to `PATCH /api/organizations/{id}`. */
export function profileToOrganizationUpdateApi(
  profile: OrganizationProfile,
): OrganizationUpdateApi {
  const core_services = [
    ...profile.coreServices,
    ...profile.customServices.map((s) => s.trim()).filter(Boolean),
  ];

  const { github_orgs, github_repos } = mapDeveloperSourcesToApi(
    profile.developerSources,
  );

  return {
    display_name: trimOrNull(profile.displayName) ?? profile.legalName.trim(),
    tagline: trimOrNull(profile.tagline),
    description: trimOrNull(profile.description),
    industry: trimOrNull(profile.industryVertical),
    core_services: core_services.length > 0 ? core_services : null,
    website_url: normalizeUrl(profile.website),
    linkedin_url: normalizeUrl(profile.linkedIn),
    github_orgs,
    github_repos,
  };
}
