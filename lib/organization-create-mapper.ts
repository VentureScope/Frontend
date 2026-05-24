import type { OrganizationCreateForm } from "@/types/organization-create";
import type {
  GitHubOrgEntryApi,
  GitHubRepoEntryApi,
  OrganizationCreateApi,
} from "@/types/organization-api";

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

function githubUrlForSource(
  kind: "organization" | "repository",
  identifier: string,
): string | null {
  const id = identifier.trim().replace(/^@/, "");
  if (!id) return null;
  if (kind === "organization") {
    return `https://github.com/${id}`;
  }
  const path = id.includes("/") ? id : id;
  return `https://github.com/${path}`;
}

export function mapDeveloperSourcesToApi(
  sources: OrganizationCreateForm["developerSources"],
): {
  github_orgs: GitHubOrgEntryApi[] | null;
  github_repos: GitHubRepoEntryApi[] | null;
} {
  const github_orgs: GitHubOrgEntryApi[] = [];
  const github_repos: GitHubRepoEntryApi[] = [];

  for (const source of sources) {
    const name = source.identifier.trim().replace(/^@/, "");
    if (!name) continue;
    const url = githubUrlForSource(source.kind, name);
    if (source.kind === "organization") {
      github_orgs.push({ name, url });
    } else {
      github_repos.push({ name, url });
    }
  }

  return {
    github_orgs: github_orgs.length > 0 ? github_orgs : null,
    github_repos: github_repos.length > 0 ? github_repos : null,
  };
}

/** Map wizard form state to `POST /api/organizations` body. */
export function formToOrganizationCreateApi(
  form: OrganizationCreateForm,
): OrganizationCreateApi {
  const legal = form.legalName.trim();
  const display = form.displayName.trim();
  const legal_name = legal || display;
  const display_name = display || legal;

  const core_services = [
    ...form.coreServices,
    ...form.customServices.map((s) => s.trim()).filter(Boolean),
  ];

  const { github_orgs, github_repos } = mapDeveloperSourcesToApi(
    form.developerSources,
  );

  return {
    legal_name,
    display_name,
    tagline: trimOrNull(form.tagline),
    description: trimOrNull(form.description),
    industry: trimOrNull(form.industryVertical),
    core_services: core_services.length > 0 ? core_services : null,
    website_url: normalizeUrl(form.website),
    linkedin_url: normalizeUrl(form.linkedIn),
    github_orgs,
    github_repos,
  };
}
