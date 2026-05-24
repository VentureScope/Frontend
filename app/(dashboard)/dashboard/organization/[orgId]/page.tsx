import { OrganizationHubView } from "@/components/organization/OrganizationHubView";

export default async function OrganizationDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <OrganizationHubView orgId={orgId} />;
}
