import type { OrganizationMember } from "@/types/organization-profile";
import type { OrganizationRole } from "@/types/organization";

export const ORG_MEMBERS_STORAGE_KEY = "venturescope-org-members-v1";

const SEED_MEMBERS: Record<string, OrganizationMember[]> = {
  "acme-corp": [
    {
      id: "user-demo",
      name: "You",
      email: "you@venturescope.dev",
      role: "owner",
      jobTitle: "Head of Engineering",
      initials: "YU",
      joinedAt: "2024-01-15",
      skills: ["TypeScript", "System Design", "React", "AWS"],
      githubUsername: "demo-dev",
      isCurrentUser: true,
    },
    {
      id: "user-jd",
      name: "Jordan Davis",
      email: "jordan.d@acme.example",
      role: "admin",
      jobTitle: "Platform Engineering Lead",
      initials: "JD",
      joinedAt: "2023-06-01",
      skills: ["Go", "Kubernetes", "Terraform", "SRE"],
      githubUsername: "jdavis",
    },
    {
      id: "user-sm",
      name: "Sam Morgan",
      email: "sam.m@acme.example",
      role: "member",
      jobTitle: "Security Engineer",
      initials: "SM",
      joinedAt: "2024-03-10",
      skills: ["Security", "Python", "Compliance"],
    },
    {
      id: "user-ak",
      name: "Ava Kim",
      email: "ava.k@acme.example",
      role: "member",
      jobTitle: "Frontend Engineer",
      initials: "AK",
      joinedAt: "2024-08-22",
      skills: ["React", "CSS", "Accessibility"],
    },
  ],
  "globex-ind": [
    {
      id: "user-demo",
      name: "You",
      email: "you@venturescope.dev",
      role: "admin",
      jobTitle: "Operations Analyst",
      initials: "YU",
      joinedAt: "2025-01-08",
      skills: ["Python", "SQL", "Forecasting", "Tableau"],
      isCurrentUser: true,
    },
    {
      id: "user-pl",
      name: "Priya Lal",
      email: "priya.l@globex.example",
      role: "member",
      jobTitle: "Supply Chain Analyst",
      initials: "PL",
      joinedAt: "2022-11-20",
      skills: ["Operations Research", "Excel", "R"],
    },
    {
      id: "user-rc",
      name: "Riley Chen",
      email: "riley.c@globex.example",
      role: "owner",
      jobTitle: "Director of Sustainability",
      initials: "RC",
      joinedAt: "2019-04-01",
      skills: ["ESG", "Reporting", "Policy"],
    },
  ],
};

function isMemberArray(value: unknown): value is OrganizationMember[] {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        m &&
        typeof m === "object" &&
        typeof (m as OrganizationMember).id === "string",
    )
  );
}

function loadAll(): Record<string, OrganizationMember[]> {
  if (typeof window === "undefined") {
    return { ...SEED_MEMBERS };
  }
  try {
    const raw = sessionStorage.getItem(ORG_MEMBERS_STORAGE_KEY);
    if (!raw) {
      sessionStorage.setItem(
        ORG_MEMBERS_STORAGE_KEY,
        JSON.stringify(SEED_MEMBERS),
      );
      return { ...SEED_MEMBERS };
    }
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const merged = { ...SEED_MEMBERS };
      for (const [orgId, list] of Object.entries(parsed)) {
        if (isMemberArray(list)) {
          merged[orgId] = list;
        }
      }
      return merged;
    }
  } catch {
    // fall through
  }
  return { ...SEED_MEMBERS };
}

function saveAll(data: Record<string, OrganizationMember[]>): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ORG_MEMBERS_STORAGE_KEY, JSON.stringify(data));
}

export function loadOrganizationMembers(orgId: string): OrganizationMember[] {
  const all = loadAll();
  return all[orgId] ?? [];
}

export function saveOrganizationMembers(
  orgId: string,
  members: OrganizationMember[],
): void {
  const all = loadAll();
  all[orgId] = members;
  saveAll(all);
}

export function getOrganizationMember(
  orgId: string,
  memberId: string,
): OrganizationMember | null {
  return loadOrganizationMembers(orgId).find((m) => m.id === memberId) ?? null;
}

export function updateMemberJobTitle(
  orgId: string,
  memberId: string,
  jobTitle: string,
): OrganizationMember | null {
  const members = loadOrganizationMembers(orgId);
  const index = members.findIndex((m) => m.id === memberId);
  if (index < 0) return null;
  members[index] = { ...members[index], jobTitle };
  saveOrganizationMembers(orgId, members);
  return members[index];
}

export function updateMemberAccessRole(
  orgId: string,
  memberId: string,
  role: OrganizationRole,
): OrganizationMember | null {
  const members = loadOrganizationMembers(orgId);
  const index = members.findIndex((m) => m.id === memberId);
  if (index < 0) return null;
  members[index] = { ...members[index], role };
  saveOrganizationMembers(orgId, members);
  return members[index];
}

export function removeOrganizationMember(
  orgId: string,
  memberId: string,
): boolean {
  const members = loadOrganizationMembers(orgId);
  const next = members.filter((m) => m.id !== memberId);
  if (next.length === members.length) return false;
  saveOrganizationMembers(orgId, next);
  return true;
}
