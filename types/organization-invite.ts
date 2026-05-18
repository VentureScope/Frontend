import type { OrganizationRole } from "@/types/organization";

/** Org-level permissions after the member accepts. */
export type OrganizationAccessRole = Exclude<OrganizationRole, "owner">;

/** Invitation to join an organization (not yet accepted). */
export type OrganizationInvite = {
  id: string;
  orgId: string;
  organizationName: string;
  /** Email the invitation was sent to. */
  inviteeEmail: string;
  invitedBy: string;
  invitedByEmail: string;
  /** Team / job role (e.g. Frontend Engineer, Backend Developer). */
  teamRole: string;
  /** Organization access level (admin can manage members, profile, etc.). */
  accessRole: OrganizationAccessRole;
  sentAt: string;
  memberCount: number;
  activeProjects: number;
  industry: string;
  tagline: string;
  description: string;
  location: string;
  website?: string;
  memberAvatars: { initials: string }[];
  extraMemberCount?: number;
  coreServices: string[];
};
