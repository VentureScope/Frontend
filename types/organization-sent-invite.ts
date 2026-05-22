/** Outgoing invite from `GET /api/organizations/{org_id}/invites`. */
export type SentOrganizationInvite = {
  id: string;
  orgId: string;
  inviteeEmail: string;
  sentAt: string;
  status: string;
  expiresAt: string;
};
