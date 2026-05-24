/** Outgoing invite from `GET /api/organizations/{org_id}/invites`. */
export type SentOrganizationInvite = {
  id: string;
  orgId: string;
  inviteeEmail: string;
  teamRole: string | null;
  sentAt: string;
  status: string;
  expiresAt: string;
};
