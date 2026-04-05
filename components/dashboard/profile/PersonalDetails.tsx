// components/dashboard/profile/PersonalDetails.tsx
"use client";

import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function PersonalDetails() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <UserCircle size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Personal Details
          </span>
        </div>
        <Button
          variant="link"
          className="h-auto p-0 text-xs font-bold text-blue-600"
        >
          Edit
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Email Address
          </p>
          <p className="text-sm font-medium text-slate-900">{profile.email}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Timezone
          </p>
          <p className="text-sm font-medium text-slate-900">
            {profile.timezone}
          </p>
        </div>
      </div>
    </div>
  );
}
