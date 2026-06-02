"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, MapPin, Camera, Trash2, Loader2 } from "lucide-react";
import { getUserProfileView } from "@/lib/user-profile";
import { uploadProfilePicture, deleteProfilePicture } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthUser } from "@/types/auth";
import { toast } from "sonner";

type ProfileHeaderProps = {
  user: AuthUser | null;
  loading?: boolean;
  onProfileUpdated?: (user: AuthUser) => void;
};

export default function ProfileHeader({
  user,
  loading = false,
  onProfileUpdated,
}: ProfileHeaderProps) {
  const queryClient = useQueryClient();
  const profile = getUserProfileView(user);

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

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
      const updatedUser = {
        ...user,
        profile_picture_url: res.profile_picture_url,
      };

      onProfileUpdated?.(updatedUser);
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
      toast.success(res.message || "Profile picture uploaded successfully");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload profile picture",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePicture = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);
      await deleteProfilePicture();
      const updatedUser = {
        ...user,
        profile_picture_url: null,
      };

      onProfileUpdated?.(updatedUser);
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
      toast.success("Profile picture removed");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove profile picture",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const hasCustomPicture = !!user?.profile_picture_url;

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center justify-between gap-5 sm:gap-6 md:flex-row md:items-start lg:gap-8">
        <div className="flex flex-col items-center gap-5 sm:gap-6 md:flex-row md:items-start lg:gap-8">
          <Skeleton className="h-24 w-24 rounded-[20px] sm:h-28 sm:w-28 lg:h-32 lg:w-32 lg:rounded-[24px]" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 sm:w-56" />
            <Skeleton className="h-5 w-64 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-11 w-full rounded-xl sm:w-36" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-between gap-5 sm:gap-6 md:flex-row md:items-start lg:gap-8">
      <div className="flex flex-col items-center gap-5 sm:gap-6 md:flex-row md:items-start lg:gap-8">
        <div className="group relative">
          <div className="relative h-24 w-24 overflow-hidden rounded-[20px] border-4 border-background bg-muted shadow-xl sm:h-28 sm:w-28 lg:h-32 lg:w-32 lg:rounded-[24px]">
            {isUploading ? (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            )}

            {!isUploading && (
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
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

          {hasCustomPicture && !isUploading && (
            <button
              onClick={handleDeletePicture}
              disabled={isDeleting}
              className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-destructive text-destructive-foreground shadow-lg transition hover:bg-destructive/90 disabled:opacity-50"
              title="Remove profile picture"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          )}

          <Link
            href="/dashboard/settings"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 sm:h-8 sm:w-8"
          >
            <Pencil size={12} className="sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>

        <div className="min-w-0 space-y-1 text-center md:pt-1 md:text-left lg:pt-2">
          <h1 className="text-h1 wrap-break-word text-foreground">
            {profile.fullName}
          </h1>
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2 sm:text-base md:justify-start lg:text-lg">
            <span className="inline-flex max-w-full items-center gap-1.5">
              <MapPin size={15} className="shrink-0 text-muted-foreground" />
              <span className="wrap-break-word">{profile.location}</span>
            </span>
            <span className="hidden text-muted-foreground/50 sm:inline">•</span>
            <span className="wrap-break-word">{profile.role}</span>
          </div>
        </div>
      </div>

      <div className="mt-1 w-full md:mt-0 md:w-auto md:shrink-0">
        <Link
          href="/dashboard/settings"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-muted-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary sm:w-auto sm:px-5"
        >
          <Pencil size={16} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
