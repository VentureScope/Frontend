"use client";

import { useEffect, useState } from "react";
import {
  Github,
  GraduationCap,
  CheckCircle2,
  Code2,
  RefreshCw,
} from "lucide-react";
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
          getLatestTranscript().catch((err: any) => null),
          getTranscriptConfig().catch((err: any) => null),
          getGithubSyncedData().catch((err: any) => null),
        ]);

        if (transcriptRes) setTranscript(transcriptRes);
        if (configRes) setConfig(configRes);
        if (githubRes) setGithub(githubRes);
      } catch (error) {
        console.error("Failed to fetch profile intelligence data", error);
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

  return (
    <div className="rounded-[32px] bg-white p-10 shadow-sm border border-slate-100 relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[32px]">
          <RefreshCw size={24} className="animate-spin text-blue-600" />
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900">
          Profile Intelligence
        </h3>
        <span className="text-xs font-bold text-slate-400">
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
            "flex items-center justify-between rounded-3xl p-6 " +
            (isGithubConnected
              ? "bg-[#f4f7ff]"
              : "bg-slate-50 border border-slate-100")
          }
        >
          <div className="flex items-center gap-4">
            <div
              className={
                "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm " +
                (isGithubConnected
                  ? "bg-white text-blue-600"
                  : "bg-white text-slate-400")
              }
            >
              <Code2 size={24} />
            </div>
            <div>
              <h4
                className={
                  "text-sm font-bold " +
                  (isGithubConnected ? "text-slate-900" : "text-slate-500")
                }
              >
                GitHub Analytics
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {isGithubConnected
                  ? `\${totalRepos} Repositories, \${totalCommits} Commits`
                  : "Not Connected"}
              </p>
            </div>
          </div>
          {isGithubConnected && (
            <CheckCircle2 className="text-blue-600" size={20} />
          )}
        </div>

        {/* Academic Card */}
        <div
          className={
            "flex items-center justify-between rounded-3xl p-6 " +
            (isAcademicConnected
              ? "border-2 border-blue-100 bg-white"
              : "border-2 border-slate-100 bg-slate-50")
          }
        >
          <div className="flex items-center gap-4">
            <div
              className={
                "flex h-12 w-12 items-center justify-center rounded-2xl " +
                (isAcademicConnected
                  ? "bg-[#eff6ff] text-blue-600"
                  : "bg-slate-100 text-slate-400")
              }
            >
              <GraduationCap size={24} />
            </div>
            <div>
              <h4
                className={
                  "text-sm font-bold " +
                  (isAcademicConnected ? "text-slate-900" : "text-slate-500")
                }
              >
                eStudent Sync
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {isAcademicConnected
                  ? `GPA: \${latestCGPA?.toFixed(2) || "N/A"}/\${gpaScale.toFixed(1)}, Synced`
                  : "No Academic Records"}
              </p>
            </div>
          </div>
          {isAcademicConnected && (
            <CheckCircle2 className="text-blue-600" size={20} />
          )}
        </div>
      </div>
    </div>
  );
}
