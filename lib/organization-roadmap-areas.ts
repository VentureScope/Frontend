import { CORE_SERVICE_OPTIONS } from "@/lib/organization-create-constants";
import type { OrganizationProfile } from "@/types/organization-profile";
import type { OrganizationMember } from "@/types/organization-profile";
import type { OrgRoadmapFocusArea } from "@/types/organization-roadmap";

const AREA_ICON: Record<string, string> = {
  frontend: "Share2",
  backend: "Cpu",
  "data-science": "BarChart2",
  cybersecurity: "Shield",
  "product-design": "Palette",
  engineering: "Cloud",
};

const GENERATION_TREND: Record<string, string> = {
  frontend: "Frontend Engineer",
  backend: "Backend Engineer",
  "data-science": "Data Scientist",
  cybersecurity: "Security Engineer",
  "product-design": "Product Designer",
  engineering: "Platform Engineer",
};

/** Map member job titles to company practice area ids */
export function mapJobTitleToAreaId(jobTitle: string): string {
  const t = jobTitle.toLowerCase();
  if (
    t.includes("front") ||
    t.includes("ui") ||
    t.includes("react") ||
    t.includes("mobile") ||
    t.includes("ios")
  ) {
    return "frontend";
  }
  if (t.includes("design") && !t.includes("system")) {
    return "product-design";
  }
  if (
    t.includes("security") ||
    t.includes("compliance") ||
    t.includes("secops")
  ) {
    return "cybersecurity";
  }
  if (
    t.includes("data") ||
    t.includes("ml") ||
    t.includes("machine learning") ||
    t.includes("analyst")
  ) {
    return "data-science";
  }
  if (
    t.includes("back") ||
    t.includes("api") ||
    t.includes("platform") ||
    t.includes("devops") ||
    t.includes("sre") ||
    t.includes("infrastructure") ||
    t.includes("full stack") ||
    t.includes("fullstack")
  ) {
    return t.includes("platform") || t.includes("devops") || t.includes("sre")
      ? "engineering"
      : "backend";
  }
  if (t.includes("engineer") || t.includes("developer")) {
    return "engineering";
  }
  return "engineering";
}

function skillTagsForArea(areaId: string, profileTech: string[]): string[] {
  const lower = profileTech.map((s) => s.toLowerCase());
  const pick = (keywords: string[]) =>
    profileTech.filter((_, i) =>
      keywords.some((k) => lower[i].includes(k)),
    );
  switch (areaId) {
    case "frontend":
      return pick(["react", "vue", "css", "next", "typescript", "javascript"]);
    case "backend":
      return pick(["node", "go", "python", "java", "api", "sql", "postgres"]);
    case "data-science":
      return pick(["python", "ml", "tensor", "pandas", "sql", "r "]);
    case "cybersecurity":
      return pick(["security", "aws", "terraform"]);
    default:
      return profileTech.slice(0, 6);
  }
}

function aggregateMemberSkills(members: OrganizationMember[]): string[] {
  const counts = new Map<string, number>();
  for (const m of members) {
    for (const s of m.skills) {
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill)
    .slice(0, 8);
}

function areaFromServiceId(
  serviceId: string,
  members: OrganizationMember[],
  profileTech: string[],
  customTitle?: string,
): OrgRoadmapFocusArea | null {
  const option = CORE_SERVICE_OPTIONS.find((o) => o.id === serviceId);
  const title = customTitle ?? option?.title ?? serviceId;
  const description =
    option?.description ??
    `Learning paths aligned with your ${title} practice at this organization.`;

  const inArea = members.filter((m) => mapJobTitleToAreaId(m.jobTitle) === serviceId);
  const memberCount = inArea.length;
  const topSkills =
    memberCount > 0 ? aggregateMemberSkills(inArea) : skillTagsForArea(serviceId, profileTech);

  return {
    id: serviceId,
    title,
    description,
    iconName: AREA_ICON[serviceId] ?? "BarChart2",
    memberCount,
    memberPreview: inArea.slice(0, 4).map((m) => m.name),
    topSkills,
    techStacks: skillTagsForArea(serviceId, profileTech),
    generationTrendName: GENERATION_TREND[serviceId] ?? title,
    badge: memberCount > 0 ? `${memberCount} TEAM MEMBERS` : "COMPANY AREA",
    badgeType: memberCount > 0 ? "team-backed" : "profile-only",
  };
}

/**
 * Focus areas for org roadmap creation.
 * Primary: company profile core services. Enriched with team counts & skills per area.
 */
export function getOrgRoadmapFocusAreas(
  _orgId: string,
  options: {
    profile?: OrganizationProfile | null;
    members?: OrganizationMember[];
  } = {},
): OrgRoadmapFocusArea[] {
  const profile = options.profile ?? null;
  const members = options.members ?? [];
  const profileTech = profile?.techStacks ?? [];

  const serviceIds = new Set<string>();

  for (const id of profile?.coreServices ?? []) {
    serviceIds.add(id);
  }

  if (serviceIds.size === 0) {
    for (const m of members) {
      serviceIds.add(mapJobTitleToAreaId(m.jobTitle));
    }
  }

  const areas: OrgRoadmapFocusArea[] = [];

  for (const id of serviceIds) {
    const area = areaFromServiceId(id, members, profileTech);
    if (area) {
      areas.push(area);
    }
  }

  for (const custom of profile?.customServices ?? []) {
    const slug = `custom-${custom.toLowerCase().replace(/\s+/g, "-").slice(0, 24)}`;
    if (areas.some((a) => a.title.toLowerCase() === custom.toLowerCase())) {
      continue;
    }
    areas.push({
      id: slug,
      title: custom,
      description: `Custom practice area defined for ${profile?.displayName ?? "your organization"}.`,
      iconName: "BarChart2",
      memberCount: 0,
      memberPreview: [],
      topSkills: profileTech.slice(0, 5),
      techStacks: profileTech.slice(0, 5),
      generationTrendName: custom,
      badge: "CUSTOM AREA",
      badgeType: "profile-only",
    });
  }

  return areas.sort((a, b) => b.memberCount - a.memberCount);
}

/** Suggested professional end goal for org roadmap generation (user-editable in UI). */
export function defaultOrgRoadmapProfessionalGoal(
  area: OrgRoadmapFocusArea,
  orgName?: string | null,
): string {
  const org = orgName?.trim() || "our team";
  return `Help ${org} build professional mastery as ${area.generationTrendName} and strengthen delivery in ${area.title}.`;
}
