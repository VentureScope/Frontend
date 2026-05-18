import { OrgMembersView } from "@/components/organization/members/OrgMembersView";
import { MOCK_ORGANIZATIONS } from "@/lib/organizations-data";

function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = MOCK_ORGANIZATIONS.find((o) => o.id === orgId);
  const orgName = org?.name ?? nameFromSlug(orgId);

  return <OrgMembersView orgId={orgId} orgName={orgName} />;
}
