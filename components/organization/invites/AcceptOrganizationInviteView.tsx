"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Check,
  Mail,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAcceptOrganizationInvite } from "@/hooks/useAcceptOrganizationInvite";
import { getApiErrorMessage } from "@/lib/auth-api";
import { parseInvitePreviewOutApi } from "@/lib/organization-invite-parsers";
import {
  declineOrganizationInvite,
  previewOrganizationInvite,
} from "@/lib/organizations-api";
import type { InvitePreviewOutApi } from "@/types/organization-api";

export function AcceptOrganizationInviteView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const { accept, accepting } = useAcceptOrganizationInvite();

  const [token, setToken] = useState(tokenFromUrl);
  const [preview, setPreview] = useState<InvitePreviewOutApi | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [declining, setDeclining] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  useEffect(() => {
    const trimmed = token.trim();
    if (!trimmed) {
      setPreview(null);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);

    void previewOrganizationInvite(trimmed)
      .then((data) => {
        if (!cancelled) {
          setPreview(parseInvitePreviewOutApi(data));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreview(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleAccept() {
    const trimmed = token.trim();
    if (!trimmed) {
      toast.error("Paste your invite token from the email link.");
      return;
    }

    try {
      const orgId = await accept(trimmed);
      toast.success("You joined the organization.");
      router.push(`/dashboard/organization/${orgId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not accept invite.");
    }
  }

  async function handleDecline() {
    const trimmed = token.trim();
    if (!trimmed) return;

    setDeclining(true);
    try {
      await declineOrganizationInvite({ token: trimmed });
      toast.success("Invitation declined.");
      router.push("/dashboard/organization/invites");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeclining(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/dashboard/organization"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Your organizations
      </Link>

      <header className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Mail className="h-5 w-5" />
          <span className="text-label">Invitation</span>
        </div>
        <h1 className="text-h1 text-foreground">Accept invitation</h1>
        <p className="text-body text-muted-foreground">
          Open the invite link from your email, or paste the token below. You must
          be signed in with the invited email address.
        </p>
      </header>

      {preview && !previewLoading ? (
        <div className="vs-surface mb-6 space-y-3 rounded-md border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
              {preview.organization_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.organization_logo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="font-semibold text-foreground">
                {preview.organization_name}
              </p>
              {preview.organization_industry ? (
                <p className="text-xs text-muted-foreground">
                  {preview.organization_industry}
                </p>
              ) : null}
              {preview.team_role ? (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Briefcase className="h-3 w-3" />
                  {preview.team_role}
                </p>
              ) : null}
              {preview.inviter_name ? (
                <p className="text-xs text-muted-foreground">
                  Invited by {preview.inviter_name}
                </p>
              ) : null}
            </div>
          </div>
          {preview.organization_description ? (
            <p className="text-sm text-muted-foreground">
              {preview.organization_description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="vs-surface space-y-4 rounded-md p-6">
        <div className="space-y-2">
          <Label htmlFor="invite-token">Invite token</Label>
          <Input
            id="invite-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token from your invitation email"
            disabled={accepting || declining}
            className="h-10"
          />
          {previewLoading ? (
            <p className="text-xs text-muted-foreground">Loading preview…</p>
          ) : null}
          {preview && !preview.is_valid ? (
            <p className="text-xs text-destructive">
              This invitation is no longer valid.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="flex-1 gap-2"
            disabled={
              accepting ||
              declining ||
              !token.trim() ||
              Boolean(preview && !preview.is_valid)
            }
            onClick={() => void handleAccept()}
          >
            <Check className="h-4 w-4" />
            {accepting ? "Joining…" : "Accept and join"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            disabled={accepting || declining || !token.trim()}
            onClick={() => void handleDecline()}
          >
            <X className="h-4 w-4" />
            {declining ? "Declining…" : "Decline"}
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link
          href="/dashboard/organization/invites"
          className="font-semibold text-primary hover:underline"
        >
          Back to pending invites
        </Link>
      </p>
    </div>
  );
}
