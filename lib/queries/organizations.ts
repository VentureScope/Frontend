import { getApiErrorMessage } from "@/lib/auth-api";
import { cacheOrganizationName } from "@/lib/organization-label-cache";
import { cacheMemberName } from "@/lib/organization-label-cache";
import { getCurrentMemberFromList } from "@/lib/organization-member-service";
import { parseOrganizationMembers } from "@/lib/organization-member-parsers";
import { parseOrganizationRole } from "@/lib/organization-permissions";
import {
  parseOrganizationListItems,
  parseOrganizationOutApi,
} from "@/lib/organization-response-parsers";
import {
  getOrganization,
  listMyOrganizations,
  listOrganizationMembers,
} from "@/lib/organizations-api";
import type { OrganizationListItem } from "@/types/organization";
import type { OrganizationRole } from "@/types/organization";
import type { OrganizationMember } from "@/types/organization-profile";
import type { OrganizationOutApi } from "@/types/organization-api";
import { AxiosError } from "axios";

export async function fetchMyOrganizations(): Promise<OrganizationListItem[]> {
  const data = await listMyOrganizations();
  const items = parseOrganizationListItems(data);
  for (const org of items) {
    cacheOrganizationName(org.id, org.name);
  }
  return items;
}

export type OrganizationDetailResult =
  | { kind: "ok"; data: NonNullable<ReturnType<typeof parseOrganizationOutApi>> }
  | { kind: "not_found" };

export async function fetchOrganizationDetail(
  orgId: string,
): Promise<OrganizationDetailResult> {
  try {
    const raw = await getOrganization(orgId);
    const parsed = parseOrganizationOutApi(raw);
    if (!parsed) {
      return { kind: "not_found" };
    }
    const name =
      parsed.display_name?.trim() || parsed.legal_name?.trim() || "Organization";
    cacheOrganizationName(orgId, name);
    return { kind: "ok", data: parsed };
  } catch (err: unknown) {
    const status =
      err instanceof AxiosError ? err.response?.status : undefined;
    if (status === 404) {
      return { kind: "not_found" };
    }
    throw new Error(getApiErrorMessage(err));
  }
}

export type OrganizationMembersResult = {
  members: OrganizationMember[];
  myRole: OrganizationRole;
};

export async function fetchOrganizationMembers(
  orgId: string,
  authUserId: string | null,
  authUserEmail: string | null,
): Promise<OrganizationMembersResult> {
  const data = await listOrganizationMembers(orgId);
  const members = parseOrganizationMembers(data, authUserId, authUserEmail);
  for (const m of members) {
    cacheMemberName(orgId, m.id, m.name);
  }
  const current = getCurrentMemberFromList(members);
  return {
    members,
    myRole: current?.role ?? parseOrganizationRole("member"),
  };
}
