"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  sendOrganizationInviteApi,
  validateInviteEmail,
} from "@/lib/organization-invite-service";

type InviteMemberDialogProps = {
  orgId: string;
  orgName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSent?: () => void;
};

export function InviteMemberDialog({
  orgId,
  orgName,
  open,
  onOpenChange,
  onSent,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setTeamRole("");
      setSending(false);
    }
  }, [open]);

  function handleClose() {
    if (sending) return;
    onOpenChange(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;

    if (!validateInviteEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setSending(true);
    const result = await sendOrganizationInviteApi(orgId, email, teamRole);
    setSending(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Invitation sent", {
      description: `${email.trim()} will receive an email to join ${orgName}.`,
    });
    onOpenChange(false);
    onSent?.();
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
        role="dialog"
        aria-labelledby="invite-member-title"
        aria-modal="true"
        className="w-full max-w-md overflow-visible rounded-lg border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="invite-member-title"
              className="text-lg font-semibold text-foreground"
            >
              Invite member
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Send an invitation to join{" "}
              <strong className="text-foreground">{orgName}</strong>. They&apos;ll
              receive an email with a link to accept.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={sending}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              autoComplete="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
              className="h-10 bg-card"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-team-role">Team role (optional)</Label>
            <Input
              id="invite-team-role"
              placeholder="e.g. Frontend Engineer"
              value={teamRole}
              onChange={(e) => setTeamRole(e.target.value)}
              disabled={sending}
              className="h-10 bg-card"
            />
            <p className="text-xs text-muted-foreground">
              Job title shown to the invitee — separate from admin/member access
              after they join.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sending || !email.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending…" : "Send invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
