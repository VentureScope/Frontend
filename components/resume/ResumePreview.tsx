"use client";

import type { ReactNode } from "react";
import { Settings2, Download } from "lucide-react";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import { cn } from "@/lib/utils";

function sectionMetaLine(resume: Resume): string {
  const exp = resume.content.experience.length;
  const edu = resume.content.education.length;
  const proj = resume.content.projects.length;
  const parts: string[] = [];
  if (exp > 0) {
    parts.push(`${exp} role${exp === 1 ? "" : "s"}`);
  }
  if (edu > 0) {
    parts.push(`${edu} education`);
  }
  if (proj > 0) {
    parts.push(`${proj} project${proj === 1 ? "" : "s"}`);
  }
  return parts.join(" · ");
}

function ResumeSectionHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="border-b border-border pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
      {children}
    </h4>
  );
}

type ResumePreviewProps = {
  resume: Resume;
  hideActions?: boolean;
  /** Clean PDF/export layout — no editor hints or empty-section placeholders */
  forExport?: boolean;
  className?: string;
};

export default function ResumePreview({
  resume,
  hideActions = false,
  forExport = false,
  className,
}: ResumePreviewProps) {
  const { content } = resume;
  const summary = content.summary.trim();
  const meta = sectionMetaLine(resume);
  const hasTechnical = (resume.technicalSkills?.length ?? 0) > 0;
  const hasSoft = (resume.softSkills?.length ?? 0) > 0;
  const hasFlatSkills = content.skills.length > 0;
  const hasSkills = hasTechnical || hasSoft || hasFlatSkills;

  return (
    <div
      className={cn(
        "resume-print-surface mx-auto w-full max-w-[210mm] rounded-xl border border-border bg-card shadow-lg",
        forExport ? "overflow-visible" : "overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "space-y-7 sm:space-y-8",
          forExport ? "p-8" : "p-6 sm:p-8 lg:p-10",
        )}
      >
        {/* CV header: position + summary (no separate “profile” block) */}
        <header className="space-y-3 border-b border-border pb-6 text-left">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-[28px]">
            {resume.title}
          </h2>
          {summary ? (
            <p className="max-w-none text-[14px] leading-[1.65] text-foreground/90 sm:text-[15px]">
              {summary}
            </p>
          ) : forExport ? null : (
            <p className="text-sm italic text-muted-foreground">
              Add a professional summary under Role &amp; summary in the editor.
            </p>
          )}
          {meta && !forExport ? (
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {meta}
            </p>
          ) : null}
        </header>

        {hasSkills ? (
          <section className="space-y-4">
            <ResumeSectionHeading>Skills</ResumeSectionHeading>
            {hasTechnical ? (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Technical
                </p>
                <p className="text-[13px] leading-relaxed text-foreground">
                  {resume.technicalSkills!.join(" · ")}
                </p>
              </div>
            ) : null}
            {hasSoft ? (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Interpersonal
                </p>
                <p className="text-[13px] leading-relaxed text-foreground">
                  {resume.softSkills!.join(" · ")}
                </p>
              </div>
            ) : null}
            {!hasTechnical && !hasSoft && hasFlatSkills ? (
              <p className="text-[13px] leading-relaxed text-foreground">
                {content.skills.join(" · ")}
              </p>
            ) : null}
            {(resume.trendingSkills?.length ?? 0) > 0 ? (
              <p className="text-xs text-muted-foreground">
                Market-highlighted: {resume.trendingSkills!.join(", ")}
              </p>
            ) : null}
          </section>
        ) : null}

        {content.experience.length > 0 || !forExport ? (
        <section className="space-y-5">
          <ResumeSectionHeading>Experience</ResumeSectionHeading>
          {content.experience.length === 0 ? (
            forExport ? null : (
            <p className="text-sm text-muted-foreground">No experience listed.</p>
            )
          ) : (
            <div className="space-y-6">
              {content.experience.map((job) => (
                <article key={job.id} className="space-y-2">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <h5 className="text-[15px] font-bold text-foreground">
                      {job.role}
                      <span className="font-semibold text-muted-foreground">
                        {" "}
                        · {job.company}
                      </span>
                    </h5>
                    {job.duration ? (
                      <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                        {job.duration}
                      </span>
                    ) : null}
                  </div>
                  {job.description.length > 0 ? (
                    <ul className="space-y-1.5 pl-4">
                      {job.description.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="list-disc text-[13px] leading-relaxed text-muted-foreground"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
        ) : null}

        {content.projects.length > 0 ? (
          <section className="space-y-5">
            <ResumeSectionHeading>Projects</ResumeSectionHeading>
            <div className="space-y-5">
              {content.projects.map((project) => (
                <article key={project.id} className="space-y-1.5">
                  <h5 className="text-[15px] font-bold text-foreground">
                    {project.name}
                  </h5>
                  {project.description ? (
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  ) : null}
                  {project.technologies.length > 0 ? (
                    <p className="text-xs font-medium text-primary">
                      {project.technologies.join(" · ")}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {content.education.length > 0 || !forExport ? (
        <section className="space-y-5">
          <ResumeSectionHeading>Education</ResumeSectionHeading>
          {content.education.length === 0 ? (
            forExport ? null : (
            <p className="text-sm text-muted-foreground">No education listed.</p>
            )
          ) : (
            <div className="space-y-5">
              {content.education.map((edu) => (
                <article key={edu.id} className="space-y-0.5">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <h5 className="text-[15px] font-bold text-foreground">
                      {edu.degree}
                      {edu.field ? (
                        <span className="font-medium text-muted-foreground">
                          {" "}
                          — {edu.field}
                        </span>
                      ) : null}
                    </h5>
                    {edu.year ? (
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        {edu.year}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[13px] text-muted-foreground">{edu.school}</p>
                </article>
              ))}
            </div>
          )}
        </section>
        ) : null}

        {content.certifications.length > 0 ? (
          <section className="space-y-4">
            <ResumeSectionHeading>Certifications</ResumeSectionHeading>
            <ul className="space-y-2">
              {content.certifications.map((cert) => (
                <li
                  key={cert.id}
                  className="text-[13px] leading-relaxed text-muted-foreground"
                >
                  <span className="font-bold text-foreground">{cert.name}</span>
                  {[cert.issuer, cert.year].filter(Boolean).length > 0
                    ? ` — ${[cert.issuer, cert.year].filter(Boolean).join(", ")}`
                    : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {!hideActions ? (
        <div className="no-print flex flex-col gap-3 border-t border-border/50 p-6 sm:flex-row">
          <button
            type="button"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-muted text-sm font-semibold text-primary"
          >
            <Settings2 size={16} />
            Change Template
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-11 flex-[1.4] items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      ) : null}
    </div>
  );
}
