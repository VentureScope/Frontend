import { parseOrganizationRole } from "@/lib/organization-permissions";
import type {
  GitHubOrgEntryApi,
  GitHubRepoEntryApi,
  OrganizationListItemApi,
  OrganizationOutApi,
} from "@/types/organization-api";
import type { OrganizationListItem, OrganizationRole } from "@/types/organization";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asString(item).trim())
    .filter(Boolean);
}

function asGithubOrgs(value: unknown): GitHubOrgEntryApi[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items: GitHubOrgEntryApi[] = [];
  for (const entry of value) {
    const row = asRecord(entry);
    if (!row) continue;
    const name = asString(row.name);
    if (!name) continue;
    items.push({
      name,
      url:
        row.url === null || typeof row.url === "string"
          ? (row.url as string | null)
          : undefined,
    });
  }
  return items.length > 0 ? items : [];
}

function asGithubRepos(value: unknown): GitHubRepoEntryApi[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items: GitHubRepoEntryApi[] = [];
  for (const entry of value) {
    const row = asRecord(entry);
    if (!row) continue;
    const name = asString(row.name);
    if (!name) continue;
    items.push({
      name,
      url:
        row.url === null || typeof row.url === "string"
          ? (row.url as string | null)
          : undefined,
    });
  }
  return items.length > 0 ? items : [];
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
}

function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "??";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

function placeholderAvatars(displayName: string): { initials: string }[] {
  const base = initialsFromName(displayName);
  return [{ initials: base }];
}

export interface OrganizationHubSummary {
  id: string;
  displayName: string;
  tagline: string | null;
  logoUrl: string | null;
  myRole: OrganizationRole;
  memberCount: number;
  industry: string | null;
}

export function parseOrganizationListItemApi(
  raw: unknown,
): OrganizationListItemApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const display_name = asString(row.display_name);
  const legal_name = asString(row.legal_name);
  const my_role = asString(row.my_role);
  const created_at = asString(row.created_at);

  if (!id || !display_name || !legal_name || !my_role || !created_at) {
    return null;
  }

  return {
    id,
    display_name,
    legal_name,
    my_role,
    created_at,
    logo_url:
      row.logo_url === null || typeof row.logo_url === "string"
        ? (row.logo_url as string | null)
        : undefined,
    industry:
      row.industry === null || typeof row.industry === "string"
        ? (row.industry as string | null)
        : undefined,
    member_count: asNumber(row.member_count, 0),
    pending_invites_count: asNumber(row.pending_invites_count, 0),
  };
}

export function toOrganizationListItem(
  api: OrganizationListItemApi,
): OrganizationListItem {
  const name = api.display_name.trim() || api.legal_name.trim() || "Organization";
  const memberCount = api.member_count ?? 0;

  return {
    id: api.id,
    name,
    role: parseOrganizationRole(api.my_role),
    memberCount,
    activeProjects: 0,
    logoUrl: api.logo_url ?? null,
    memberAvatars: placeholderAvatars(name),
    extraMemberCount:
      memberCount > 1 ? Math.max(0, memberCount - 1) : undefined,
  };
}

export function parseOrganizationListItems(
  raw: unknown,
): OrganizationListItem[] {
  if (!Array.isArray(raw)) return [];
  const items: OrganizationListItem[] = [];
  for (const entry of raw) {
    const parsed = parseOrganizationListItemApi(entry);
    if (parsed) {
      items.push(toOrganizationListItem(parsed));
    }
  }
  return items;
}

export function parseOrganizationOutApi(
  raw: unknown,
): OrganizationOutApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const owner_id = asString(row.owner_id);
  const legal_name = asString(row.legal_name);
  const display_name = asString(row.display_name);
  const created_at = asString(row.created_at);
  const updated_at = asString(row.updated_at);
  const my_role = asString(row.my_role);

  if (
    !id ||
    !owner_id ||
    !legal_name ||
    !display_name ||
    !created_at ||
    !updated_at ||
    !my_role
  ) {
    return null;
  }

  return {
    id,
    owner_id,
    legal_name,
    display_name,
    created_at,
    updated_at,
    my_role,
    tagline:
      row.tagline === null || typeof row.tagline === "string"
        ? (row.tagline as string | null)
        : undefined,
    logo_url:
      row.logo_url === null || typeof row.logo_url === "string"
        ? (row.logo_url as string | null)
        : undefined,
    description:
      row.description === null || typeof row.description === "string"
        ? (row.description as string | null)
        : undefined,
    industry:
      row.industry === null || typeof row.industry === "string"
        ? (row.industry as string | null)
        : undefined,
    core_services: asStringArray(row.core_services),
    website_url:
      row.website_url === null || typeof row.website_url === "string"
        ? (row.website_url as string | null)
        : undefined,
    linkedin_url:
      row.linkedin_url === null || typeof row.linkedin_url === "string"
        ? (row.linkedin_url as string | null)
        : undefined,
    github_orgs: asGithubOrgs(row.github_orgs),
    github_repos: asGithubRepos(row.github_repos),
    tech_stacks: asStringArray(row.tech_stacks),
    twitter_url:
      row.twitter_url === null || typeof row.twitter_url === "string"
        ? (row.twitter_url as string | null)
        : undefined,
    headquarters:
      row.headquarters === null || typeof row.headquarters === "string"
        ? (row.headquarters as string | null)
        : undefined,
    founded_year:
      row.founded_year === null || typeof row.founded_year === "number"
        ? (row.founded_year as number | null)
        : undefined,
    company_size:
      row.company_size === null || typeof row.company_size === "string"
        ? (row.company_size as string | null)
        : undefined,
    contact_email:
      row.contact_email === null || typeof row.contact_email === "string"
        ? (row.contact_email as string | null)
        : undefined,
    contact_phone:
      row.contact_phone === null || typeof row.contact_phone === "string"
        ? (row.contact_phone as string | null)
        : undefined,
    mission_statement:
      row.mission_statement === null ||
      typeof row.mission_statement === "string"
        ? (row.mission_statement as string | null)
        : undefined,
    products: Array.isArray(row.products)
      ? (row.products as OrganizationOutApi["products"])
      : null,
    custom_fields: Array.isArray(row.custom_fields)
      ? (row.custom_fields as OrganizationOutApi["custom_fields"])
      : null,
    member_count: asNumber(row.member_count, 0),
    members: Array.isArray(row.members)
      ? (row.members as OrganizationOutApi["members"])
      : [],
  };
}

export function toOrganizationHubSummary(
  api: OrganizationOutApi,
): OrganizationHubSummary {
  const displayName =
    api.display_name.trim() || api.legal_name.trim() || "Organization";

  return {
    id: api.id,
    displayName,
    tagline: api.tagline ?? null,
    logoUrl: api.logo_url ?? null,
    myRole: parseOrganizationRole(api.my_role),
    memberCount: api.member_count ?? api.members?.length ?? 0,
    industry: api.industry ?? null,
  };
}
