import { OrgMembersView } from "@/components/organization/members/OrgMembersView";

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <OrgMembersView orgId={orgId} />;
}
