"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Pencil, MapPin, Camera, Trash2, Loader2 } from "lucide-react";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";
import { uploadProfilePicture, deleteProfilePicture } from "@/lib/auth-api";
import { toast } from "sonner";

export default function ProfileHeader() {
  const { authData, setAuthData } = useAppStore();
  const user = authData.user;
  const profile = getUserProfileView(user);

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Allowed types: JPG, PNG, WEBP");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadProfilePicture(file);
      
      if (user) {
        setAuthData({
          ...authData,
          user: {
            ...user,
            profile_picture_url: res.profile_picture_url,
          },
        });
      }
      toast.success(res.message || "Profile picture uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePicture = async () => {
    try {
      setIsDeleting(true);
      await deleteProfilePicture();
      if (user) {
        setAuthData({
          ...authData,
          user: {
            ...user,
            profile_picture_url: null,
          },
        });
      }
      toast.success("Profile picture removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove profile picture");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasCustomPicture = !!user?.profile_picture_url;

  return (
    <div className="flex w-full flex-col items-center justify-between gap-5 sm:gap-6 md:flex-row md:items-start lg:gap-8">
      <div className="flex flex-col items-center gap-5 sm:gap-6 md:flex-row md:items-start lg:gap-8">
        <div className="group relative">
          <div className="relative h-24 w-24 overflow-hidden rounded-[20px] border-4 border-white bg-slate-200 shadow-xl sm:h-28 sm:w-28 lg:h-32 lg:w-32 lg:rounded-[24px]">
            {isUploading ? (
              <div className="flex h-full w-full items-center justify-center bg-slate-100">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            )}
            
            {/* Overlay for uploading */}
            {!isUploading && (
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 text-white">
                <Camera className="mb-1 h-6 w-6" />
                <span className="text-xs font-medium">Change</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={isUploading || isDeleting}
                />
              </label>
            )}
          </div>

          {/* Delete Button - Show only if they have a custom picture */}
          {hasCustomPicture && !isUploading && (
             <button
                onClick={handleDeletePicture}
                disabled={isDeleting}
                className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-white shadow-lg transition hover:bg-rose-600 disabled:opacity-50"
                title="Remove profile picture"
             >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
             </button>
          )}

          <Link
            href="/dashboard/settings"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg hover:bg-blue-700 sm:h-8 sm:w-8"
          >
            <Pencil size={12} className="sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>

        <div className="min-w-0 space-y-1 text-center md:pt-1 md:text-left lg:pt-2">
          <h1 className="wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {profile.fullName}
          </h1>
          <div className="flex flex-col items-center gap-1 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2 sm:text-base md:justify-start lg:text-lg">
            <span className="inline-flex max-w-full items-center gap-1.5">
              <MapPin size={15} className="shrink-0 text-slate-400" />
              <span className="wrap-break-word">{profile.location}</span>
            </span>
            <span className="hidden text-slate-300 sm:inline">•</span>
            <span className="wrap-break-word">{profile.role}</span>
          </div>
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
