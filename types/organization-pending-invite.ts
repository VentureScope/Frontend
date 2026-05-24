/** Incoming invite from `GET /api/organizations/invites/my-invites`. */
export type PendingOrganizationInvite = {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo: string | null;
  organizationIndustry: string | null;
  teamRole: string | null;
  inviterName: string | null;
  token: string;
  expiresAt: string;
  createdAt: string;
};
