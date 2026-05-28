import { listOrganizationRoadmaps } from "@/lib/organizations-api";

export async function fetchOrganizationRoadmapsRaw(
  orgId: string,
): Promise<unknown> {
  return listOrganizationRoadmaps(orgId);
}
