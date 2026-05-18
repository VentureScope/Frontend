"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import {
  sendOrganizationInvite,
  validateInviteEmail,
} from "@/lib/organization-invite-service";
import {
  getTeamRoleSelectOptions,
  TEAM_ROLE_OPTIONS,
} from "@/lib/organization-team-roles";
import type { OrganizationAccessRole } from "@/types/organization-invite";
import { useAppStore } from "@/store/useAppStore";

const ACCESS_ROLE_OPTIONS = [
  { value: "member", label: "Member — participate in roadmaps" },
  { value: "admin", label: "Admin — manage members & profile" },
] as const;

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
  const authUser = useAppStore((s) => s.authData.user);
  const [email, setEmail] = useState("");
  const [teamRole, setTeamRole] = useState<string>(TEAM_ROLE_OPTIONS[0]);
  const [accessRole, setAccessRole] =
    useState<OrganizationAccessRole>("member");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setTeamRole(TEAM_ROLE_OPTIONS[0]);
      setAccessRole("member");
      setSending(false);
    }
  }, [open]);

  function handleClose() {
    if (sending) return;
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;

    if (!validateInviteEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setSending(true);
    const result = sendOrganizationInvite({
      orgId,
      inviteeEmail: email,
      teamRole,
      accessRole,
      invitedBy: authUser?.full_name ?? "Organization admin",
      invitedByEmail: authUser?.email ?? "admin@venturescope.dev",
    });
    setSending(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Invitation sent", {
      description: `${email.trim()} was invited as ${teamRole}.`,
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
              receive it at the email you enter.
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <SelectField
            id="invite-team-role"
            label="Team role"
            value={teamRole}
            onChange={setTeamRole}
            options={getTeamRoleSelectOptions()}
            disabled={sending}
            hint="The role they'll have on the team (e.g. Frontend Engineer)."
            listClassName="max-h-52"
          />

          <SelectField
            id="invite-access"
            label="Organization access"
            value={accessRole}
            onChange={(v) => setAccessRole(v as OrganizationAccessRole)}
            options={[...ACCESS_ROLE_OPTIONS]}
            disabled={sending}
          />

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
