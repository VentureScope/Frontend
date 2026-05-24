/** Decoded claims from the invite JWT in the email link (`?token=`). */
export type DecodedInviteToken = {
  organizationId: string | null;
  organizationName: string | null;
  organizationLogo: string | null;
  organizationIndustry: string | null;
  organizationDescription: string | null;
  teamRole: string | null;
  inviterName: string | null;
  inviteeEmail: string | null;
  expiresAt: string | null;
  isExpired: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function pickString(
  row: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.trim().split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    const parsed = JSON.parse(json) as unknown;
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function expiryFromClaims(row: Record<string, unknown>): {
  expiresAt: string | null;
  isExpired: boolean;
} {
  const exp = row.exp;
  if (typeof exp === "number" && Number.isFinite(exp)) {
    const date = new Date(exp * 1000);
    return {
      expiresAt: date.toISOString(),
      isExpired: date.getTime() < Date.now(),
    };
  }

  const expiresAt = pickString(row, [
    "expires_at",
    "expiresAt",
    "expiry",
    "expiration",
  ]);

  if (expiresAt) {
    const parsed = Date.parse(expiresAt);
    return {
      expiresAt,
      isExpired: !Number.isNaN(parsed) && parsed < Date.now(),
    };
  }

  return { expiresAt: null, isExpired: false };
}

/**
 * Decode invite JWT payload for display (no signature verification).
 * Accept API still validates the token server-side.
 */
export function decodeInviteToken(token: string | null | undefined): DecodedInviteToken | null {
  const trimmed = token?.trim();
  if (!trimmed) {
    return null;
  }

  const payload = decodeJwtPayload(trimmed);
  if (!payload) {
    return null;
  }

  const org = asRecord(payload.organization);
  const company = asRecord(payload.company);
  const nested = org ?? company;

  const { expiresAt, isExpired } = expiryFromClaims(payload);

  return {
    organizationId:
      pickString(payload, [
        "organization_id",
        "org_id",
        "organizationId",
        "orgId",
      ]) ?? (nested ? pickString(nested, ["id", "organization_id"]) : null),
    organizationName:
      pickString(payload, [
        "organization_name",
        "org_name",
        "organizationName",
        "company_name",
        "companyName",
        "name",
      ]) ??
      (nested
        ? pickString(nested, [
            "organization_name",
            "display_name",
            "legal_name",
            "name",
          ])
        : null),
    organizationLogo:
      pickString(payload, ["organization_logo", "logo_url", "logoUrl"]) ??
      (nested ? pickString(nested, ["logo_url", "logo"]) : null),
    organizationIndustry:
      pickString(payload, [
        "organization_industry",
        "industry",
        "industry_vertical",
      ]) ?? (nested ? pickString(nested, ["industry"]) : null),
    organizationDescription:
      pickString(payload, [
        "organization_description",
        "description",
        "mission_statement",
      ]) ?? (nested ? pickString(nested, ["description"]) : null),
    teamRole:
      pickString(payload, ["team_role", "teamRole", "role_title", "job_title"]),
    inviterName:
      pickString(payload, [
        "inviter_name",
        "inviterName",
        "invited_by",
        "invited_by_name",
      ]),
    inviteeEmail:
      pickString(payload, ["invitee_email", "email", "sub", "invited_email"]),
    expiresAt,
    isExpired,
  };
}

export function hasInviteDisplayData(decoded: DecodedInviteToken | null): boolean {
  if (!decoded) {
    return false;
  }
  return Boolean(
    decoded.organizationName ||
      decoded.organizationId ||
      decoded.teamRole ||
      decoded.inviterName,
  );
}
