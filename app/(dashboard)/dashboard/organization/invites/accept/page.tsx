import { Suspense } from "react";
import { AcceptOrganizationInviteView } from "@/components/organization/invites/AcceptOrganizationInviteView";

export default function AcceptOrganizationInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AcceptOrganizationInviteView />
    </Suspense>
  );
}
