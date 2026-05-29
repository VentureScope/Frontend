"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiErrorMessage, updateCurrentUserSkills } from "@/lib/auth-api";
import { GitHubRepositorySummary } from "@/types/github";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/useAppStore";
import {
  useGithubSyncedQuery,
  useInvalidateProfileQueries,
  useUserProfileQuery,
} from "@/hooks/queries/use-profile-queries";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

function deriveGithubLanguages(
  repositories: GitHubRepositorySummary[] | null | undefined,
): string[] {
  if (!repositories || repositories.length === 0) {
    return [];
  }

  const languageBytes = new Map<string, number>();
  const languageRepos = new Map<string, number>();

  for (const repo of repositories) {
    const repoLanguages = new Set<string>();

    if (repo.languages && repo.languages.length > 0) {
      for (const language of repo.languages) {
        if (!language.name) continue;
        repoLanguages.add(language.name);

        const currentBytes = languageBytes.get(language.name) ?? 0;
        const newBytes = currentBytes + (language.size || 1);
        languageBytes.set(language.name, newBytes);
      }
    } else if (repo.primary_language) {
      repoLanguages.add(repo.primary_language);
      const currentBytes = languageBytes.get(repo.primary_language) ?? 0;
      languageBytes.set(repo.primary_language, currentBytes + 1000);
    }

    for (const lang of repoLanguages) {
      languageRepos.set(lang, (languageRepos.get(lang) ?? 0) + 1);
    }
  }

  if (languageBytes.size === 0) {
    return [];
  }

  const sortedLangs = Array.from(languageBytes.keys()).sort((a, b) => {
    const bytesDiff = (languageBytes.get(b) ?? 0) - (languageBytes.get(a) ?? 0);
    if (bytesDiff !== 0) return bytesDiff;
    return (languageRepos.get(b) ?? 0) - (languageRepos.get(a) ?? 0);
  });

  return sortedLangs;
}

function normalizeUserSkills(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .filter((item): item is string => typeof item === "string")
          .map((skill) => skill.trim())
          .filter(Boolean),
      ),
    );
  }

  if (typeof value === "string") {
    return Array.from(
      new Set(
        value
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      ),
    );
  }

  return [];
}

