"use client";

import { useEffect, useState } from "react";
import { Github, RefreshCw } from "lucide-react";
import { syncGithubProfile, getGithubSyncedData } from "@/lib/auth-api";
import { GitHubSyncedDataResponse } from "@/types/github";

const GITHUB_OAUTH_SESSION_KEY = "github_oauth_tx";

export default function GitHubCard() {
  const [data, setData] = useState<GitHubSyncedDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function fetchSyncedData() {
    setLoading(true);
    setSyncError(null);
    try {
      const result = await getGithubSyncedData();
      console.log("[github-sync] Synced data payload", {
        githubUsername: result.github_username,
        repoCount: result.repositories?.length ?? 0,
        repoNamesPreview:
          result.repositories?.slice(0, 10).map((repo) => repo.name) ?? [],
        syncedAt: result.synced_at,
      });
      setData(result);
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        console.error("Failed to fetch github synced data:", error);
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
      console.log("[github-sync] Sync trigger response", {
        status: response.status,
        message: response.message,
        githubConnected: response.github_connected,
        repoCount: response.repositories?.length ?? 0,
        hasAuthorizationUrl: Boolean(response.authorization_url),
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
      await fetchSyncedData();
    } catch (error: any) {
      setSyncError("Failed to initiate sync");
      console.error(error);
    } finally {
      setSyncing(false);
    }
  }

  const isConnected = !!data?.github_username;
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
    { label: "REPOS SYNCED", value: isConnected ? totalRepos.toString() : "-" },
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

  return (
    <div className="flex h-full flex-col justify-between rounded-[32px] border border-slate-100 bg-white p-10 shadow-sm relative">
      {loading && !data && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[32px]">
          <div className="animate-spin text-blue-600">
            <RefreshCw size={24} />
          </div>
        </div>
      )}

      <div className="space-y-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Github size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                GitHub Integration
              </h3>
              <p className="text-sm text-slate-500">
                {isConnected
                  ? `Connected as @${data.github_username}`
                  : "Syncing technical contributions & repositories"}
              </p>
            </div>
          </div>
          {isConnected ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              CONNECTED
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              DISCONNECTED
            </span>
          )}
        </div>

        {syncError && (
          <div className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100">
            {syncError}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl p-6 border ${
                isConnected
                  ? "bg-blue-50/50 border-blue-100/50"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <p
                className={`text-3xl font-bold ${isConnected ? "text-blue-700" : "text-slate-400"}`}
              >
                {s.value}
              </p>
              <p
                className={`mt-1 text-[9px] font-bold uppercase tracking-widest ${isConnected ? "text-blue-500/70" : "text-slate-400"}`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Last Synced
          </p>
          <p className="text-xs font-medium text-slate-600">{formattedDate}</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing || loading}
          className={`group flex items-center gap-2 text-xs font-bold transition-all ${
            isConnected
              ? "text-blue-600 hover:text-blue-700"
              : "px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
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
