"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getApiErrorMessage,
  getCurrentUserProfile,
  getGithubSyncedData,
  updateCurrentUserSkills,
} from "@/lib/auth-api";
import {
  GitHubRepositorySummary,
  GitHubSyncedDataResponse,
} from "@/types/github";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/useAppStore";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

type SkillColor = "blue" | "rose" | "indigo" | "emerald";

interface UISkill {
  label: string;
  status: string;
  level: string;
  pct: number;
  color: SkillColor;
}

const SKILL_COLORS: SkillColor[] = ["blue", "rose", "indigo", "emerald"];

function levelFromPct(pct: number): string {
  if (pct >= 80) return "Expert";
  if (pct >= 60) return "Advanced";
  if (pct >= 40) return "Intermediate";
  return "Developing";
}

function statusFromPct(pct: number): string {
  if (pct >= 75) return "High Signal";
  if (pct >= 50) return "Growing";
  if (pct >= 30) return "Steady";
  return "Needs Depth";
}

function deriveGithubSkills(
  repositories: GitHubRepositorySummary[] | null | undefined,
): UISkill[] {
  if (!repositories || repositories.length === 0) {
    return [];
  }

  const languageBytes = new Map<string, number>();
  const languageRepos = new Map<string, number>();

  let maxBytes = 1;
  let maxRepos = 1;

  for (const repo of repositories) {
    const repoLanguages = new Set<string>();

    if (repo.languages && repo.languages.length > 0) {
      for (const language of repo.languages) {
        if (!language.name) continue;
        repoLanguages.add(language.name);

        const currentBytes = languageBytes.get(language.name) ?? 0;
        const newBytes = currentBytes + (language.size || 1);
        languageBytes.set(language.name, newBytes);
        if (newBytes > maxBytes) maxBytes = newBytes;
      }
    } else if (repo.primary_language) {
      repoLanguages.add(repo.primary_language);
      const currentBytes = languageBytes.get(repo.primary_language) ?? 0;
      const newBytes = currentBytes + 1000; // Fallback size if no languages array
      languageBytes.set(repo.primary_language, newBytes);
      if (newBytes > maxBytes) maxBytes = newBytes;
    }

    for (const lang of repoLanguages) {
      const currentRepos = languageRepos.get(lang) ?? 0;
      const newRepos = currentRepos + 1;
      languageRepos.set(lang, newRepos);
      if (newRepos > maxRepos) maxRepos = newRepos;
    }
  }

  if (languageBytes.size === 0) {
    return [];
  }

  // Sort primarily by bytes, then by repo count
  const sortedLangs = Array.from(languageBytes.keys()).sort((a, b) => {
    const bytesDiff = (languageBytes.get(b) ?? 0) - (languageBytes.get(a) ?? 0);
    if (bytesDiff !== 0) return bytesDiff;
    return (languageRepos.get(b) ?? 0) - (languageRepos.get(a) ?? 0);
  });

  return sortedLangs.map((name, index) => {
    const bytes = languageBytes.get(name) ?? 0;
    const repos = languageRepos.get(name) ?? 0;

    // 1. Volume Score (Depth): How much code compared to top language
    const volumeScore = (bytes / maxBytes) * 100;
    // 2. Frequency Score (Breadth): How many repos it's in compared to top language
    const frequencyScore = (repos / maxRepos) * 100;

    // Weigh depth heavily (70%) but reward breadth (30%)
    const rawPct = volumeScore * 0.7 + frequencyScore * 0.3;

    // Use a square root curve so secondary skills don't flatline at 1% if there's one massive codebase
    // e.g. A raw score of 25% curves to 50%. A raw score of 1% curves to 10%.
    const curvedPct = Math.round(Math.pow(rawPct / 100, 0.5) * 100);
    const finalPct = Math.min(100, Math.max(5, curvedPct));

    return {
      label: name.toUpperCase(),
      pct: finalPct,
      level: levelFromPct(finalPct),
      status: statusFromPct(finalPct),
      color: SKILL_COLORS[index % SKILL_COLORS.length],
    };
  });
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
  const authData = useAppStore((state) => state.authData);
  const setAuthData = useAppStore((state) => state.setAuthData);

  const [githubData, setGithubData] = useState<GitHubSyncedDataResponse | null>(
    null,
  );
  const [savedUserSkills, setSavedUserSkills] = useState<string[]>([]);
  const [draftUserSkills, setDraftUserSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(4);

  useEffect(() => {
    const loadSignals = async () => {
      try {
        const [github, userProfile] = await Promise.all([
          getGithubSyncedData().catch(() => null),
          getCurrentUserProfile().catch(() => null),
        ]);

        setGithubData(github);

        if (userProfile) {
          const normalized = normalizeUserSkills(userProfile.skills);
          setSavedUserSkills(normalized);
          setDraftUserSkills(normalized);
          setAuthData({
            ...authData,
            user: userProfile,
          });
        } else {
          const fromStore = normalizeUserSkills(authData.user?.skills);
          setSavedUserSkills(fromStore);
          setDraftUserSkills(fromStore);
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    void loadSignals();
  }, []);

  const githubSkills = useMemo(
    () => deriveGithubSkills(githubData?.repositories),
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
      const refreshedProfile = await getCurrentUserProfile().catch(() => null);

      if (refreshedProfile) {
        const normalized = normalizeUserSkills(refreshedProfile.skills);
        setAuthData({
          ...authData,
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

  const signalSource = githubSkills.length
    ? "Source: GitHub synced repositories"
    : "Connect GitHub in Data Hub to generate synced skill intelligence.";

  if (loading) {
    return (
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 sm:h-8 sm:w-56" />
          <Skeleton className="h-4 w-56 sm:w-72" />
        </div>
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4"
            >
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Skill Intelligence
          </h2>
          <p className="text-sm text-slate-400">
            Current proficiency vs. Industry benchmarks
          </p>
        </div>
        <Link
          href="/dashboard/data-hub"
          className="w-full rounded-xl bg-blue-600 px-4 py-2 text-center text-xs font-bold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700 sm:w-auto"
        >
          Update Data Sources
        </Link>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Your Skills
          </h3>
          <div className="flex items-center gap-2">
            {hasUnsavedSkillChanges && (
              <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600">
                Unsaved
              </span>
            )}
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
              Editable
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Add skills you want to highlight. These are separate from GitHub
          synced skills.
        </p>

        <div className="flex flex-wrap gap-2">
          {draftUserSkills.length === 0 && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
              No manual skills added yet
            </span>
          )}

          {draftUserSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
            >
              <span className="wrap-break-word">{skill}</span>
              <button
                type="button"
                disabled={isSavingSkills}
                onClick={() => {
                  handleRemoveSkill(skill);
                }}
                className="text-blue-400 hover:text-rose-500 disabled:opacity-60"
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
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-blue-100 transition-all focus:border-blue-300 focus:ring-2 sm:w-64"
          />
          <button
            type="button"
            disabled={isSavingSkills}
            onClick={() => {
              handleAddSkill();
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingSkills ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            disabled={!hasUnsavedSkillChanges || isSavingSkills}
            onClick={handleResetSkills}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          GitHub Synced Skills
        </h3>
        <p className="text-xs font-semibold text-slate-500">{signalSource}</p>
      </div>

      {githubSkills.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-sm text-slate-500">
          No GitHub skill data available yet. Sync your GitHub account from the
          Data Hub.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {githubSkills.slice(0, displayCount).map((s, idx) => (
          <div
            key={`github-${s.label}-${idx}`}
            className={`flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:p-6 border-l-4 ${
              s.color === "blue"
                ? "border-l-blue-600"
                : s.color === "rose"
                  ? "border-l-rose-500"
                  : s.color === "indigo"
                    ? "border-l-indigo-600"
                    : "border-l-emerald-500"
            }`}
          >
            <div className="mb-4 flex flex-col items-start gap-1.5">
              <h4 className="w-full truncate text-base font-semibold leading-snug text-slate-900">
                {s.label}
              </h4>
              <span
                className={`rounded-md px-2 py-1 text-[10px] font-bold inline-flex ${
                  s.status === "Needs Depth"
                    ? "bg-rose-50 text-rose-500"
                    : s.status === "Steady" || s.status === "Growing"
                      ? "bg-slate-100 text-slate-500"
                      : "bg-emerald-50 text-emerald-500"
                }`}
              >
                {s.status}
              </span>
            </div>
            <div className="mt-auto space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Level
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {s.level}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <span>Proficiency</span>
                  <span>{s.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-500 ${
                      s.color === "blue"
                        ? "bg-blue-600"
                        : s.color === "rose"
                          ? "bg-rose-500"
                          : s.color === "indigo"
                            ? "bg-indigo-600"
                            : "bg-emerald-500"
                    }`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {githubSkills.length > 4 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          {displayCount < githubSkills.length && (
            <button
              onClick={() => setDisplayCount((prev) => prev + 4)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              View More
            </button>
          )}
          {displayCount > 4 && (
            <button
              onClick={() => setDisplayCount(4)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Compress
            </button>
          )}
        </div>
      )}
    </div>
  );
}
