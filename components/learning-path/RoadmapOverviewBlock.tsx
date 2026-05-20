import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";
import {
  formatRoadmapStatus,
  roadmapStatusBadgeClass,
} from "@/lib/roadmap-utils";

type RoadmapOverviewBlockProps = {
  path: Pick<
    LearningPath,
    | "title"
    | "summary"
    | "goal"
    | "trendName"
    | "totalWeeks"
    | "stepsCompleted"
    | "totalSteps"
    | "progress"
    | "roadmapStatus"
    | "focus"
  >;
  compact?: boolean;
};

export function RoadmapOverviewBlock({
  path,
  compact = false,
}: RoadmapOverviewBlockProps) {
  const stepsCompleted = path.stepsCompleted ?? 0;
  const totalSteps = path.totalSteps ?? 0;

  return (
    <div
      className={`space-y-4 ${compact ? "" : "rounded-xl border border-border bg-muted/30 p-6"}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {path.roadmapStatus ? (
          <span className={roadmapStatusBadgeClass(path.roadmapStatus)}>
            {formatRoadmapStatus(path.roadmapStatus)}
          </span>
        ) : null}
        {path.trendName ? (
          <span className="vs-badge bg-muted text-muted-foreground">
            {path.trendName}
          </span>
        ) : null}
        {path.totalWeeks != null ? (
          <span className="text-sm text-muted-foreground">
            {path.totalWeeks} week{path.totalWeeks === 1 ? "" : "s"}
          </span>
        ) : null}
        {totalSteps > 0 ? (
          <span className="text-sm text-muted-foreground">
            {stepsCompleted}/{totalSteps} steps · {path.progress}% complete
          </span>
        ) : null}
      </div>

      {path.goal ? (
        <p className={compact ? "text-sm text-foreground" : "text-body text-foreground"}>
          <span className="font-semibold">Goal: </span>
          {path.goal}
        </p>
      ) : null}

      {path.summary ? (
        <p
          className={
            compact
              ? "line-clamp-3 text-sm leading-relaxed text-muted-foreground"
              : "text-body leading-relaxed text-muted-foreground"
          }
        >
          {path.summary}
        </p>
      ) : null}
    </div>
  );
}
