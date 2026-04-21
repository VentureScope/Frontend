"use client";

// components/dashboard/WelcomeHeader.tsx
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function WelcomeHeader() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  return (
    <div className="flex flex-col h-full justify-center gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
          Welcome back, {profile.firstName}
        </h1>
        <p className="max-w-md text-base sm:text-lg leading-relaxed text-slate-500">
          You are currently focused on {profile.careerInterest}. We are tracking
          opportunities aligned with your {profile.role.toLowerCase()} journey.
        </p>
      </div>

      {/* Readiness Score Badge */}
      <div className="flex h-24 w-24 sm:h-32 sm:w-32 flex-col items-center justify-center rounded-3xl sm:rounded-[32px] bg-blue-50 text-center mt-2 sm:mt-0">
        <span className="text-4xl sm:text-5xl font-bold text-blue-600">84</span>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-blue-400">
          Readiness Score
        </span>
      </div>
    </div>
  );
}
