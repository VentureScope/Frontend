"use client";

import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function WelcomeHeader() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  return (
    <div className="flex h-full flex-col justify-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:flex-col lg:items-start">
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-h1 text-foreground">
          Welcome back, {profile.firstName}
        </h1>
        <p className="max-w-md text-body text-muted-foreground">
          You are currently focused on {profile.careerInterest}. We are tracking
          opportunities aligned with your {profile.role.toLowerCase()} journey.
        </p>
      </div>

      <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-md border border-primary/25 bg-primary/8 text-center sm:h-28 sm:w-28">
        <span className="text-4xl font-semibold text-primary sm:text-5xl">84</span>
        <span className="text-label mt-1 text-muted-foreground">Readiness</span>
      </div>
    </div>
  );
}
