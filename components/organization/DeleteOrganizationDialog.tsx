"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/auth-api";
import { deleteOrganization } from "@/lib/organizations-api";

type DeleteOrganizationDialogProps = {
  orgId: string;
  orgName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteOrganizationDialog({
  orgId,
  orgName,
  open,
  onOpenChange,
}: DeleteOrganizationDialogProps) {
  const router = useRouter();
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const nameMatches =
    confirmName.trim().toLowerCase() === orgName.trim().toLowerCase();

  function handleClose() {
    if (deleting) return;
    setConfirmName("");
    onOpenChange(false);
  }

  async function handleDelete() {
    if (deleting || !nameMatches) return;
    setDeleting(true);
    try {
      await deleteOrganization(orgId);
      toast.success(`${orgName} was deleted`);
      onOpenChange(false);
      router.push("/dashboard/organization");
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
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
        aria-labelledby="delete-org-title"
        aria-modal="true"
        className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="delete-org-title"
              className="text-lg font-semibold text-foreground"
            >
              Delete organization?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This permanently removes <strong className="text-foreground">{orgName}</strong>,
              including members, invites, roadmaps, and advisor sessions. This
              cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <label
            htmlFor="delete-org-confirm"
            className="text-sm text-muted-foreground"
          >
            Type <span className="font-semibold text-foreground">{orgName}</span> to
            confirm
          </label>
          <Input
            id="delete-org-confirm"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={orgName}
            disabled={deleting}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleting || !nameMatches}
            onClick={() => void handleDelete()}
          >
            {deleting ? "Deleting…" : "Delete organization"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
