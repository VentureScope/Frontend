"use client";

import { useEffect, useState } from "react";
import { Github, RefreshCw } from "lucide-react";
import { syncGithubProfile, getGithubSyncedData } from "@/lib/auth-api";
import { GitHubSyncedDataResponse } from "@/types/github";
import { useAppStore } from "@/store/useAppStore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const GITHUB_OAUTH_SESSION_KEY = "github_oauth_tx";

export default function GitHubCard() {
  const user = useAppStore((state) => state.authData.user);
  const [data, setData] = useState<GitHubSyncedDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function fetchSyncedData() {
    setLoading(true);
    setSyncError(null);
    try {
      const result = await getGithubSyncedData();
      setData(result);
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        console.error("Failed to fetch github synced data:", error);
        toast.error("Failed to load GitHub data", {
          description: "We couldn't retrieve your GitHub syncing status.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSyncedData();
  }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncError(null);
    try {
      const response = await syncGithubProfile();
      toast.success("Sync Started", {
        description: "Executing GitHub sync flow.",
      });

      // If the backend returns an authorization URL, redirect the user
      if (response.authorization_url) {
        const stateFromResponse =
          typeof response.state === "string" && response.state.trim().length > 0
            ? response.state
            : null;

        const stateFromUrl = (() => {
          try {
            return new URL(response.authorization_url).searchParams.get(
              "state",
            );
          } catch {
            return null;
          }
        })();

        const oauthState = stateFromResponse || stateFromUrl;
        if (oauthState) {
          const returnToPath = `${window.location.pathname}${window.location.search}`;
          sessionStorage.setItem(
            GITHUB_OAUTH_SESSION_KEY,
            JSON.stringify({
              state: oauthState,
              createdAt: Date.now(),
              flow: "github-sync",
              returnTo: returnToPath,
            }),
          );
        }

        window.location.href = response.authorization_url;
        return;
      }

      // If it immediately synced without auth redirect, refresh data
      toast.success("GitHub Synchronized");
      await fetchSyncedData();
    } catch (error: any) {
      setSyncError("Failed to initiate sync");
      toast.error("Action Failed", {
        description:
          error.response?.data?.detail || "Failed to trigger GitHub sync.",
      });
      console.error(error);
    } finally {
      setSyncing(false);
    }
  }

  const isConnected = !!(data?.github_username || user?.github_username);
  const displayUsername = data?.github_username || user?.github_username;
  const totalRepos = data?.repositories?.length || 0;

  // Flatten languages across all sync'd repos to get unique language count
  const uniqueLanguages = new Set<string>();
  if (data?.repositories) {
    data.repositories.forEach((repo) => {
      repo.languages?.forEach((lang) => {
        uniqueLanguages.add(lang.name);
      });
    });
  }

  const stats = [
    {
      label: "REPOS SYNCED",
      value: isConnected ? totalRepos.toString() : "-",
    },
    {
      label: "COMMITS",
      value: isConnected
        ? data?.contributions?.total_contributions?.toString() || "0"
        : "-",
    },
    {
      label: "LANGUAGES",
      value: isConnected ? uniqueLanguages.size.toString() : "-",
    },
  ];

  const formattedDate = data?.synced_at
    ? new Date(data.synced_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

  if (loading && !data) {
    return (
      <div className="flex h-full flex-col justify-between rounded-lg sm:rounded-xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-sm relative">
        <div className="space-y-6 sm:space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-5">
              <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-lg shrink-0" />
              <div className="space-y-1 sm:space-y-2">
                <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl sm:rounded-lg" />
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl sm:rounded-lg" />
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl sm:rounded-lg" />
          </div>
        </div>
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-border pt-4 sm:pt-6 gap-4">
          <div className="space-y-1 sm:space-y-2 w-full sm:w-auto flex justify-between sm:block">
            <Skeleton className="h-3 w-16 sm:w-20" />
            <Skeleton className="h-4 w-24 sm:w-32" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-full sm:w-32 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-lg sm:rounded-xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-sm relative">
      <div className="space-y-6 sm:space-y-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="vs-icon-tile vs-icon-tile-primary h-12 w-12 shrink-0 sm:h-14 sm:w-14">
              <Github className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                GitHub Integration
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isConnected
                  ? `Connected as @${displayUsername}`
                  : "Syncing technical contributions"}
              </p>
            </div>
          </div>
          {isConnected ? (
            <span className="flex items-center gap-1.5 self-start rounded-full bg-success/15 px-2 py-1 text-[9px] font-bold text-success sm:px-3 sm:text-[10px]">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              CONNECTED
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold text-muted-foreground self-start">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              DISCONNECTED
            </span>
          )}
        </div>

        {syncError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-bold text-destructive">
            {syncError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-xl sm:rounded-lg p-4 sm:p-6 border flex sm:block items-center justify-between sm:justify-start ${
                isConnected
                  ? "bg-muted border-border/50"
                  : "bg-muted border-border"
              }`}
            >
              <p
                className={`text-2xl sm:text-3xl font-bold ${isConnected ? "text-primary" : "text-muted-foreground"}`}
              >
                {s.value}
              </p>
              <p
                className={`mt-0 sm:mt-1 text-[9px] font-bold uppercase tracking-widest ${isConnected ? "text-primary/70" : "text-muted-foreground"}`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 sm:pt-6 gap-4 sm:gap-0">
        <div className="w-full sm:w-auto flex justify-between sm:block">
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Last Synced
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">
            {formattedDate}
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing || loading}
          className={`group flex items-center justify-center w-full sm:w-auto gap-2 text-xs sm:text-sm font-bold transition-all ${
            isConnected
              ? "text-primary bg-muted sm:bg-transparent py-3 sm:py-0 rounded-xl sm:rounded-none hover:text-primary/90"
              : "rounded-md bg-primary px-4 py-3 text-primary-foreground hover:bg-primary/90 sm:py-2"
          } ${syncing || loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {syncing ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : isConnected ? (
            <RefreshCw
              size={14}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
          ) : null}
          {syncing
            ? "Syncing..."
            : isConnected
              ? "Re-sync Now"
              : "Connect GitHub"}
        </button>
      </div>
    </div>
  );
}

