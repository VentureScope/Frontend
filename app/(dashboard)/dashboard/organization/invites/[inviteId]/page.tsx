import { PendingInviteDetailView } from "@/components/organization/invites/PendingInviteDetailView";

export default async function PendingInviteDetailPage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const { inviteId } = await params;
  return <PendingInviteDetailView inviteId={inviteId} />;
}
