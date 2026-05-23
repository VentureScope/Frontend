import { CORE_SERVICE_OPTIONS } from "@/lib/organization-create-constants";
import { mapDeveloperSourcesToApi } from "@/lib/organization-create-mapper";
import { parseOrganizationRole } from "@/lib/organization-permissions";
import type { DeveloperEcosystemEntry } from "@/types/organization-create";
import type {
  CustomFieldApi,
  GitHubOrgEntryApi,
  GitHubRepoEntryApi,
  OrganizationOutApi,
  OrganizationUpdateApi,
  ProductEntryApi,
} from "@/types/organization-api";
import type {
  OrganizationCustomField,
  OrganizationProduct,
  OrganizationProductType,
  OrganizationProfile,
} from "@/types/organization-profile";

const CORE_SERVICE_IDS = new Set(
  CORE_SERVICE_OPTIONS.map((option) => option.id),
);

const PRODUCT_TYPES = new Set<OrganizationProductType>([
  "website",
  "app",
  "api",
  "platform",
  "other",
]);

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

function productId(name: string, index: number) {
  return `product-${index}-${name.trim().toLowerCase().replace(/\s+/g, "-")}`;
}

function parseProductType(value: string | null | undefined): OrganizationProductType {
  const normalized = value?.trim().toLowerCase();
  if (normalized && PRODUCT_TYPES.has(normalized as OrganizationProductType)) {
    return normalized as OrganizationProductType;
  }
  return "other";
}

function apiProductsToUi(
  products: ProductEntryApi[] | null | undefined,
): OrganizationProduct[] {
  return (products ?? []).map((product, index) => ({
    id: productId(product.name, index),
    name: product.name,
    productType: parseProductType(product.type),
    hostedUrl: product.url ?? "",
    description: "",
    linkedRepos: product.repos ?? [],
  }));
}

function uiProductsToApi(
  products: OrganizationProduct[],
): ProductEntryApi[] | null {
  const entries = products
    .map((product) => ({
      name: product.name.trim(),
      type: product.productType === "other" ? null : product.productType,
      url: trimOrNull(product.hostedUrl),
      repos: product.linkedRepos.map((r) => r.trim()).filter(Boolean),
    }))
    .filter((product) => product.name.length > 0);

  return entries.length > 0 ? entries : null;
}

function apiCustomFieldsToUi(
  fields: CustomFieldApi[] | null | undefined,
): OrganizationCustomField[] {
  return (fields ?? []).map((field) => ({
    id: field.id,
    label: field.label,
    value: field.value,
  }));
}

function uiCustomFieldsToApi(
  fields: OrganizationCustomField[],
): CustomFieldApi[] | null {
  const entries = fields
    .map((field) => ({
      id: field.id,
      label: field.label.trim(),
      value: field.value.trim(),
    }))
    .filter((field) => field.label.length > 0);

  return entries.length > 0 ? entries : null;
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
    techStacks: api.tech_stacks ?? [],
    products: apiProductsToUi(api.products),
    website: api.website_url ?? "",
    linkedIn: api.linkedin_url ?? "",
    twitter: api.twitter_url ?? "",
    developerSources: apiGithubToDeveloperSources(
      api.github_orgs,
      api.github_repos,
    ),
    headquarters: api.headquarters ?? "",
    foundedYear:
      api.founded_year != null ? String(api.founded_year) : "",
    companySize: api.company_size ?? "",
    contactEmail: api.contact_email ?? "",
    contactPhone: api.contact_phone ?? "",
    missionStatement: api.mission_statement ?? "",
    customFields: apiCustomFieldsToUi(api.custom_fields),
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

  const foundedYear = profile.foundedYear.trim();
  const parsedYear = foundedYear ? Number(foundedYear) : null;

  return {
    display_name: trimOrNull(profile.displayName) ?? profile.legalName.trim(),
    tagline: trimOrNull(profile.tagline),
    description: trimOrNull(profile.description),
    industry: trimOrNull(profile.industryVertical),
    core_services: core_services.length > 0 ? core_services : null,
    tech_stacks:
      profile.techStacks.map((s) => s.trim()).filter(Boolean).length > 0
        ? profile.techStacks.map((s) => s.trim()).filter(Boolean)
        : null,
    website_url: normalizeUrl(profile.website),
    linkedin_url: normalizeUrl(profile.linkedIn),
    twitter_url: normalizeUrl(profile.twitter),
    github_orgs,
    github_repos,
    headquarters: trimOrNull(profile.headquarters),
    founded_year:
      parsedYear != null && !Number.isNaN(parsedYear) ? parsedYear : null,
    company_size: trimOrNull(profile.companySize),
    contact_email: trimOrNull(profile.contactEmail),
    contact_phone: trimOrNull(profile.contactPhone),
    mission_statement: trimOrNull(profile.missionStatement),
    products: uiProductsToApi(profile.products),
    custom_fields: uiCustomFieldsToApi(profile.customFields),
  };
}
