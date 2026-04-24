"use client";

import { useEffect, useState } from "react";
import { GraduationCap, CheckCircle2, Code2 } from "lucide-react";
import {
  getLatestTranscript,
  getTranscriptConfig,
  getGithubSyncedData,
} from "@/lib/auth-api";
import {
  TranscriptResponse,
  TranscriptConfigResponse,
} from "@/types/transcript";
import { GitHubSyncedDataResponse } from "@/types/github";
import { useAppStore } from "@/store/useAppStore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProfileIntelligence() {
  const user = useAppStore((state) => state.authData.user);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [config, setConfig] = useState<TranscriptConfigResponse | null>(null);
  const [github, setGithub] = useState<GitHubSyncedDataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [transcriptRes, configRes, githubRes] = await Promise.all([
          getLatestTranscript().catch((err: any) => {
            if (err.response?.status !== 404)
              toast.error("Failed to load transcript data");
            return null;
          }),
          getTranscriptConfig().catch((err: any) => {
            console.error("Error fetching transcript config:", err);
            return null;
          }),
          getGithubSyncedData().catch((err: any) => {
            if (err.response?.status !== 404)
              toast.error("Failed to load GitHub data");
            return null;
          }),
        ]);

        if (transcriptRes) setTranscript(transcriptRes);
        if (configRes) setConfig(configRes);
        if (githubRes) setGithub(githubRes);
      } catch (error) {
        console.error("Failed to fetch profile intelligence data", error);
        toast.error("Failed to fetch profile intelligence data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const semesters = transcript?.transcript_data?.semesters || [];
  const latestSemester =
    semesters.length > 0 ? semesters[semesters.length - 1] : null;
  const isAcademicConnected = semesters.length > 0;
  const gpaScale = config?.gpa_scale || 4.0;
  const latestCGPA = latestSemester?.cumulative_summary?.cgpa || null;

  const isGithubConnected = !!(
    github?.github_username || user?.github_username
  );
  const totalRepos = github?.repositories?.length || 0;
  const totalCommits = github?.contributions?.total_contributions || 0;

  if (loading) {
    return (
      <div className="relative rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7 lg:rounded-[32px] lg:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* GitHub Card Skeleton */}
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          {/* Academic Card Skeleton */}
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7 lg:rounded-[32px] lg:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-slate-900">
          Profile Intelligence
        </h3>
        <span className="text-xs font-bold text-slate-400 sm:text-right">
          Last synced:{" "}
          {github?.synced_at || transcript?.created_at
            ? new Date(
                Math.max(
                  github?.synced_at
                    ? new Date(github.synced_at as any).getTime()
                    : 0,
                  transcript?.created_at
                    ? new Date(transcript.created_at as any).getTime()
                    : 0,
                ),
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Never"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* GitHub Card */}
        <div
          className={
            "flex flex-col gap-3 rounded-3xl p-4 sm:p-5 md:flex-row md:items-center md:justify-between " +
            (isGithubConnected
              ? "bg-[#f4f7ff]"
              : "bg-slate-50 border border-slate-100")
          }
        >
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div
              className={
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm sm:h-12 sm:w-12 " +
                (isGithubConnected
                  ? "bg-white text-blue-600"
                  : "bg-white text-slate-400")
              }
            >
              <Code2 size={24} />
            </div>
            <div className="min-w-0">
              <h4
                className={
                  "wrap-break-word text-sm font-bold " +
                  (isGithubConnected ? "text-slate-900" : "text-slate-500")
                }
              >
                GitHub Analytics
              </h4>
              <p className="wrap-break-word text-[11px] font-medium text-slate-500">
                {isGithubConnected
                  ? `${totalRepos} Repositories, ${totalCommits} Commits`
                  : "Not Connected"}
              </p>
            </div>
          </div>
          {isGithubConnected && (
            <CheckCircle2
              className="self-start text-blue-600 md:self-auto"
              size={20}
            />
          )}
        </div>

        {/* Academic Card */}
        <div
          className={
            "flex flex-col gap-3 rounded-3xl p-4 sm:p-5 md:flex-row md:items-center md:justify-between " +
            (isAcademicConnected
              ? "border-2 border-blue-100 bg-white"
              : "border-2 border-slate-100 bg-slate-50")
          }
        >
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div
              className={
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 " +
                (isAcademicConnected
                  ? "bg-[#eff6ff] text-blue-600"
                  : "bg-slate-100 text-slate-400")
              }
            >
              <GraduationCap size={24} />
            </div>
            <div className="min-w-0">
              <h4
                className={
                  "wrap-break-word text-sm font-bold " +
                  (isAcademicConnected ? "text-slate-900" : "text-slate-500")
                }
              >
                eStudent Sync
              </h4>
              <p className="wrap-break-word text-[11px] font-medium text-slate-500">
                {isAcademicConnected
                  ? `GPA: ${latestCGPA?.toFixed(2) || "N/A"}/${gpaScale.toFixed(1)}, Synced`
                  : "No Academic Records"}
              </p>
            </div>
          </div>
          {isAcademicConnected && (
            <CheckCircle2
              className="self-start text-blue-600 md:self-auto"
              size={20}
            />
          )}
        </div>
      </div>
    </div>
  );
}
