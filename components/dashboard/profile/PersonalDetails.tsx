"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { getUserProfileView } from "@/lib/user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthUser } from "@/types/auth";

type PersonalDetailsProps = {
  user: AuthUser | null;
  loading?: boolean;
};

export default function PersonalDetails({
  user,
  loading = false,
}: PersonalDetailsProps) {
  const profile = getUserProfileView(user);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-5 flex items-center justify-between sm:mb-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2 text-primary">
          <UserCircle size={18} />
          <span className="text-label">Personal Details</span>
        </div>
        <Button
          variant="link"
          className="h-auto p-0 text-xs font-bold text-primary"
          asChild
        >
          <Link href="/dashboard/settings">Edit</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-label text-muted-foreground">Email Address</p>
          <p className="break-all text-sm font-medium text-foreground">
            {profile.email}
          </p>
        </div>
        <div>
          <p className="text-label text-muted-foreground">Timezone</p>
          <p className="wrap-break-word text-sm font-medium text-foreground">
            {profile.timezone}
          </p>
        </div>
      </div>
    </div>
  );
}
