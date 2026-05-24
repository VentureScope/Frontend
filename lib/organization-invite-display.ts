import type { InvitePreviewOutApi } from "@/types/organization-api";
import type { DecodedInviteToken } from "@/lib/organization-invite-token";

/** Unified invite details for the accept page UI. */
export type InviteDisplayData = {
  organizationId: string | null;
  organizationName: string | null;
  organizationLogo: string | null;
  organizationIndustry: string | null;
  organizationDescription: string | null;
  teamRole: string | null;
  inviterName: string | null;
  inviteeEmail: string | null;
  expiresAt: string | null;
  isValid: boolean;
  /** Where the primary org name came from — useful for loading states. */
  fromApi: boolean;
};

export function buildInviteDisplay(
  decoded: DecodedInviteToken | null,
  preview: InvitePreviewOutApi | null,
): InviteDisplayData | null {
  if (!decoded && !preview) {
    return null;
  }

  const expiresAt = preview?.expires_at ?? decoded?.expiresAt ?? null;
  const isExpired = decoded?.isExpired ?? false;

  return {
    organizationId:
      preview?.organization_id ?? decoded?.organizationId ?? null,
    organizationName:
      preview?.organization_name ?? decoded?.organizationName ?? null,
    organizationLogo:
      preview?.organization_logo ?? decoded?.organizationLogo ?? null,
    organizationIndustry:
      preview?.organization_industry ?? decoded?.organizationIndustry ?? null,
    organizationDescription:
      preview?.organization_description ??
      decoded?.organizationDescription ??
      null,
    teamRole: preview?.team_role ?? decoded?.teamRole ?? null,
    inviterName: preview?.inviter_name ?? decoded?.inviterName ?? null,
    inviteeEmail: decoded?.inviteeEmail ?? null,
    expiresAt,
    isValid: preview ? preview.is_valid : !isExpired,
    fromApi: Boolean(preview),
  };
}

export function formatInviteExpiry(iso: string | null | undefined): string | null {
  if (!iso?.trim()) {
    return null;
  }
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) {
    return iso;
  }
  return new Date(parsed).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
