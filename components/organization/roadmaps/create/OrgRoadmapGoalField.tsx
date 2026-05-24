"use client";

import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

const GOAL_EXAMPLES = [
  "Prepare the team for senior-level delivery in this practice area.",
  "Close skill gaps so we can ship our next product milestone with confidence.",
  "Build a shared professional standard for code quality and collaboration.",
] as const;

export function OrgRoadmapGoalField({
  value,
  onChange,
  disabled,
  areaTitle,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  areaTitle?: string;
}) {
  const trimmed = value.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 12;

  return (
    <div className="vs-surface rounded-[20px] border border-border p-5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Target className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-label text-muted-foreground">Step 2 · Roadmap outcome</p>
          <h3 className="text-base font-semibold text-foreground">
            Professional end goal
          </h3>
          <p className="text-sm text-muted-foreground">
            Describe what success looks like for this roadmap—the career or
            capability outcome you want the team to reach
            {areaTitle ? ` in ${areaTitle}` : ""}. Organization and team context
            are applied automatically from your workspace.
          </p>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
        maxLength={500}
        placeholder="e.g. Help our engineers grow into confident senior contributors who can own end-to-end delivery in this practice area."
        className={cn(
          "mt-4 flex min-h-[100px] w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          tooShort && "border-destructive/50 focus-visible:ring-destructive/30",
        )}
        aria-invalid={tooShort}
        aria-describedby="org-roadmap-goal-hint"
      />

      <div
        id="org-roadmap-goal-hint"
        className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"
      >
        <span>
          {tooShort
            ? "Add a bit more detail (at least 12 characters)."
            : "This is sent as the roadmap goal to guide generation."}
        </span>
        <span>{value.length}/500</span>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">Examples you can adapt:</p>
      <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
        {GOAL_EXAMPLES.map((example) => (
          <li key={example} className="flex gap-2">
            <span className="text-primary" aria-hidden>
              ·
            </span>
            <span>{example}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
