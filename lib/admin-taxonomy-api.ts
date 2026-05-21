import adminApi from "@/lib/admin-api";

/** M9 — role taxonomy */
export async function listUnmatchedTaxonomyRoles(
  params: {
    page?: number;
    per_page?: number;
    status?: string;
    sort_by?: string;
  } = {},
): Promise<Record<string, unknown>> {
  const res = await adminApi.get<Record<string, unknown>>(
    "/api/admin/taxonomy/unmatched",
    { params },
  );
  return res.data;
}

export async function patchUnmatchedTaxonomyRole(
  roleId: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await adminApi.patch<Record<string, unknown>>(
    `/api/admin/taxonomy/unmatched/${roleId}`,
    payload,
  );
  return res.data;
}

export async function listTaxonomyRoles(): Promise<Record<string, unknown>> {
  const res = await adminApi.get<Record<string, unknown>>(
    "/api/admin/taxonomy/roles",
  );
  return res.data;
}
