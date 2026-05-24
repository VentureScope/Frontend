"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/auth-api";
import { canRemoveMember } from "@/lib/organization-member-service";
import { removeOrganizationMember } from "@/lib/organizations-api";
import type { OrganizationRole } from "@/types/organization";
import type { OrganizationMember } from "@/types/organization-profile";

type RemoveMemberDialogProps = {
  orgId: string;
  orgName: string;
  member: OrganizationMember;
  myRole: OrganizationRole;
  currentUserId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoved: () => void;
};

export function RemoveMemberDialog({
  orgId,
  orgName,
  member,
  myRole,
  currentUserId,
  open,
  onOpenChange,
  onRemoved,
}: RemoveMemberDialogProps) {
  const [removing, setRemoving] = useState(false);
  const check = canRemoveMember(myRole, member, currentUserId);

  function handleClose() {
    if (removing) return;
    onOpenChange(false);
  }

  async function handleRemove() {
    if (removing || !check.allowed) return;
    setRemoving(true);
    try {
      await removeOrganizationMember(orgId, member.id);
      toast.success(`${member.name} removed from ${orgName}`);
      onOpenChange(false);
      onRemoved();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setRemoving(false);
    }
  }

  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={handleClose}
    >
      <div
        role="alertdialog"
        aria-labelledby="remove-member-title"
        aria-modal="true"
        className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="remove-member-title" className="text-lg font-semibold text-foreground">
              Remove member?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <strong className="text-foreground">{member.name}</strong> will lose
              access to {orgName}. Their learning progress in this org will no longer
              be visible to the team.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={removing}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!check.allowed && check.reason ? (
          <p className="mb-4 text-sm text-destructive">{check.reason}</p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleClose} disabled={removing}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={removing || !check.allowed}
            onClick={() => void handleRemove()}
          >
            {removing ? "Removing…" : "Remove from organization"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
