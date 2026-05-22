import { OrgCompanyProfileView } from "@/components/organization/profile/OrgCompanyProfileView";

export default async function OrganizationCompanyProfilePage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <OrgCompanyProfileView orgId={orgId} />;
}
