import { OrgTeamRoadmapsView } from "@/components/organization/roadmaps/OrgTeamRoadmapsView";

export default async function OrganizationTeamRoadmapsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <OrgTeamRoadmapsView orgId={orgId} />;
}
