import { OrganizationRoadmapDetailView } from "@/components/organization/roadmaps/OrganizationRoadmapDetailView";

export default async function OrganizationRoadmapDetailPage({
  params,
}: {
  params: Promise<{ orgId: string; roadmapId: string }>;
}) {
  const { orgId, roadmapId } = await params;
  return <OrganizationRoadmapDetailView orgId={orgId} roadmapId={roadmapId} />;
}
