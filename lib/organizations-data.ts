import type { OrganizationListItem } from "@/types/organization";
import { MOCK_PENDING_INVITES } from "@/lib/organization-invites-storage";

/** Placeholder until organization APIs are wired. */
export const MOCK_ORGANIZATIONS: OrganizationListItem[] = [
  {
    id: "acme-corp",
    name: "Acme Corp",
    role: "owner",
    memberCount: 1248,
    activeProjects: 12,
    memberAvatars: [
      { initials: "JD" },
      { initials: "SM" },
      { initials: "AK" },
    ],
    extraMemberCount: 5,
  },
  {
    id: "globex-ind",
    name: "Globex Ind.",
    role: "admin",
    memberCount: 892,
    activeProjects: 8,
    memberAvatars: [
      { initials: "PL" },
      { initials: "RC" },
    ],
    extraMemberCount: 3,
  },
];

export { MOCK_PENDING_INVITES, getPendingInviteCount } from "@/lib/organization-invites-storage";

/** Default count for SSR; client reads live count from session storage. */
export const PENDING_INVITE_COUNT = MOCK_PENDING_INVITES.length;
