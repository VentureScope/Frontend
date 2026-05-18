"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Globe,
  MapPin,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InviteAssignmentSummary } from "@/components/organization/invites/InviteAssignmentSummary";
import type { OrganizationInvite } from "@/types/organization-invite";
import {
  getPendingInviteById,
  removePendingInvite,
} from "@/lib/organization-invites-storage";

function formatInviteDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatCount(value: number): string {
  return value.toLocaleString();
}

export function PendingInviteDetailView({ inviteId }: { inviteId: string }) {
  const router = useRouter();
  const [invite, setInvite] = useState<OrganizationInvite | null>(null);
  const [ready, setReady] = useState(false);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    setInvite(getPendingInviteById(inviteId));
    setReady(true);
  }, [inviteId]);

  function handleAccept() {
    if (!invite || acting) return;
    setActing(true);
    removePendingInvite(invite.id);
    toast.success(`You joined ${invite.organizationName} as ${invite.teamRole}`);
    router.push("/dashboard/organization");
  }

  function handleDecline() {
    if (!invite || acting) return;
    setActing(true);
    removePendingInvite(invite.id);
    toast("Invitation declined", { description: invite.organizationName });
    router.push("/dashboard/organization/invites");
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading invitation…</p>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/organization/invites"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Pending invites
        </Link>
        <div className="vs-surface rounded-md border border-dashed border-border px-6 py-12 text-center">
          <p className="font-medium text-foreground">Invitation not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            It may have already been accepted or declined.
          </p>
          <Button type="button" variant="outline" className="mt-6" asChild>
            <Link href="/dashboard/organization/invites">All pending invites</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/dashboard/organization/invites"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Pending invites
      </Link>

      <header className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-lg font-bold text-primary">
              {invite.organizationName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-2">
              <span className="vs-badge-accent text-[10px] font-semibold uppercase tracking-wide">
                Pending invitation
              </span>
              <h1 className="text-h1 text-foreground">{invite.organizationName}</h1>
              <p className="text-body text-muted-foreground">{invite.tagline}</p>
            </div>
          </div>
          <span className="vs-badge-accent inline-flex w-fit self-start text-[10px] font-semibold uppercase tracking-wide">
            {invite.teamRole}
          </span>
        </div>
      </header>

      <section className="vs-surface mb-8 rounded-md p-6">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Your assignment
        </h2>
        <InviteAssignmentSummary invite={invite} variant="full" />
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="vs-surface rounded-md p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Members
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {formatCount(invite.memberCount)}
          </p>
        </div>
        <div className="vs-surface rounded-md p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Active projects
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {formatCount(invite.activeProjects)}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            About this organization
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {invite.description}
          </p>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-label text-muted-foreground">Industry</dt>
              <dd className="mt-0.5 font-medium text-foreground">{invite.industry}</dd>
            </div>
            <div>
              <dt className="text-label text-muted-foreground">Location</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {invite.location}
              </dd>
            </div>
            {invite.website ? (
              <div className="sm:col-span-2">
                <dt className="text-label text-muted-foreground">Website</dt>
                <dd className="mt-0.5">
                  <a
                    href={invite.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {invite.website.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="vs-surface space-y-3 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">Core services</h2>
          <ul className="flex flex-wrap gap-2">
            {invite.coreServices.map((service) => (
              <li
                key={service}
                className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground"
              >
                {service}
              </li>
            ))}
          </ul>
        </section>

        <section className="vs-surface space-y-4 rounded-md p-6">
          <h2 className="text-sm font-semibold text-foreground">Invitation details</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 text-muted-foreground">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Invited by{" "}
                <span className="font-medium text-foreground">{invite.invitedBy}</span>
                <span className="block text-xs">{invite.invitedByEmail}</span>
              </span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-primary" />
              <span>Sent {formatInviteDate(invite.sentAt)}</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="sticky bottom-0 mt-10 flex flex-col-reverse gap-3 border-t border-border bg-background/95 py-6 backdrop-blur-sm sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 font-semibold"
          disabled={acting}
          onClick={handleDecline}
        >
          Decline invitation
        </Button>
        <Button
          type="button"
          size="lg"
          className="h-11 font-semibold"
          disabled={acting}
          onClick={handleAccept}
        >
          Accept & join organization
        </Button>
      </div>
    </div>
  );
}
