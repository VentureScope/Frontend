/** Client-side labels for sync breadcrumbs (populated by org hooks/pages). */

const orgNames = new Map<string, string>();
const memberNames = new Map<string, string>();

function memberKey(orgId: string, memberId: string) {
  return `${orgId}:${memberId}`;
}

export function cacheOrganizationName(orgId: string, name: string): void {
  const trimmed = name.trim();
  if (!orgId || !trimmed) return;
  orgNames.set(orgId, trimmed);
}

export function getCachedOrganizationName(orgId: string): string | null {
  return orgNames.get(orgId) ?? null;
}

export function cacheMemberName(
  orgId: string,
  memberId: string,
  name: string,
): void {
  const trimmed = name.trim();
  if (!orgId || !memberId || !trimmed) return;
  memberNames.set(memberKey(orgId, memberId), trimmed);
}

export function getCachedMemberName(
  orgId: string,
  memberId: string,
): string | null {
  return memberNames.get(memberKey(orgId, memberId)) ?? null;
}
