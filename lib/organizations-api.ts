import api from "@/lib/api";
import type {
  AcceptInviteRequestApi,
  DeclineInviteRequestApi,
  InvitePreviewOutApi,
  MemberRoleUpdateApi,
  MyInviteOutApi,
  OrgChatSessionCreateApi,
  OrgChatSessionOutApi,
  OrgChatSessionUpdateApi,
  OrgChatSessionWithMessagesApi,
  OrgInviteCreateApi,
  OrgInviteOutApi,
  OrgMemberOutApi,
  OrgRoadmapAssignApi,
  OrgRoadmapListItemApi,
  OrgRoadmapOutApi,
  OrganizationCreateApi,
  OrganizationListItemApi,
  OrganizationOutApi,
  OrganizationUpdateApi,
} from "@/types/organization-api";

export async function listMyOrganizations(): Promise<OrganizationListItemApi[]> {
  const res = await api.get<OrganizationListItemApi[]>("/api/organizations");
  return res.data;
}

export async function createOrganization(
  payload: OrganizationCreateApi,
): Promise<OrganizationOutApi> {
  const res = await api.post<OrganizationOutApi>(
    "/api/organizations",
    payload,
  );
  return res.data;
}

export async function getOrganization(
  orgId: string,
): Promise<OrganizationOutApi> {
  const res = await api.get<OrganizationOutApi>(
    `/api/organizations/${orgId}`,
  );
  return res.data;
}

export async function updateOrganization(
  orgId: string,
  payload: OrganizationUpdateApi,
): Promise<OrganizationOutApi> {
  const res = await api.patch<OrganizationOutApi>(
    `/api/organizations/${orgId}`,
    payload,
  );
  return res.data;
}

export async function deleteOrganization(orgId: string): Promise<void> {
  await api.delete(`/api/organizations/${orgId}`);
}

export async function deleteOrganizationLogo(orgId: string): Promise<void> {
  await api.delete(`/api/organizations/${orgId}/logo`);
}

export async function listOrganizationMembers(
  orgId: string,
): Promise<OrgMemberOutApi[]> {
  const res = await api.get<OrgMemberOutApi[]>(
    `/api/organizations/${orgId}/members`,
  );
  return res.data;
}

export async function removeOrganizationMember(
  orgId: string,
  userId: string,
): Promise<void> {
  await api.delete(`/api/organizations/${orgId}/members/${userId}`);
}

export async function updateOrganizationMemberRole(
  orgId: string,
  userId: string,
  payload: MemberRoleUpdateApi,
): Promise<OrgMemberOutApi> {
  const res = await api.patch<OrgMemberOutApi>(
    `/api/organizations/${orgId}/members/${userId}`,
    payload,
  );
  return res.data;
}

export async function leaveOrganization(orgId: string): Promise<void> {
  await api.delete(`/api/organizations/${orgId}/leave`);
}

export async function listOrganizationInvites(
  orgId: string,
): Promise<OrgInviteOutApi[]> {
  const res = await api.get<OrgInviteOutApi[]>(
    `/api/organizations/${orgId}/invites`,
  );
  return res.data;
}

export async function sendOrganizationInvite(
  orgId: string,
  payload: OrgInviteCreateApi,
): Promise<OrgInviteOutApi> {
  const res = await api.post<OrgInviteOutApi>(
    `/api/organizations/${orgId}/invites`,
    payload,
  );
  return res.data;
}

export async function cancelOrganizationInvite(
  orgId: string,
  inviteId: string,
): Promise<void> {
  await api.delete(`/api/organizations/${orgId}/invites/${inviteId}`);
}

export async function resendOrganizationInvite(
  orgId: string,
  inviteId: string,
): Promise<OrgInviteOutApi> {
  const res = await api.post<OrgInviteOutApi>(
    `/api/organizations/${orgId}/invites/${inviteId}/resend`,
  );
  return res.data;
}

export async function listMyOrganizationInvites(): Promise<MyInviteOutApi[]> {
  const res = await api.get<MyInviteOutApi[]>(
    "/api/organizations/invites/my-invites",
  );
  return res.data;
}

