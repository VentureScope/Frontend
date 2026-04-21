"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage, updateCurrentUserProfile } from "@/lib/auth-api";
import { getUserProfileView } from "@/lib/user-profile";
import { useAppStore } from "@/store/useAppStore";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function CareerInterests() {
  const authData = useAppStore((state) => state.authData);
  const setAuthData = useAppStore((state) => state.setAuthData);
  const user = useAppStore((state) => state.authData.user);
  const profile = getUserProfileView(user);

  const [tags, setTags] = useState<string[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const value = user?.career_interest;
    if (typeof value !== "string" || value.trim().length === 0) {
      setTags([]);
      return;
    }

    const parsed = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setTags(Array.from(new Set(parsed)));
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

      setAuthData({
        ...authData,
        user: updatedUser,
      });
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

    const next = [...tags, normalized];
    setTags(next);
    setNewTag("");
    setIsAdding(false);

    try {
      await persistInterests(next);
      toast.success("Career interests updated.");
    } catch {
      setTags(tags);
    }
  };

  const removeTag = async (tagToRemove: string) => {
    const next = tags.filter((tag) => tag !== tagToRemove);
    setTags(next);

    try {
      await persistInterests(next);
      toast.success("Career interests updated.");
    } catch {
      setTags(tags);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:space-y-6 sm:p-6 lg:p-8">
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
          Career Interests
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Your interests are synced from your profile and shape personalized
          role recommendations for {profile.firstName}.
        </p>

        <div className="flex flex-wrap gap-3">
          {tags.length === 0 && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
              No interests added yet
            </span>
          )}

          {tags.map((t) => (
            <span
              key={t}
              className="group flex max-w-full items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-xs font-bold text-blue-600 shadow-sm transition-all hover:border-blue-200"
            >
              <span className="max-w-50 text-left wrap-break-word sm:max-w-60">
                {t}
              </span>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => removeTag(t)}
                className="text-slate-300 hover:text-rose-500"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {isAdding ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <input
                autoFocus
                className="w-full rounded-full border border-blue-200 px-4 py-2 text-xs font-medium outline-none ring-2 ring-blue-50 sm:w-auto"
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
                onClick={() => {
                  void addTag();
                }}
                className="rounded-full bg-blue-600 px-3 py-2 text-[11px] font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-slate-50/50 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <Plus size={14} />
              Add Interest
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-blue-100 bg-[#eff6ff] p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
          Interest Insight
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">{helperText}</p>
      </div>
    </div>
  );
}
