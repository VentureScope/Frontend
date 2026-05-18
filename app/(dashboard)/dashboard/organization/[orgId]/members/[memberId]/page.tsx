import { OrgMemberDetailView } from "@/components/organization/members/OrgMemberDetailView";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";

function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function OrganizationMemberDetailPage({
  params,
}: {
  params: Promise<{ orgId: string; memberId: string }>;
}) {
  const { orgId, memberId } = await params;
  const org = MOCK_ORGANIZATIONS.find((o) => o.id === orgId);
  const orgName = org?.name ?? nameFromSlug(orgId);

  return (
    <OrgMemberDetailView orgId={orgId} orgName={orgName} memberId={memberId} />
  );
}
