import { Suspense } from "react";
import { AcceptOrganizationInviteView } from "@/components/organization/invites/AcceptOrganizationInviteView";
import { OrganizationInviteAcceptPageSkeleton } from "@/components/organization/OrganizationSkeletons";

export default function AcceptOrganizationInvitePage() {
  return (
    <Suspense fallback={<OrganizationInviteAcceptPageSkeleton />}>
      <AcceptOrganizationInviteView />
    </Suspense>
  );
}
