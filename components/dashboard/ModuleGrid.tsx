"use client";

import { BookOpen, HelpCircle, FileText, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModuleGridSkeleton } from "@/components/dashboard/DashboardSkeletons";
import { setAdvisorPendingMessage } from "@/lib/advisor-launch";
import type { GeneratedResumeOut } from "@/types/generated-resume";
import type { JobMatch } from "@/types/jobs";
import type { RoadmapListItem } from "@/types/roadmap";

export default function ModuleGrid({
  activeRoadmap,
  latestResume,
  profileMatchPercent,
  topJobMatch,
  loading,
}: {
  activeRoadmap: RoadmapListItem | null;
  latestResume: GeneratedResumeOut | null;
  profileMatchPercent: number | null;
  topJobMatch?: JobMatch | null;
  loading?: boolean;
}) {
  const router = useRouter();

  if (loading) {
    return <ModuleGridSkeleton />;
  }

  const progress = Math.round(activeRoadmap?.completion_percentage ?? 0);
  const roadmapHref = activeRoadmap
    ? `/dashboard/learning-path/${activeRoadmap.id}`
    : "/dashboard/learning-path/new-roadmap";
  const resumeHref = latestResume
    ? `/dashboard/resume-builder/${latestResume.id}`
    : "/dashboard/resume-builder/new-resume";

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:items-stretch">
      <Link
        href={roadmapHref}
        className="vs-surface flex h-full flex-col p-6 transition-colors hover:border-primary/25 sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="vs-icon-tile vs-icon-tile-primary p-2.5 sm:p-3">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-label text-primary">
            {activeRoadmap ? "Active module" : "Learning path"}
          </span>
        </div>
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">
            {activeRoadmap?.title ?? "Start a learning roadmap"}
          </h3>
          <p className="text-body text-muted-foreground">
            {activeRoadmap?.trend_name ?? "Generate a personalized path"}
          </p>
        </div>
        <div className="mt-auto">
          {activeRoadmap ? (
            <div className="space-y-2">
              <div className="flex justify-between text-label text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/80 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-primary">Create roadmap →</p>
          )}
        </div>
      </Link>

      <div className="vs-surface flex h-full flex-col p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="vs-icon-tile vs-icon-tile-accent p-2.5 sm:p-3">
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="vs-badge vs-badge-success">Online</span>
        </div>
        <h3 className="mb-4 text-lg font-semibold text-foreground sm:mb-6 sm:text-xl">
          Ask your advisor anything
        </h3>
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const q = String(fd.get("question") ?? "").trim();
            if (q) {
              setAdvisorPendingMessage(q);
            }
            router.push("/dashboard/ai-advisor");
          }}
        >
          <input
            name="question"
            placeholder="How can I negotiate my salary?"
            className="text-body w-full rounded-md border border-border bg-muted py-3.5 pr-12 pl-4 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/35 focus:ring-1 focus:ring-primary/20 sm:py-4"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-primary sm:right-5"
            aria-label="Send to AI advisor"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <Link
          href="/dashboard/ai-advisor"
          className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
        >
          Open AI Advisor →
        </Link>
      </div>

      <div className="vs-surface flex h-full min-h-0 flex-col p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="vs-icon-tile vs-icon-tile-secondary p-2.5 sm:p-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="text-right">
            <p className="text-label text-muted-foreground">Profile match</p>
            <p className="text-lg font-semibold text-secondary sm:text-xl">
              {profileMatchPercent != null ? `${profileMatchPercent}%` : "—"}
            </p>
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">
          {latestResume
            ? latestResume.target_role
            : topJobMatch?.normalized_title || topJobMatch?.job_title || "No resume yet"}
        </h3>
        {topJobMatch ? (
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:mb-6">
            Top match: {topJobMatch.job_title} at {topJobMatch.company_name}
          </p>
        ) : (
          <p className="mb-4 text-xs text-muted-foreground sm:mb-6">
            Sync your profile to see job matches.
          </p>
        )}
        <div className="mt-auto flex flex-col gap-2">
          {latestResume ? (
            <Link
              href={resumeHref}
              className="text-btn w-full rounded-md border border-border bg-muted py-3 text-center font-medium text-foreground transition-colors hover:bg-muted/80 sm:py-3.5"
            >
              View resume
            </Link>
          ) : null}
          <Link
            href="/dashboard/resume-builder/new-resume"
            className="text-btn w-full rounded-md border border-primary/30 bg-primary/10 py-3 text-center font-medium text-primary transition-colors hover:bg-primary/15 sm:py-3.5"
          >
            {latestResume ? "Build new resume" : "Build resume"}
          </Link>
        </div>
      </div>
    </div>
  );
}
