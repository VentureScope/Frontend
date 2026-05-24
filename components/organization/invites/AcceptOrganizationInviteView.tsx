"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Mail,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { OrganizationPageHeader } from "@/components/organization/OrganizationPageHeader";
import { Button } from "@/components/ui/button";
import { useAcceptOrganizationInvite } from "@/hooks/useAcceptOrganizationInvite";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  buildInviteDisplay,
  formatInviteExpiry,
  type InviteDisplayData,
} from "@/lib/organization-invite-display";
import { parseInvitePreviewOutApi } from "@/lib/organization-invite-parsers";
import { decodeInviteToken } from "@/lib/organization-invite-token";
import {
  declineOrganizationInvite,
  previewOrganizationInvite,
} from "@/lib/organizations-api";
import type { InvitePreviewOutApi } from "@/types/organization-api";
import { cn } from "@/lib/utils";

function InviteDetailsPanel({
  invite,
  loading,
  hasToken,
}: {
  invite: InviteDisplayData | null;
  loading: boolean;
  hasToken: boolean;
}) {
  if (!hasToken) {
    return (
      <div className="flex min-h-[320px] flex-col justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
          <Mail className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="mt-5 text-center text-lg font-semibold text-foreground">
          Open your invitation email
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          Use the button in the message we sent you. It opens this page with
          your invitation already loaded — no copy-paste needed.
        </p>
      </div>
    );
  }

  if (loading && !invite?.organizationName) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-border bg-muted/30 p-8 text-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading invitation…
        </p>
      </div>
    );
  }

  if (!invite?.organizationName) {
    return (
      <div className="flex min-h-[320px] flex-col justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm font-medium text-destructive">
          This invitation link could not be read
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The link may be expired or invalid. Ask the organization owner to
          send a new invite, or check pending invites if you&apos;re already
          signed in.
        </p>
      </div>
    );
  }

  const expiryLabel = formatInviteExpiry(invite.expiresAt);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        invite.isValid ? "border-border" : "border-destructive/40",
      )}
    >
      <div className="border-b border-border bg-muted/30 px-6 py-6 sm:px-8">
        <p className="text-label text-primary">You&apos;re invited to join</p>
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
            {invite.organizationLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invite.organizationLogo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="text-2xl font-semibold text-foreground">
              {invite.organizationName}
            </h2>
            {invite.organizationIndustry ? (
              <p className="text-sm text-muted-foreground">
                {invite.organizationIndustry}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-8">
        {invite.organizationDescription ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              About the organization
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {invite.organizationDescription}
            </p>
          </div>
        ) : null}

        <dl className="grid gap-3 sm:grid-cols-2">
          {invite.teamRole ? (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                Your team role
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {invite.teamRole}
              </dd>
            </div>
          ) : null}
          {invite.inviterName ? (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Invited by
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {invite.inviterName}
              </dd>
            </div>
          ) : null}
          {invite.inviteeEmail ? (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 sm:col-span-2">
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                Invited email
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {invite.inviteeEmail}
              </dd>
            </div>
          ) : null}
          {expiryLabel ? (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 sm:col-span-2">
              <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Invitation expires
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {expiryLabel}
              </dd>
            </div>
          ) : null}
        </dl>

        {!invite.isValid ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            This invitation is no longer valid. Request a new invite from the
            organization owner.
          </p>
        ) : (
          <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
            Accepting adds you to{" "}
            <span className="font-medium text-foreground">
              {invite.organizationName}
            </span>
            {invite.teamRole ? (
              <>
                {" "}
                as <span className="font-medium text-foreground">{invite.teamRole}</span>
              </>
            ) : null}
            . You must be signed in with the email that received this invite.
          </p>
        )}
      </div>
    </div>
  );
}

export function AcceptOrganizationInviteView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = (searchParams.get("token") ?? "").trim();
  const { accept, accepting } = useAcceptOrganizationInvite();

  const decodedToken = useMemo(
    () => decodeInviteToken(inviteToken),
    [inviteToken],
  );

  const [preview, setPreview] = useState<InvitePreviewOutApi | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [declining, setDeclining] = useState(false);

  const invite = useMemo(
    () => buildInviteDisplay(decodedToken, preview),
    [decodedToken, preview],
  );

  const hasToken = Boolean(inviteToken);
  const canRespond =
    hasToken &&
    !accepting &&
    !declining &&
    invite?.isValid !== false &&
    Boolean(invite?.organizationName || invite?.organizationId);

  useEffect(() => {
    if (!inviteToken) {
      setPreview(null);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);

    void previewOrganizationInvite(inviteToken)
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
  }, [inviteToken]);

  async function handleAccept() {
    if (!inviteToken) {
      toast.error("Open the invitation link from your email.");
      return;
    }

    try {
      const orgId = await accept(inviteToken, {
        fallbackOrganizationId:
          invite?.organizationId ?? decodedToken?.organizationId,
      });
      toast.success("You joined the organization.");
      router.push(`/dashboard/organization/${orgId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not accept invite.");
    }
  }

  async function handleDecline() {
    if (!inviteToken) {
      return;
    }

    setDeclining(true);
    try {
      await declineOrganizationInvite({ token: inviteToken });
      toast.success("Invitation declined.");
      router.push("/dashboard/organization/invites");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeclining(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/organization/invites"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Pending invites
      </Link>

      <OrganizationPageHeader
        label="Organization"
        title="Review invitation"
        description="Your email link brought you here with everything needed to join. Review the details, then accept or decline."
        icon={Mail}
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <InviteDetailsPanel
            invite={invite}
            loading={previewLoading}
            hasToken={hasToken}
          />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">
              Ready to respond?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {hasToken
                ? "Accept to join the organization workspace, or decline if this invite wasn't meant for you."
                : "Open the link in your invitation email to load this page with your organization details."}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                size="lg"
                className="w-full gap-2"
                disabled={!canRespond}
                onClick={() => void handleAccept()}
              >
                <Check className="h-4 w-4" />
                {accepting ? "Joining…" : "Accept invitation"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full gap-2"
                disabled={!hasToken || accepting || declining}
                onClick={() => void handleDecline()}
              >
                <X className="h-4 w-4" />
                {declining ? "Declining…" : "Decline invitation"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <Link
              href="/dashboard/organization/invites"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              View all pending invites
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/dashboard/organization"
              className="hover:text-foreground hover:underline"
            >
              Your organizations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