export default function SkillIntelligence() {
  const authUser = useAppStore((state) => state.authData.user);
  const setAuthData = useAppStore((state) => state.setAuthData);
  const githubQuery = useGithubSyncedQuery();
  const profileQuery = useUserProfileQuery();
  const { invalidateProfile } = useInvalidateProfileQueries();

  const [savedUserSkills, setSavedUserSkills] = useState<string[]>([]);
  const [draftUserSkills, setDraftUserSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  const [skillsInitialized, setSkillsInitialized] = useState(false);

  const loading = githubQuery.isPending || profileQuery.isPending;
  const githubData = githubQuery.data;

  useEffect(() => {
    if (skillsInitialized || loading) return;

    const userProfile = profileQuery.data;
    if (userProfile) {
      const normalized = normalizeUserSkills(userProfile.skills);
      setSavedUserSkills(normalized);
      setDraftUserSkills(normalized);
      setAuthData({
        ...useAppStore.getState().authData,
        user: userProfile,
      });
    } else {
      const fromStore = normalizeUserSkills(authUser?.skills);
      setSavedUserSkills(fromStore);
      setDraftUserSkills(fromStore);
    }
    setSkillsInitialized(true);
  }, [
    loading,
    profileQuery.data,
    authUser?.skills,
    skillsInitialized,
    setAuthData,
  ]);

  const githubLanguages = useMemo(
    () => deriveGithubLanguages(githubData?.repositories),
    [githubData?.repositories],
  );

  const hasUnsavedSkillChanges = useMemo(() => {
    if (savedUserSkills.length !== draftUserSkills.length) {
      return true;
    }

    return savedUserSkills.some(
      (skill, index) => skill !== draftUserSkills[index],
    );
  }, [savedUserSkills, draftUserSkills]);

  const saveSkills = async (nextSkills: string[]) => {
    setIsSavingSkills(true);
    try {
      await updateCurrentUserSkills({ skills: nextSkills });
      await invalidateProfile();
      const { data: refreshedProfile } = await profileQuery.refetch();

      if (refreshedProfile) {
        const normalized = normalizeUserSkills(refreshedProfile.skills);
        setAuthData({
          ...useAppStore.getState().authData,
          user: refreshedProfile,
        });
        setSavedUserSkills(normalized);
        setDraftUserSkills(normalized);
      } else {
        setSavedUserSkills(nextSkills);
        setDraftUserSkills(nextSkills);
      }

      toast.success("Skills updated successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    } finally {
      setIsSavingSkills(false);
    }
  };

  const handleAddSkill = () => {
    const normalized = newSkill.trim();
    if (!normalized) {
      return;
    }

    if (
      draftUserSkills.some(
        (skill) => skill.toLowerCase() === normalized.toLowerCase(),
      )
    ) {
      toast.info("That skill is already in your list.");
      return;
    }

    const next = [...draftUserSkills, normalized];
    setDraftUserSkills(next);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const next = draftUserSkills.filter((skill) => skill !== skillToRemove);
    setDraftUserSkills(next);
  };

  const handleResetSkills = () => {
    setDraftUserSkills(savedUserSkills);
    setNewSkill("");
  };

  const handleSaveSkills = async () => {
    const normalized = normalizeUserSkills(draftUserSkills);
    await saveSkills(normalized);
  };

  const githubSourceHint = githubLanguages.length
    ? "Languages detected from your synced GitHub repositories."
    : "Connect GitHub in Data Hub to list languages from your repositories.";

  if (loading) {
    return (
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 sm:h-8 sm:w-56" />
          <Skeleton className="h-4 w-56 sm:w-72" />
        </div>
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Skill Intelligence
          </h2>
          <p className="text-sm text-muted-foreground">
            Skills you add manually and languages from your GitHub repos
          </p>
        </div>
        <Link
          href="/dashboard/data-hub"
          className="text-btn w-full rounded-xl bg-primary px-4 py-2 text-center text-primary-foreground  transition-colors hover:bg-primary/90 sm:w-auto"
        >
          Update Data Sources
        </Link>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Your Skills
          </h3>
          <div className="flex items-center gap-2">
            {hasUnsavedSkillChanges && (
              <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600">
                Unsaved
              </span>
            )}
            <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">
              Editable
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Add skills you want to highlight. These are separate from GitHub
          synced skills.
        </p>

        <div className="flex flex-wrap gap-2">
          {draftUserSkills.length === 0 && (
            <span className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              No manual skills added yet
            </span>
          )}

          {draftUserSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-primary"
            >
              <span className="wrap-break-word">{skill}</span>
              <button
                type="button"
                disabled={isSavingSkills}
                onClick={() => {
                  handleRemoveSkill(skill);
                }}
                className="text-accent hover:text-destructive disabled:opacity-60"
                aria-label={`Remove ${skill}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <input
            value={newSkill}
            onChange={(event) => setNewSkill(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAddSkill();
              }
            }}
            placeholder="Add a skill"
            className="w-full rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-ring/20 sm:w-64"
          />
          <button
            type="button"
            disabled={isSavingSkills}
            onClick={() => {
              handleAddSkill();
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={14} />
            Add Skill
          </button>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={!hasUnsavedSkillChanges || isSavingSkills}
            onClick={() => {
              void handleSaveSkills();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingSkills ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            disabled={!hasUnsavedSkillChanges || isSavingSkills}
            onClick={handleResetSkills}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          GitHub Synced Skills
        </h3>
        <p className="text-xs text-muted-foreground">{githubSourceHint}</p>
      </div>

      {githubLanguages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/60 p-6 text-sm text-muted-foreground">
          No GitHub languages yet. Sync your GitHub account from the Data Hub.
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {githubLanguages.map((language) => (
              <span
                key={language}
                className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1.5 text-sm font-medium text-foreground"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
