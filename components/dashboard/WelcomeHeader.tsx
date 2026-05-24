"use client";

import Link from "next/link";
import { WelcomeHeaderSkeleton } from "@/components/dashboard/DashboardSkeletons";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function WelcomeHeader({
  readinessScore,
  readinessLevel,
  loading,
}: {
  readinessScore: number;
  readinessLevel?: string | null;
  loading?: boolean;
}) {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  if (loading) {
    return <WelcomeHeaderSkeleton />;
  }

  return (
    <div className="flex h-full flex-col justify-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:flex-col lg:items-start">
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-h1 text-foreground">
          Welcome back, {profile.firstName}
        </h1>
        <p className="max-w-md text-body text-muted-foreground">
          You are currently focused on{" "}
          <Link
            href="/dashboard/profile"
            className="font-medium text-primary hover:underline"
          >
            {profile.careerInterest}
          </Link>
          . We are tracking opportunities aligned with your{" "}
          {profile.role.toLowerCase()} journey.
        </p>
      </div>

      <Link
        href="/dashboard/profile"
        className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-md border border-primary/25 bg-primary/8 text-center transition-colors hover:border-primary/40 sm:h-28 sm:w-28"
        title="View career readiness breakdown"
      >
        <span className="text-4xl font-semibold text-primary sm:text-5xl">
          {readinessScore > 0 ? readinessScore : "—"}
        </span>
        <span className="text-label mt-1 text-muted-foreground">
          {readinessLevel ?? "Readiness"}
        </span>
      </Link>
    </div>
  );
}
