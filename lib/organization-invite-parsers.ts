import { parseOrganizationOutApi } from "@/lib/organization-response-parsers";
import type {
  InvitePreviewOutApi,
  MyInviteOutApi,
} from "@/types/organization-api";
import type { PendingOrganizationInvite } from "@/types/organization-pending-invite";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function nullableString(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (typeof value === "string") return value;
  return undefined;
}

export function parseMyInviteOutApi(raw: unknown): MyInviteOutApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const organization_id = asString(row.organization_id);
  const organization_name = asString(row.organization_name);
  const token = asString(row.token);
  const expires_at = asString(row.expires_at);
  const created_at = asString(row.created_at);

  if (
    !id ||
    !organization_id ||
    !organization_name ||
    !token ||
    !expires_at ||
    !created_at
  ) {
    return null;
  }

  return {
    id,
    organization_id,
    organization_name,
    token,
    expires_at,
    created_at,
    organization_logo: nullableString(row.organization_logo),
    organization_industry: nullableString(row.organization_industry),
    team_role: nullableString(row.team_role),
    inviter_name: nullableString(row.inviter_name),
  };
}

export function toPendingOrganizationInvite(
  api: MyInviteOutApi,
): PendingOrganizationInvite {
  return {
    id: api.id,
    organizationId: api.organization_id,
    organizationName: api.organization_name,
    organizationLogo: api.organization_logo ?? null,
    organizationIndustry: api.organization_industry ?? null,
    teamRole: api.team_role ?? null,
    inviterName: api.inviter_name ?? null,
    token: api.token,
    expiresAt: api.expires_at,
    createdAt: api.created_at,
  };
}

export function parseMyOrganizationInvites(
  raw: unknown,
): PendingOrganizationInvite[] {
  if (!Array.isArray(raw)) return [];
  const invites: PendingOrganizationInvite[] = [];
  for (const entry of raw) {
    const parsed = parseMyInviteOutApi(entry);
    if (parsed) {
      invites.push(toPendingOrganizationInvite(parsed));
    }
  }
  return invites.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Resolve org id from POST /invites/accept — body may be empty or partial. */
export function parseAcceptInviteOrganizationId(
  raw: unknown,
  fallbackOrganizationId?: string | null,
): string | null {
  const full = parseOrganizationOutApi(raw);
  if (full?.id) {
    return full.id;
  }

  const row = asRecord(raw);
  if (row) {
    const orgId =
      asString(row.organization_id) ||
      asString(row.org_id) ||
      asString(row.id);
    if (orgId) {
      return orgId;
    }
  }

  const fallback = fallbackOrganizationId?.trim();
  if (fallback) {
    return fallback;
  }

  if (raw === null || raw === undefined) {
    return null;
  }

  if (row && Object.keys(row).length === 0) {
    return null;
  }

  return null;
}

export function parseInvitePreviewOutApi(
  raw: unknown,
): InvitePreviewOutApi | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = asString(row.id);
  const organization_id = asString(row.organization_id);
  const organization_name = asString(row.organization_name);
  const expires_at = asString(row.expires_at);
  const is_valid = row.is_valid === true;

  if (!id || !organization_id || !organization_name || !expires_at) {
    return null;
  }

  return {
    id,
    organization_id,
    organization_name,
    expires_at,
    is_valid,
    organization_logo: nullableString(row.organization_logo),
    organization_industry: nullableString(row.organization_industry),
    organization_description: nullableString(row.organization_description),
    team_role: nullableString(row.team_role),
    inviter_name: nullableString(row.inviter_name),
  };
}