export async function previewOrganizationInvite(
  token: string,
): Promise<InvitePreviewOutApi> {
  const res = await api.get<InvitePreviewOutApi>(
    "/api/organizations/invites/preview",
    { params: { token } },
  );
  return res.data;
}

export async function acceptOrganizationInvite(
  payload: AcceptInviteRequestApi,
): Promise<unknown> {
  const res = await api.post(
    "/api/organizations/invites/accept",
    payload,
  );
  return res.data;
}

export async function declineOrganizationInvite(
  payload: DeclineInviteRequestApi,
): Promise<void> {
  await api.post("/api/organizations/invites/decline", payload);
}

export async function listOrganizationRoadmaps(
  orgId: string,
): Promise<OrgRoadmapListItemApi[]> {
  const res = await api.get<OrgRoadmapListItemApi[]>(
    `/api/organizations/${orgId}/roadmaps`,
  );
  return res.data;
}

export async function assignOrganizationRoadmap(
  orgId: string,
  payload: OrgRoadmapAssignApi,
): Promise<OrgRoadmapOutApi> {
  const res = await api.post<OrgRoadmapOutApi>(
    `/api/organizations/${orgId}/roadmaps`,
    payload,
  );
  return res.data;
}

/** Org-scoped summary: enrollment, team progress, creator — not full step content. */
export async function getOrganizationRoadmap(
  orgId: string,
  roadmapId: string,
): Promise<OrgRoadmapOutApi> {
  const res = await api.get<OrgRoadmapOutApi>(
    `/api/organizations/${orgId}/roadmaps/${roadmapId}`,
  );
  return res.data;
}

export async function removeOrganizationRoadmap(
  orgId: string,
  roadmapId: string,
): Promise<void> {
  await api.delete(
    `/api/organizations/${orgId}/roadmaps/${roadmapId}`,
  );
}

export async function enrollOrganizationRoadmap(
  orgId: string,
  roadmapId: string,
): Promise<void> {
  await api.post(
    `/api/organizations/${orgId}/roadmaps/${roadmapId}/enroll`,
  );
}

/** Fork a team roadmap into a personal copy (API response schema is open). */
export async function forkOrganizationRoadmapApi(
  orgId: string,
  roadmapId: string,
): Promise<OrgRoadmapOutApi> {
  const res = await api.post<OrgRoadmapOutApi>(
    `/api/organizations/${orgId}/roadmaps/${roadmapId}/fork`,
  );
  return res.data;
}

export async function listOrganizationChatSessions(
  orgId: string,
): Promise<OrgChatSessionOutApi[]> {
  const res = await api.get<OrgChatSessionOutApi[]>(
    `/api/organizations/${orgId}/chat/sessions`,
  );
  return res.data;
}

export async function createOrganizationChatSession(
  orgId: string,
  payload: OrgChatSessionCreateApi,
): Promise<OrgChatSessionOutApi> {
  const res = await api.post<OrgChatSessionOutApi>(
    `/api/organizations/${orgId}/chat/sessions`,
    payload,
  );
  return res.data;
}

export async function getOrganizationChatSession(
  orgId: string,
  sessionId: string,
): Promise<OrgChatSessionWithMessagesApi> {
  const res = await api.get<OrgChatSessionWithMessagesApi>(
    `/api/organizations/${orgId}/chat/sessions/${sessionId}`,
  );
  return res.data;
}

export async function renameOrganizationChatSession(
  orgId: string,
  sessionId: string,
  payload: OrgChatSessionUpdateApi,
): Promise<OrgChatSessionOutApi> {
  const res = await api.patch<OrgChatSessionOutApi>(
    `/api/organizations/${orgId}/chat/sessions/${sessionId}`,
    payload,
  );
  return res.data;
}

export async function deleteOrganizationChatSession(
  orgId: string,
  sessionId: string,
): Promise<void> {
  await api.delete(
    `/api/organizations/${orgId}/chat/sessions/${sessionId}`,
  );
}

export async function uploadOrganizationLogo(
  orgId: string,
  file: File,
): Promise<OrganizationOutApi> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<OrganizationOutApi>(
    `/api/organizations/${orgId}/logo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}
