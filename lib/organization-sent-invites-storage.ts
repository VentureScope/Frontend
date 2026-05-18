import type { SentOrganizationInvite } from "@/types/organization-sent-invite";

export const SENT_INVITES_STORAGE_KEY = "venturescope-org-sent-invites";

function loadAllSent(): SentOrganizationInvite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SENT_INVITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SentOrganizationInvite =>
        item != null &&
        typeof item === "object" &&
        typeof (item as SentOrganizationInvite).id === "string" &&
        typeof (item as SentOrganizationInvite).orgId === "string",
    );
  } catch {
    return [];
  }
}

function saveAllSent(invites: SentOrganizationInvite[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SENT_INVITES_STORAGE_KEY, JSON.stringify(invites));
}

export function getSentInvitesForOrg(orgId: string): SentOrganizationInvite[] {
  return loadAllSent()
    .filter((i) => i.orgId === orgId)
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

export function addSentInvite(invite: SentOrganizationInvite): void {
  const all = loadAllSent();
  saveAllSent([invite, ...all]);
}

export function hasPendingSentInvite(
  orgId: string,
  email: string,
): boolean {
  const normalized = email.trim().toLowerCase();
  return loadAllSent().some(
    (i) =>
      i.orgId === orgId &&
      i.inviteeEmail.toLowerCase() === normalized &&
      i.status === "pending",
  );
}
