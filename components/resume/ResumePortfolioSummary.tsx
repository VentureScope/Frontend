"use client";

import Link from "next/link";
import { AlertTriangle, FileText } from "lucide-react";
import {
  buildResumePortfolioSummary,
  RESUME_COMPLETENESS_LABEL,
} from "@/lib/resume-utils";
import type { GeneratedResumeOut } from "@/types/generated-resume";

export function ResumePortfolioSummary({
  resumes,
}: {
  resumes: GeneratedResumeOut[];
}) {
  const summary = buildResumePortfolioSummary(resumes);

  if (!summary) {
    return (
      <div className="vs-band h-fit rounded-lg p-6">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          Your resumes
        </h3>
        <p className="vs-band-muted mt-3 text-sm leading-relaxed">
          Generate a resume from a target role to see it here. Each version is
          saved from your profile, transcript, GitHub, and CV data.
        </p>
        <Link
          href="/dashboard/resume-builder/new-resume"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Create your first resume
        </Link>
      </div>
    );
  }

  return (
    <div className="vs-band h-fit rounded-lg p-6">
      <h3 className="flex items-center gap-2 font-semibold text-foreground">
        <FileText className="h-4 w-4 text-primary" />
        Portfolio summary
      </h3>
      <p className="vs-band-muted mt-2 text-xs leading-relaxed">
        Counts and scores come from your saved resumes in this app.{" "}
        {RESUME_COMPLETENESS_LABEL} measures how many sections are filled—not
        employer job-match results.
      </p>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Saved resumes</dt>
          <dd className="font-semibold tabular-nums">{summary.count}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Target roles</dt>
          <dd className="text-right font-semibold">
            {summary.uniqueRoles}
            {summary.roleExamples.length > 0 ? (
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                {summary.roleExamples.join(", ")}
                {summary.uniqueRoles > summary.roleExamples.length
                  ? "…"
                  : ""}
              </span>
            ) : null}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">
            Avg {RESUME_COMPLETENESS_LABEL.toLowerCase()}
          </dt>
          <dd className="font-semibold tabular-nums text-primary">
            {summary.avgCompleteness}%
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Experience entries</dt>
          <dd className="font-semibold tabular-nums">
            {summary.totalExperienceEntries}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Avg skills listed</dt>
          <dd className="font-semibold tabular-nums">
            {summary.avgSkillsPerResume}
          </dd>
        </div>
        {summary.withWarnings > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              Profile gaps
            </dt>
            <dd className="font-semibold tabular-nums">
              {summary.withWarnings} resume
              {summary.withWarnings === 1 ? "" : "s"}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 border-t border-border/60 pt-4">
        <p className="text-xs font-semibold text-muted-foreground">
          Most complete
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {summary.strongestTitle}
        </p>
        <p className="text-xs text-primary">
          {summary.strongestScore}% {RESUME_COMPLETENESS_LABEL.toLowerCase()}
        </p>
      </div>

      {summary.withWarnings > 0 ? (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Open a resume with gaps to see links to your profile and data hub.
        </p>
      ) : null}
    </div>
  );
}
