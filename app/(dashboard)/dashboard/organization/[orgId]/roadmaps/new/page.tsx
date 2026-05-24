import { CreateOrgRoadmapWizard } from "@/components/organization/roadmaps/create/CreateOrgRoadmapWizard";

export default async function CreateOrganizationRoadmapPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <CreateOrgRoadmapWizard orgId={orgId} />;
}
