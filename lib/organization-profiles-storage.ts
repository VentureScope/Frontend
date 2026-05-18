import type { OrganizationCreateForm } from "@/types/organization-create";
import type { OrganizationProfile } from "@/types/organization-profile";
import { normalizeOrganizationProfile } from "@/lib/organization-profile-normalize";

export const ORG_PROFILES_STORAGE_KEY = "venturescope-org-profiles";

function defaultProfile(orgId: string, displayName: string): OrganizationProfile {
  const names: Record<string, { legal: string; tagline: string; industry: string }> =
    {
      "acme-corp": {
        legal: "Acme Corporation",
        tagline: "Building the future of enterprise software",
        industry: "Technology & Software",
      },
      "globex-ind": {
        legal: "Globex Industries Ltd.",
        tagline: "Global operations, local impact",
        industry: "Manufacturing & Industrial",
      },
    };
  const preset = names[orgId];

  return {
    orgId,
    legalName: preset?.legal ?? displayName,
    displayName,
    tagline: preset?.tagline ?? "",
    logoDataUrl: null,
    description:
      preset?.legal === "Acme Corporation"
        ? "Acme Corp delivers cloud-native platforms and AI-enabled products for enterprise clients worldwide. Our engineering culture emphasizes ownership, measurable outcomes, and continuous learning."
        : "Globex Ind. connects supply chain, sustainability, and analytics teams across regions to modernize industrial operations.",
    industryVertical: preset?.industry ?? "Technology & Software",
    coreServices: ["frontend", "backend", "data-science"],
    customServices: [],
    techStacks:
      orgId === "acme-corp"
        ? ["TypeScript", "React", "Kubernetes", "AWS"]
        : ["Python", "SQL", "Tableau"],
    products:
      orgId === "acme-corp"
        ? [
            {
              id: "prod-acme-platform",
              name: "Acme Platform",
              productType: "platform",
              hostedUrl: "https://platform.acme.example",
              description:
                "Core B2B SaaS for enterprise workflow automation and analytics.",
              linkedRepos: ["acme-corp/platform", "acme-corp/api-gateway"],
            },
          ]
        : [],
    website: "https://example.com",
    linkedIn: "https://linkedin.com/company/example",
    twitter: "",
    developerSources:
      orgId === "acme-corp"
        ? [
            {
              id: "dev-acme-org",
              kind: "organization",
              identifier: "acme-corp",
              visibility: "private",
              connected: true,
            },
            {
              id: "dev-acme-platform",
              kind: "repository",
              identifier: "acme-corp/platform",
              visibility: "public",
              connected: true,
            },
          ]
        : [],
    headquarters: orgId === "acme-corp" ? "San Francisco, CA" : "Chicago, IL",
    foundedYear: orgId === "acme-corp" ? "1998" : "1972",
    companySize: orgId === "acme-corp" ? "1,001–5,000" : "5,001–10,000",
    contactEmail: "hello@example.com",
    contactPhone: "",
    missionStatement: "",
    customFields: [],
  };
}

export const DEFAULT_ORG_PROFILES: OrganizationProfile[] = [
  defaultProfile("acme-corp", "Acme Corp"),
  defaultProfile("globex-ind", "Globex Ind."),
];

export function createProfileFromWizard(
  orgId: string,
  form: OrganizationCreateForm,
): OrganizationProfile {
  return {
    orgId,
    legalName: form.legalName,
    displayName: form.displayName || form.legalName,
    tagline: form.tagline,
    logoDataUrl: form.logoDataUrl,
    description: form.description,
    industryVertical: form.industryVertical,
    coreServices: form.coreServices,
    customServices: form.customServices,
    techStacks: [],
    products: [],
    website: form.website,
    linkedIn: form.linkedIn,
    twitter: form.twitter,
    developerSources: form.developerSources,
    headquarters: "",
    foundedYear: "",
    companySize: "",
    contactEmail: "",
    contactPhone: "",
    missionStatement: "",
    customFields: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadAllOrganizationProfiles(): OrganizationProfile[] {
  if (typeof window === "undefined") {
    return DEFAULT_ORG_PROFILES;
  }
  try {
    const raw = sessionStorage.getItem(ORG_PROFILES_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_ORG_PROFILES;
    }
    const parsed = JSON.parse(raw) as OrganizationProfile[];
    const byId = new Map(
      DEFAULT_ORG_PROFILES.map((p) => [p.orgId, normalizeOrganizationProfile(p)]),
    );
    for (const p of parsed) {
      const base = byId.get(p.orgId);
      byId.set(
        p.orgId,
        normalizeOrganizationProfile({ ...base, ...p, orgId: p.orgId }),
      );
    }
    return [...byId.values()];
  } catch {
    return DEFAULT_ORG_PROFILES;
  }
}

export function getOrganizationProfile(orgId: string): OrganizationProfile | null {
  const profiles = loadAllOrganizationProfiles();
  const found = profiles.find((p) => p.orgId === orgId);
  return found ? normalizeOrganizationProfile(found) : null;
}

export function saveOrganizationProfile(profile: OrganizationProfile): void {
  if (typeof window === "undefined") {
    return;
  }
  const all = loadAllOrganizationProfiles();
  const next = all.filter((p) => p.orgId !== profile.orgId);
  next.push({
    ...normalizeOrganizationProfile(profile),
    updatedAt: new Date().toISOString(),
  });
  sessionStorage.setItem(ORG_PROFILES_STORAGE_KEY, JSON.stringify(next));
}
