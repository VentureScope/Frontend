"use client";

import Link from "next/link";
import {
  Github,
  GraduationCap,
  FileText,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataHubSourceStatus } from "@/lib/data-hub-utils";
import { formatHubTimestamp } from "@/lib/data-hub-utils";
import type { GitHubSyncedDataResponse } from "@/types/github";
import type { TranscriptResponse } from "@/types/transcript";
import { toast } from "sonner";

type SettingsIntelligenceTabProps = {
  loading: boolean;
  completionPercent: number;
  sources: DataHubSourceStatus[];
  github: GitHubSyncedDataResponse | null;
  transcript: TranscriptResponse | null;
  hasCv: boolean;
  onRefresh: () => Promise<void>;
  onRetryEmbedding: () => Promise<string>;
  embeddingLoading: boolean;
};

export function SettingsIntelligenceTab({
  loading,
  completionPercent,
  sources,
  github,
  transcript,
  hasCv,
  onRefresh,
  onRetryEmbedding,
  embeddingLoading,
}: SettingsIntelligenceTabProps) {
  const githubSource = sources.find((s) => s.id === "github");
  const transcriptSource = sources.find((s) => s.id === "transcript");
  const cvSource = sources.find((s) => s.id === "cv");
  const skillsSource = sources.find((s) => s.id === "skills");

  const githubConnected = githubSource?.status === "synced";
  const transcriptConnected = transcriptSource?.status === "synced";

  async function handleRefresh() {
    try {
      await onRefresh();
      toast.success("Intelligence sources refreshed.");
    } catch {
      toast.error("Could not refresh sources.");
    }
  }

  async function handleRetryEmbedding() {
    try {
      const message = await onRetryEmbedding();
      toast.success(message || "Embedding refresh queued.");
    } catch {
      toast.error("Could not queue embedding update.");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-primary/20 text-xl font-semibold text-primary sm:h-20 sm:w-20"
            style={{
              borderColor:
                completionPercent >= 75
                  ? "hsl(var(--success) / 0.35)"
                  : undefined,
            }}
          >
            {completionPercent}%
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              Intelligence sync health
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {completionPercent === 100
                ? "All core sources are connected."
                : `${sources.filter((s) => s.status === "synced").length} of ${sources.length} sources connected.`}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => void handleRefresh()}
          >
            <RefreshCw size={18} />
            Refresh
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={embeddingLoading}
            onClick={() => void handleRetryEmbedding()}
          >
            {embeddingLoading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            Update embeddings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sources.map((source) => (
          <div
            key={source.id}
            className="rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                {source.label}
              </p>
              <Badge
                className={
                  source.status === "synced"
                    ? "vs-badge vs-badge-success border-none"
                    : "vs-badge bg-muted text-muted-foreground border-none"
                }
              >
                {source.status === "synced" ? "Synced" : "Not connected"}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{source.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="vs-icon-tile vs-icon-tile-primary flex h-14 w-14">
              <Github size={28} />
            </div>
            <Badge
              className={
                githubConnected
                  ? "vs-badge vs-badge-success border-none"
                  : "vs-badge bg-muted text-muted-foreground border-none"
              }
            >
              {githubConnected ? "Connected" : "Not connected"}
            </Badge>
          </div>
          <div className="mt-6 space-y-2">
            <h4 className="text-lg font-semibold text-foreground">
              GitHub
            </h4>
            <p className="text-sm text-muted-foreground">
              {github?.github_username
                ? `@${github.github_username}`
                : "Connect via OAuth to sync repositories and contributions."}
            </p>
            {github?.synced_at ? (
              <p className="text-xs text-muted-foreground">
                Last synced {formatHubTimestamp(github.synced_at)}
              </p>
            ) : null}
            <Link
              href="/dashboard/data-hub"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Manage in Data Hub <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div
          className={`flex flex-col justify-between rounded-xl border bg-card p-5 sm:p-8 ${
            transcriptConnected ? "border-border" : "border-dashed border-border"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                transcriptConnected
                  ? "vs-icon-tile vs-icon-tile-accent"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <GraduationCap size={28} />
            </div>
            <Badge
              className={
                transcriptConnected
                  ? "vs-badge vs-badge-success border-none"
                  : "vs-badge bg-muted text-muted-foreground border-none"
              }
            >
              {transcriptConnected ? "Synced" : "Not connected"}
            </Badge>
          </div>
          <div className="mt-6 space-y-2">
            <h4 className="text-lg font-semibold text-foreground">
              Academic transcript
            </h4>
            <p className="text-sm text-muted-foreground">
              {transcriptConnected
                ? `Version ${transcript?.version ?? "—"} · uploaded ${formatHubTimestamp(transcript?.uploaded_at)}`
                : "Upload via the browser extension from the Data Hub."}
            </p>
            <Link
              href="/dashboard/data-hub"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Manage in Data Hub <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="vs-icon-tile vs-icon-tile-secondary flex h-14 w-14">
              <FileText size={28} />
            </div>
            <Badge
              className={
                hasCv
                  ? "vs-badge vs-badge-success border-none"
                  : "vs-badge bg-muted text-muted-foreground border-none"
              }
            >
              {hasCv ? "Uploaded" : "Missing"}
            </Badge>
          </div>
          <div className="mt-6 space-y-2">
            <h4 className="text-lg font-semibold text-foreground">CV file</h4>
            <p className="text-sm text-muted-foreground">{cvSource?.detail}</p>
            <Link
              href="/dashboard/data-hub"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Upload in Data Hub <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="vs-icon-tile vs-icon-tile-primary flex h-14 w-14">
              <Sparkles size={28} />
            </div>
            <Badge
              className={
                skillsSource?.status === "synced"
                  ? "vs-badge vs-badge-success border-none"
                  : "vs-badge bg-muted text-muted-foreground border-none"
              }
            >
              {skillsSource?.status === "synced" ? "On file" : "Empty"}
            </Badge>
          </div>
          <div className="mt-6 space-y-2">
            <h4 className="text-lg font-semibold text-foreground">
              Skills & experience
            </h4>
            <p className="text-sm text-muted-foreground">
              {skillsSource?.detail}. Edit skills on your profile page.
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Edit profile <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
