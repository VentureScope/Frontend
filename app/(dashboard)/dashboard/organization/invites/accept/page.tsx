import { Suspense } from "react";
import { AcceptOrganizationInviteView } from "@/components/organization/invites/AcceptOrganizationInviteView";

export default function AcceptOrganizationInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl py-16 text-center text-sm text-muted-foreground">
          Loading invitation…
        </div>
      }
    >
      <AcceptOrganizationInviteView />
    </Suspense>
  );
}
