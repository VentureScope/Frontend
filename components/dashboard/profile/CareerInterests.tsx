"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiErrorMessage, updateCurrentUserProfile } from "@/lib/auth-api";
import { getUserProfileView } from "@/lib/user-profile";
import { Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthUser } from "@/types/auth";
import { toast } from "sonner";

type CareerInterestsProps = {
  user: AuthUser | null;
  loading?: boolean;
  onProfileUpdated?: (user: AuthUser) => void;
};

function parseInterestTags(value: string | null | undefined): string[] {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export default function CareerInterests({
  user,
  loading = false,
  onProfileUpdated,
}: CareerInterestsProps) {
  const profile = getUserProfileView(user);
  const [tags, setTags] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTags(parseInterestTags(user?.career_interest));
  }, [user?.career_interest]);

  const helperText = useMemo(() => {
    if (tags.length === 0) {
      return "Add your top interests so the advisor can personalize role and market recommendations.";
    }

    if (tags.length === 1) {
      return `Your current focus is ${tags[0]}. Add more interests to broaden recommendation quality.`;
    }

    return `You currently track ${tags.length} interest areas. Keep this curated as your goals evolve.`;
  }, [tags]);

  const persistInterests = async (nextTags: string[]) => {
    setIsSaving(true);
    try {
      const nextValue = nextTags.join(", ");
      const updatedUser = await updateCurrentUserProfile({
        career_interest: nextValue.length > 0 ? nextValue : null,
      });

      onProfileUpdated?.(updatedUser);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = async () => {
    const normalized = newTag.trim();
    if (!normalized) {
      return;
    }

    if (tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) {
      toast.info("That interest already exists.");
      return;
    }

    const previous = tags;
    const next = [...tags, normalized];
    setTags(next);
    setNewTag("");
    setIsAdding(false);

    try {
      await persistInterests(next);
      toast.success("Career interests updated.");
    } catch {
      setTags(previous);
    }
  };

  const removeTag = async (tagToRemove: string) => {
    const previous = tags;
    const next = tags.filter((tag) => tag !== tagToRemove);
    setTags(next);

    try {
      await persistInterests(next);
      toast.success("Career interests updated.");
    } catch {
      setTags(previous);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:space-y-6 sm:p-6 lg:p-8">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-16 w-full" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-24 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:space-y-6 sm:p-6 lg:p-8">
        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          Career Interests
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your interests are synced from your profile and shape personalized
          role recommendations for {profile.firstName}.
        </p>

        <div className="flex flex-wrap gap-3">
          {tags.length === 0 && (
            <span className="rounded-full border border-border bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">
              No interests added yet
            </span>
          )}

          {tags.map((t) => (
            <span
              key={t}
              className="group flex min-w-0 max-w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-primary shadow-sm transition-all hover:border-border"
            >
              <span className="max-w-40 text-left wrap-break-word sm:max-w-56">
                {t}
              </span>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void removeTag(t)}
                className="text-muted-foreground/50 hover:text-rose-500"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {isAdding ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <input
                autoFocus
                className="w-full rounded-full border border-border px-4 py-2 text-xs font-medium outline-none ring-2 ring-primary/20 sm:w-auto"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void addTag();
                  }
                }}
                placeholder="Type interest..."
              />
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void addTag()}
                className="rounded-lg bg-primary px-3 py-2 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsAdding(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full border border-dashed border-border bg-muted/50 px-4 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              <Plus size={14} />
              Add Interest
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-muted p-5 sm:p-6">
        <p className="text-label text-primary">Interest Insight</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {helperText}
        </p>
        {tags.length > 0 ? (
          <Link
            href="/dashboard/market-trends"
            className="inline-flex text-xs font-semibold text-primary hover:underline"
          >
            Explore market demand for your interests →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
