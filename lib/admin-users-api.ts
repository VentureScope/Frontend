import adminApi from "@/lib/admin-api";
import type {
  AdminMessageResponse,
  AdminUserListResponse,
  AdminUserResponse,
  AdminUserUpdatePayload,
  DeleteAdminUserParams,
  ListAdminUsersParams,
} from "@/types/admin";

export async function listAdminUsers(
  params: ListAdminUsersParams = {},
): Promise<AdminUserListResponse> {
  const res = await adminApi.get<AdminUserListResponse>("/api/admin/users", {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 20,
      include_inactive: params.include_inactive ?? false,
    },
  });
  return res.data;
}

export async function getAdminUser(userId: string): Promise<AdminUserResponse> {
  const res = await adminApi.get<AdminUserResponse>(
    `/api/admin/users/${userId}`,
  );
  return res.data;
}

export async function updateAdminUser(
  userId: string,
  payload: AdminUserUpdatePayload,
): Promise<AdminUserResponse> {
  const res = await adminApi.patch<AdminUserResponse>(
    `/api/admin/users/${userId}`,
    payload,
  );
  return res.data;
}

export async function deleteAdminUser(
  userId: string,
  params: DeleteAdminUserParams = {},
): Promise<AdminMessageResponse> {
  const res = await adminApi.delete<AdminMessageResponse>(
    `/api/admin/users/${userId}`,
    { params: { hard_delete: params.hard_delete ?? false } },
  );
  return res.data;
}

export async function reactivateAdminUser(
  userId: string,
): Promise<AdminUserResponse> {
  const res = await adminApi.post<AdminUserResponse>(
    `/api/admin/users/${userId}/reactivate`,
  );
  return res.data;
}
