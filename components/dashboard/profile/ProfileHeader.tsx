"use client";

import Link from "next/link";
import { Pencil, MapPin } from "lucide-react";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function ProfileHeader() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  return (
    <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start w-full">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="relative">
          <div className="h-32 w-32 overflow-hidden rounded-[24px] border-4 border-white shadow-xl bg-slate-200">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="h-full w-full object-cover"
            />
          </div>
          <Link
            href="/dashboard/settings"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg border-2 border-white hover:bg-blue-700"
          >
            <Pencil size={14} />
          </Link>
        </div>

        <div className="space-y-1 text-center md:text-left pt-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {profile.fullName}
          </h1>
          <p className="flex items-center justify-center gap-2 text-lg text-slate-500 md:justify-start">
            <MapPin size={16} className="text-slate-400" />
            {profile.role} • {profile.location}
          </p>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex-shrink-0">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#1d59db] hover:bg-[#1d59db]/5 hover:text-[#1d59db] transition-all font-bold text-slate-600 shadow-sm"
        >
          <Pencil size={16} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
