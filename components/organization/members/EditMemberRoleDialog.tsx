"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import {
  updateMemberAccessRole,
  updateMemberJobTitle,
} from "@/lib/organization-members-storage";
import { TEAM_ROLE_OPTIONS } from "@/lib/organization-team-roles";
import {
  accessRoleOptionsFor,
  canEditMemberAccessRole,
  canEditMemberTeamRole,
} from "@/lib/organization-member-service";
import { formatMemberRole } from "@/lib/organization-members-data";
import type { OrganizationMember } from "@/types/organization-profile";
import type { OrganizationRole } from "@/types/organization";

type EditMemberRoleDialogProps = {
  orgId: string;
  member: OrganizationMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export function EditMemberRoleDialog({
  orgId,
  member,
  open,
  onOpenChange,
  onSaved,
}: EditMemberRoleDialogProps) {
  const [teamRole, setTeamRole] = useState(member.jobTitle);
  const [accessRole, setAccessRole] = useState<OrganizationRole>(member.role);
  const [saving, setSaving] = useState(false);

  const canEditTeam = canEditMemberTeamRole(orgId, member.id);
  const canEditAccess = canEditMemberAccessRole(orgId, member.id);

  useEffect(() => {
    if (open) {
      setTeamRole(member.jobTitle);
      setAccessRole(member.role);
      setSaving(false);
    }
  }, [open, member.jobTitle, member.role]);

  function handleClose() {
    if (saving) return;
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    if (!canEditTeam.allowed && !canEditAccess.allowed) {
      toast.error(canEditTeam.reason ?? canEditAccess.reason);
      return;
    }

    setSaving(true);

    if (canEditTeam.allowed) {
      const updated = updateMemberJobTitle(orgId, member.id, teamRole);
      if (!updated) {
        setSaving(false);
        toast.error("Could not update team role.");
        return;
      }
    }

    if (canEditAccess.allowed && accessRole !== member.role) {
      const updated = updateMemberAccessRole(orgId, member.id, accessRole);
      if (!updated) {
        setSaving(false);
        toast.error("Could not update access level.");
        return;
      }
    }

    setSaving(false);
    toast.success("Member updated", {
      description: `${member.name}'s roles have been saved.`,
    });
    onOpenChange(false);
    onSaved();
  }

  if (!open || typeof window === "undefined") {
    return null;
  }

  const accessOptions = accessRoleOptionsFor(member)
    .filter((r) => r !== "owner")
    .map((r) => ({
      value: r,
      label:
        r === "admin"
          ? "Admin — manage members & profile"
          : "Member — participate in roadmaps",
    }));

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-labelledby="edit-member-title"
        aria-modal="true"
        className="w-full max-w-md overflow-visible rounded-lg border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="edit-member-title" className="text-lg font-semibold text-foreground">
              Edit roles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update {member.name}&apos;s team role
              {canEditAccess.allowed ? " and organization access" : ""}.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {canEditTeam.allowed ? (
            <SelectField
              id="edit-team-role"
              label="Team role"
              value={teamRole}
              onChange={setTeamRole}
              options={TEAM_ROLE_OPTIONS.map((r) => ({ value: r, label: r }))}
              disabled={saving}
              listClassName="max-h-52"
            />
          ) : (
            <p className="text-xs text-muted-foreground">{canEditTeam.reason}</p>
          )}

          {canEditAccess.allowed ? (
            <SelectField
              id="edit-access-role"
              label="Organization access"
              value={accessRole}
              onChange={(v) => setAccessRole(v as OrganizationRole)}
              options={accessOptions}
              disabled={saving}
            />
          ) : (
            <div className="space-y-1">
              <p className="text-label text-muted-foreground">Organization access</p>
              <p className="text-sm font-medium text-foreground">
                {formatMemberRole(member.role)}
              </p>
              {canEditAccess.reason ? (
                <p className="text-xs text-muted-foreground">{canEditAccess.reason}</p>
              ) : null}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
