import { OrgMemberDetailView } from "@/components/organization/members/OrgMemberDetailView";

export default async function OrganizationMemberDetailPage({
  params,
}: {
  params: Promise<{ orgId: string; memberId: string }>;
}) {
  const { orgId, memberId } = await params;
  return <OrgMemberDetailView orgId={orgId} memberId={memberId} />;
}
