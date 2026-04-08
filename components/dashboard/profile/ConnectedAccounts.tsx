"use client";

import { useEffect, useState } from "react";
import { Share2, Github, GraduationCap } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getGithubSyncedData, getLatestTranscript } from "@/lib/auth-api";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ConnectedAccounts() {
  const user = useAppStore((state) => state.authData.user);

  const [hasGithub, setHasGithub] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [hasAcademic, setHasAcademic] = useState(false);
  const [loading, setLoading] = useState(true);

  // We can check if the user object has github_username, but to be sure we also try to fetch synced data
  // Also checking for transcripts
  useEffect(() => {
    async function checkConnections() {
      try {
        const [githubRes, transcriptRes] = await Promise.all([
          getGithubSyncedData().catch(() => null),
          getLatestTranscript().catch(() => null),
        ]);

        if (githubRes?.github_username) {
          setHasGithub(true);
          setGithubUsername(githubRes.github_username);
        } else if (user?.github_username) {
          setHasGithub(true);
          setGithubUsername(user.github_username);
        }

        if (transcriptRes?.transcript_data?.semesters?.length > 0) {
          setHasAcademic(true);
        }
      } catch (err) {
        console.error("Failed to check connected accounts", err);
        toast.error("Failed to sync connected accounts status");
      } finally {
        setLoading(false);
      }
    }

    checkConnections();
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm relative">
        <div className="mb-6 flex items-center gap-2 text-slate-300">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl p-3 border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between rounded-xl p-3 border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm relative">
      <div className="mb-6 flex items-center gap-2 text-blue-600">
        <Share2 size={18} />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Connected Accounts
        </span>
      </div>

      <div className="space-y-3">
        {/* GitHub Integration */}
        <div
          className={
            "flex items-center justify-between rounded-xl p-3 border " +
            (hasGithub
              ? "bg-[#f4f7ff] border-blue-100"
              : "bg-slate-50/50 border-slate-100")
          }
        >
          <div className="flex items-center gap-3">
            <Github
              size={18}
              className={hasGithub ? "text-blue-600" : "text-slate-600"}
            />
            <span
              className={
                "text-sm font-bold " +
                (hasGithub ? "text-slate-900" : "text-slate-700")
              }
            >
              {hasGithub ? `GitHub (@${githubUsername})` : "GitHub"}
            </span>
          </div>
          {hasGithub ? (
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
              LINKED
            </span>
          ) : (
            <Link
              href="/dashboard/settings"
              className="text-[9px] font-bold text-blue-600 hover:underline"
            >
              CONNECT
            </Link>
          )}
        </div>

        {/* Academic Portal (eStudent) */}
        <div
          className={
            "flex items-center justify-between rounded-xl p-3 border " +
            (hasAcademic
              ? "bg-[#eff6ff] border-blue-100"
              : "bg-slate-50/50 border-slate-100")
          }
        >
          <div className="flex items-center gap-3">
            <GraduationCap
              size={18}
              className={hasAcademic ? "text-blue-600" : "text-slate-400"}
            />
            <span
              className={
                "text-sm font-bold " +
                (hasAcademic ? "text-slate-900" : "text-slate-700")
              }
            >
              Academic Portal
            </span>
          </div>
          {hasAcademic ? (
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600 tracking-widest">
              SYNCED
            </span>
          ) : (
            <Link
              href="/dashboard/settings"
              className="text-[9px] font-bold text-blue-600 hover:underline"
            >
              CONNECT
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
