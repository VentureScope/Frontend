import type { OrganizationInvite } from "@/types/organization-invite";

export const PENDING_INVITES_STORAGE_KEY = "venturescope-pending-invites-v2";

export const MOCK_PENDING_INVITES: OrganizationInvite[] = [
  {
    id: "inv-1",
    orgId: "initech-labs",
    organizationName: "Initech Labs",
    inviteeEmail: "alex.mekonnen@example.com",
    invitedBy: "Sarah Chen",
    invitedByEmail: "sarah.chen@initech.example",
    teamRole: "Frontend Engineer",
    accessRole: "member",
    sentAt: "2026-05-12",
    memberCount: 342,
    activeProjects: 6,
    industry: "Technology & Software",
    tagline: "Precision engineering for regulated industries",
    description:
      "Initech Labs builds compliance-ready software for healthcare and finance teams. You'll collaborate with product, platform, and data engineers on customer-facing roadmaps.",
    location: "Addis Ababa, Ethiopia",
    website: "https://initech.example",
    memberAvatars: [{ initials: "SC" }, { initials: "DL" }, { initials: "KM" }],
    extraMemberCount: 4,
    coreServices: ["Platform engineering", "Data pipelines", "Security"],
  },
  {
    id: "inv-2",
    orgId: "umbrella-analytics",
    organizationName: "Umbrella Analytics",
    inviteeEmail: "alex.mekonnen@example.com",
    invitedBy: "Marcus Webb",
    invitedByEmail: "marcus.webb@umbrella.example",
    teamRole: "Backend Lead",
    accessRole: "admin",
    sentAt: "2026-05-08",
    memberCount: 1180,
    activeProjects: 11,
    industry: "Data & Analytics",
    tagline: "Turning operational data into decisions",
    description:
      "Umbrella Analytics helps enterprises unify analytics, forecasting, and workforce planning. As Backend Lead you'll own API design and mentor engineers while helping manage org settings.",
    location: "Remote · EMEA",
    website: "https://umbrella.example",
    memberAvatars: [{ initials: "MW" }, { initials: "JT" }],
    extraMemberCount: 6,
    coreServices: ["Analytics", "ML platforms", "Executive dashboards"],
  },
];

function isCompleteInvite(raw: Record<string, unknown>): raw is OrganizationInvite {
  return (
    typeof raw.id === "string" &&
    typeof raw.orgId === "string" &&
    typeof raw.organizationName === "string" &&
    typeof raw.inviteeEmail === "string" &&
    typeof raw.teamRole === "string" &&
    (raw.accessRole === "admin" || raw.accessRole === "member")
  );
}

/** Backfill invites saved before teamRole / inviteeEmail fields existed. */
function normalizeInvite(
  raw: Record<string, unknown>,
): OrganizationInvite | null {
  if (isCompleteInvite(raw)) {
    return raw;
  }

  const mock = MOCK_PENDING_INVITES.find((m) => m.id === raw.id);
  if (!mock) return null;

  const legacyRole = raw.role as string | undefined;
  const accessRole =
    raw.accessRole === "admin" || raw.accessRole === "member"
      ? raw.accessRole
      : legacyRole === "admin" || legacyRole === "member"
        ? legacyRole
        : mock.accessRole;

  return {
    ...mock,
    ...raw,
    inviteeEmail:
      typeof raw.inviteeEmail === "string" ? raw.inviteeEmail : mock.inviteeEmail,
    teamRole: typeof raw.teamRole === "string" ? raw.teamRole : mock.teamRole,
    accessRole,
  } as OrganizationInvite;
}

export function addPendingInvite(invite: OrganizationInvite): void {
  const existing = loadPendingInvites();
  savePendingInvites([invite, ...existing.filter((i) => i.id !== invite.id)]);
}

export function hasPendingInviteForOrgEmail(
  orgId: string,
  email: string,
): boolean {
  const normalized = email.trim().toLowerCase();
  return loadPendingInvites().some(
    (i) =>
      i.orgId === orgId && i.inviteeEmail.toLowerCase() === normalized,
  );
}

export function loadPendingInvites(): OrganizationInvite[] {
  if (typeof window === "undefined") {
    return MOCK_PENDING_INVITES;
  }
  try {
    const raw = sessionStorage.getItem(PENDING_INVITES_STORAGE_KEY);
    if (!raw) {
      sessionStorage.setItem(
        PENDING_INVITES_STORAGE_KEY,
        JSON.stringify(MOCK_PENDING_INVITES),
      );
      return MOCK_PENDING_INVITES;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const normalized = parsed
        .map((item) =>
          item && typeof item === "object"
            ? normalizeInvite(item as Record<string, unknown>)
            : null,
        )
        .filter((i): i is OrganizationInvite => i != null);
      if (normalized.length > 0) {
        return normalized;
      }
    }
  } catch {
    // fall through
  }
  sessionStorage.setItem(
    PENDING_INVITES_STORAGE_KEY,
    JSON.stringify(MOCK_PENDING_INVITES),
  );
  return MOCK_PENDING_INVITES;
}

export function savePendingInvites(invites: OrganizationInvite[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_INVITES_STORAGE_KEY, JSON.stringify(invites));
}

export function getPendingInviteById(id: string): OrganizationInvite | null {
  return loadPendingInvites().find((i) => i.id === id) ?? null;
}

export function removePendingInvite(id: string): OrganizationInvite[] {
  const next = loadPendingInvites().filter((i) => i.id !== id);
  savePendingInvites(next);
  return next;
}

export function getPendingInviteCount(): number {
  return loadPendingInvites().length;
}
