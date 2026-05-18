import type { OrganizationAccessRole } from "@/types/organization-invite";

/** Outgoing invite recorded by the organization (admin view). */
export type SentOrganizationInvite = {
  id: string;
  orgId: string;
  inviteeEmail: string;
  teamRole: string;
  accessRole: OrganizationAccessRole;
  sentAt: string;
  status: "pending";
};
