"use client";

import Link from "next/link";
import { Pencil, MapPin } from "lucide-react";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";

export default function ProfileHeader() {
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-5 sm:gap-6 md:flex-row md:items-start lg:gap-8">
      <div className="flex flex-col items-center gap-5 sm:gap-6 md:flex-row md:items-start lg:gap-8">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-[20px] border-4 border-white bg-slate-200 shadow-xl sm:h-28 sm:w-28 lg:h-32 lg:w-32 lg:rounded-[24px]">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="h-full w-full object-cover"
            />
          </div>
          <Link
            href="/dashboard/settings"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg hover:bg-blue-700 sm:h-8 sm:w-8"
          >
            <Pencil size={12} className="sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>

        <div className="space-y-1 text-center md:text-left md:pt-1 lg:pt-2">
          <h1 className="wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {profile.fullName}
          </h1>
          <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 sm:text-base lg:text-lg md:justify-start">
            <MapPin size={15} className="text-slate-400" />
            {profile.role} • {profile.location}
          </p>
        </div>
      </div>

      <div className="mt-1 w-full md:mt-0 md:w-auto md:shrink-0">
        <Link
          href="/dashboard/settings"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-[#1d59db] hover:bg-[#1d59db]/5 hover:text-[#1d59db] sm:w-auto sm:px-5"
        >
          <Pencil size={16} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
