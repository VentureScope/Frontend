import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import { RESUME_COMPLETENESS_LABEL } from "@/lib/resume-utils";

type ResumeOverviewBlockProps = {
  resume: Pick<
    Resume,
    | "title"
    | "company"
    | "matchScore"
    | "atsStatus"
    | "tags"
    | "warnings"
    | "content"
    | "technicalSkills"
    | "softSkills"
  >;
  compact?: boolean;
};

export function ResumeOverviewBlock({
  resume,
  compact = false,
}: ResumeOverviewBlockProps) {
  return (
    <div
      className={
        compact
          ? "space-y-3"
          : "space-y-4 rounded-xl border border-border bg-muted/30 p-6"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="vs-badge vs-badge-accent">
          {resume.matchScore}% {RESUME_COMPLETENESS_LABEL.toLowerCase()}
        </span>
        <span className="vs-badge bg-muted text-muted-foreground">
          ATS: {resume.atsStatus}
        </span>
        {(resume.warnings?.length ?? 0) > 0 ? (
          <span className="vs-badge vs-badge-warning">
            {resume.warnings!.length} gap
            {resume.warnings!.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">{resume.company}</p>

      {resume.tags.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Trending: {resume.tags.join(" · ")}
        </p>
      ) : null}

      {!compact &&
      ((resume.technicalSkills?.length ?? 0) > 0 ||
        (resume.softSkills?.length ?? 0) > 0) ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {(resume.technicalSkills ?? []).slice(0, 6).map((skill) => (
            <span
              key={`t-${skill}`}
              className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {skill}
            </span>
          ))}
          {(resume.softSkills ?? []).slice(0, 4).map((skill) => (
            <span
              key={`s-${skill}`}
              className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
