const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Overview",
  "learning-path": "Learning Path",
  "ai-advisor": "AI Advisor",
  "resume-builder": "Resume Builder",
  "data-hub": "Data Hub",
  "market-trends": "Market Trends",
  settings: "Settings",
  profile: "Profile",
  organization: "Organizations",
  roadmaps: "My Roadmaps",
  advisor: "Org Advisor",
  members: "Members",
};

import { MOCK_PENDING_INVITES } from "@/lib/organization-invites-storage";
import { getOrganizationMember } from "@/lib/organization-members-storage";

const ORGANIZATION_SUB_LABELS: Record<string, string> = {
  new: "Create Organization",
  invites: "Pending Invites",
  roadmaps: "My Roadmaps",
  profile: "My Org Profile",
  advisor: "Org Advisor",
};

const ORG_NESTED_LABELS: Record<string, string> = {
  profile: "Company Profile",
  members: "Members",
  roadmaps: "Team Roadmaps",
};

export function getDashboardBreadcrumb(pathname: string): string {
  if (pathname === "/dashboard") {
    return BREADCRUMB_LABELS.dashboard;
  }

  const segments = pathname.replace(/^\/dashboard\/?/, "").split("/");
  const root = segments[0];

  if (!root) {
    return BREADCRUMB_LABELS.dashboard;
  }

  if (root === "organization") {
    const sub = segments[1];
    if (!sub) {
      return BREADCRUMB_LABELS.organization;
    }
    if (sub === "invites") {
      const inviteId = segments[2];
      if (!inviteId) {
        return ORGANIZATION_SUB_LABELS.invites;
      }
      const invite = MOCK_PENDING_INVITES.find((i) => i.id === inviteId);
      return invite
        ? `${invite.organizationName} · Invitation`
        : "Invitation";
    }
    if (ORGANIZATION_SUB_LABELS[sub]) {
      return ORGANIZATION_SUB_LABELS[sub];
    }
    const orgSlug = sub;
    const third = segments[2];
    if (third && ORG_NESTED_LABELS[third]) {
      const fourth = segments[3];
      if (third === "roadmaps" && fourth) {
        return `${nameFromOrgSlug(orgSlug)} · Roadmap`;
      }
      if (third === "members" && fourth) {
        const member = getOrganizationMember(orgSlug, fourth);
        return member
          ? `${nameFromOrgSlug(orgSlug)} · ${member.name}`
          : `${nameFromOrgSlug(orgSlug)} · Member`;
      }
      return `${nameFromOrgSlug(orgSlug)} · ${ORG_NESTED_LABELS[third]}`;
    }
    return nameFromOrgSlug(orgSlug);
  }

  return BREADCRUMB_LABELS[root] ?? root.split("-").map(capitalize).join(" ");
}

function capitalize(segment: string): string {
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

function nameFromOrgSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map(capitalize)
    .join(" ");
}
