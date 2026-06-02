"use client";

import Link from "next/link";
import { RefreshCw, Sparkles, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRoleDemandLabel } from "@/lib/readiness-insights";
import type { UserReadiness } from "@/types/readiness";
import { cn } from "@/lib/utils";

function parseCareerInterests(value: string | null): string[] {
  if (!value?.trim()) {
    return [];
  }
  return value
    .split(/[,;|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function SkillGroup({
  label,
  skills,
  tone,
  maxSkills,
}: {
  label: string;
  skills: string[];
  tone: "matched" | "missing" | "transferable";
  maxSkills?: number;
}) {
  const visible = maxSkills ? skills.slice(0, maxSkills) : skills;
  if (!visible.length) {
    return null;
  }

  const chipClass =
    tone === "matched"
      ? "border-success/40 bg-success/15 text-foreground"
      : tone === "missing"
        ? "border-destructive/40 bg-destructive/15 text-foreground"
        : "border-primary/40 bg-primary/15 text-foreground";

  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted/30 p-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((skill) => (
          <span
            key={`${tone}-${skill}`}
            className={cn(
              "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold",
              chipClass,
            )}
            title={skill}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScoreBadge({
  score,
  level,
  demandLabel,
}: {
  score: number;
  level: string;
  demandLabel: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
      <div className="flex h-14 w-14 flex-col items-center justify-center rounded-md border border-primary/25 bg-card sm:h-16 sm:w-16">
        <span className="text-xl font-bold text-primary sm:text-2xl">{score}</span>
        <span className="text-[9px] font-bold uppercase text-muted-foreground">
          / 100
        </span>
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-bold text-foreground">{level}</p>
        <p className="text-xs text-muted-foreground">{demandLabel}</p>
      </div>
    </div>
  );
}

export default function CareerReadinessPanel({
  readiness,
  loading,
  refreshing,
  error,
  onRefresh,
  variant = "full",
}: {
  readiness: UserReadiness | null;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  variant?: "compact" | "full";
}) {
  const isCompact = variant === "compact";
  const shellClass = cn(
    "vs-surface w-full min-w-0",
    isCompact ? "p-5 sm:p-6" : "p-6 sm:p-8",
  );

  if (loading) {
    return (
      <div className={cn(shellClass, "space-y-4")}>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!readiness) {
    return (
      <div className={cn(shellClass, "space-y-3")}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {error ??
            "Career readiness is unavailable. Set your career interest and skills on your profile."}
        </p>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link href="/dashboard/profile">Complete profile</Link>
        </Button>
      </div>
    );
  }

  const demandLabel = formatRoleDemandLabel(readiness.market_context.role_demand);
  const interests = parseCareerInterests(readiness.career_interest);
  const hasManyInterests = interests.length > 1;

  return (
    <div className={cn(shellClass, "space-y-5")}>
      {/* Header */}
      <div className="space-y-4 border-b border-border pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="vs-badge vs-badge-success inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Career readiness
          </span>
          <div className="flex items-center gap-2">
            {!isCompact && readiness.cached && readiness.cached_at && (
              <span className="text-[10px] text-muted-foreground">
                Cached {new Date(readiness.cached_at).toLocaleDateString()}
              </span>
            )}
            {onRefresh && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                disabled={refreshing}
                onClick={onRefresh}
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
                />
                Refresh
              </Button>
            )}
          </div>
        </div>

        <div
          className={cn(
            "gap-4",
            isCompact
              ? "flex flex-col"
              : "grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_auto]",
          )}
        >
          <div className="min-w-0 space-y-3">
            {hasManyInterests ? (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Target roles
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex max-w-full rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground"
                      title={interest}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <h2 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
                {readiness.career_interest ?? "Your target role"}
              </h2>
            )}

            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              {readiness.level} · {demandLabel}
            </p>

            {!isCompact && readiness.summary && (
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {readiness.summary}
              </p>
            )}
          </div>

          {!isCompact && (
            <ScoreBadge
              score={readiness.overall_score}
              level={readiness.level}
              demandLabel={demandLabel}
            />
          )}
        </div>
      </div>

      {/* Skills */}
      <div
        className={cn(
          "grid gap-3",
          isCompact
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
        )}
      >
        <SkillGroup
          label="Matched skills"
          skills={readiness.matched_skills}
          tone="matched"
          maxSkills={isCompact ? 4 : undefined}
        />
        <SkillGroup
          label="Gaps to close"
          skills={readiness.missing_skills}
          tone="missing"
          maxSkills={isCompact ? 6 : undefined}
        />
        {!isCompact && (
          <SkillGroup
            label="Transferable"
            skills={readiness.transferable_skills}
            tone="transferable"
          />
        )}
      </div>

      {!isCompact && readiness.market_context.top_required_skills.length > 0 && (
        <div className="max-w-3xl rounded-lg border border-border bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Market context
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {demandLabel} for your target role. Top required skills:{" "}
            <span className="font-medium">
              {readiness.market_context.top_required_skills.slice(0, 6).join(", ")}
            </span>
            .
          </p>
        </div>
      )}

      {!isCompact && readiness.top_recommendations.length > 0 && (
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            Next steps
          </div>
          <ol className="space-y-3">
            {readiness.top_recommendations.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="min-w-0 text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
