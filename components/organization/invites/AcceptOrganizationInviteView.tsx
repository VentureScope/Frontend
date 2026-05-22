"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAcceptOrganizationInvite } from "@/hooks/useAcceptOrganizationInvite";

export function AcceptOrganizationInviteView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const { accept, accepting } = useAcceptOrganizationInvite();

  const [token, setToken] = useState(tokenFromUrl);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

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
          Open the invite link from your email, or paste the token from that link
          below. You must be signed in with the invited email address.
        </p>
      </header>

      <div className="vs-surface space-y-4 rounded-md p-6">
        <div className="space-y-2">
          <Label htmlFor="invite-token">Invite token</Label>
          <Input
            id="invite-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token from your invitation email"
            disabled={accepting}
            className="h-10"
          />
        </div>
        <Button
          type="button"
          className="w-full gap-2"
          disabled={accepting || !token.trim()}
          onClick={() => void handleAccept()}
        >
          <Check className="h-4 w-4" />
          {accepting ? "Joining…" : "Accept and join organization"}
        </Button>
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
