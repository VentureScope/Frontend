"use client";

import { Settings2, Download } from "lucide-react";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";

function resumeMetaLine(resume: Resume): string {
  const parts = [
    resume.company,
    ...resume.tags,
    ...(resume.trendingSkills ?? []).slice(0, 2),
  ].filter(Boolean);
  return parts.slice(0, 5).join(" · ") || "AI-generated resume";
}

type ResumePreviewProps = {
  resume: Resume;
};

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const { content } = resume;
  const hasTechnical = (resume.technicalSkills?.length ?? 0) > 0;
  const hasSoft = (resume.softSkills?.length ?? 0) > 0;
  const hasFlatSkills = content.skills.length > 0;

  return (
    <div className="resume-print-surface w-full max-w-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] lg:rounded-xl">
      <div className="space-y-8 p-5 pb-6 sm:space-y-10 sm:p-8 sm:pb-7 lg:space-y-12 lg:p-12 lg:pb-8 xl:p-14">
        <div className="space-y-4 text-center sm:space-y-6">
          <h2 className="wrap-break-word text-2xl font-semibold uppercase leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[38px] lg:leading-none">
            {resume.title}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:gap-x-4 sm:text-[11px]">
            <span className="wrap-break-word max-w-md text-center">
              {resumeMetaLine(resume)}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <h4 className="border-b border-border pb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Professional Profile
          </h4>
          <p className="text-[13.5px] font-medium leading-relaxed text-muted-foreground sm:text-[14.5px]">
            {content.summary}
          </p>
        </div>

        {(hasTechnical || hasSoft || hasFlatSkills) && (
          <div className="space-y-5">
            <h4 className="border-b border-border pb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Technical Stack
            </h4>
            {hasTechnical ? (
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Technical
                </p>
                <div className="grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
                  {resume.technicalSkills!.map((skill) => (
                    <span
                      key={skill}
                      className="text-[13px] font-bold text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {hasSoft ? (
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Soft skills
                </p>
                <div className="grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
                  {resume.softSkills!.map((skill) => (
                    <span
                      key={skill}
                      className="text-[13px] font-bold text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {!hasTechnical && !hasSoft && hasFlatSkills ? (
              <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
                {content.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[13px] font-bold text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <div className="space-y-8">
          <h4 className="border-b border-border pb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Experience
          </h4>
          {content.experience.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No experience entries yet.
            </p>
          ) : (
            <div className="space-y-10">
              {content.experience.map((job) => (
                <div key={job.id} className="space-y-4">
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <h5 className="wrap-break-word text-[15px] font-bold text-foreground sm:text-[15.5px]">
                      {job.company} — {job.role}
                    </h5>
                    {job.duration ? (
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {job.duration}
                      </span>
                    ) : null}
                  </div>
                  {job.description.length > 0 ? (
                    <ul className="space-y-2 pl-4">
                      {job.description.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="list-disc text-[13.5px] leading-relaxed text-muted-foreground"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {content.projects.length > 0 ? (
          <div className="space-y-8">
            <h4 className="border-b border-border pb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Projects
            </h4>
            <div className="space-y-8">
              {content.projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <h5 className="text-[15px] font-bold text-foreground">
                    {project.name}
                  </h5>
                  {project.description ? (
                    <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  ) : null}
                  {project.technologies.length > 0 ? (
                    <p className="text-xs font-medium text-primary">
                      {project.technologies.join(" · ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-8">
          <h4 className="border-b border-border pb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Education
          </h4>
          {content.education.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No education entries yet.
            </p>
          ) : (
            <div className="space-y-10">
              {content.education.map((edu) => (
                <div key={edu.id} className="space-y-2">
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <h5 className="wrap-break-word text-[15px] font-bold text-foreground sm:text-[15.5px]">
                      {edu.degree}
                      {edu.field ? ` — ${edu.field}` : ""}
                    </h5>
                    {edu.year ? (
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {edu.year}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[13.5px] text-muted-foreground">
                    {edu.school}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {content.certifications.length > 0 ? (
          <div className="space-y-8">
            <h4 className="border-b border-border pb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Certifications
            </h4>
            <ul className="space-y-3">
              {content.certifications.map((cert) => (
                <li
                  key={cert.id}
                  className="text-[13.5px] text-muted-foreground"
                >
                  <span className="font-bold text-foreground">{cert.name}</span>
                  {[cert.issuer, cert.year].filter(Boolean).length > 0
                    ? ` — ${[cert.issuer, cert.year].filter(Boolean).join(", ")}`
                    : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="no-print flex flex-col gap-3 border-t border-border/50 p-5 pt-5 sm:flex-row sm:gap-4 sm:p-8 sm:pt-6 lg:p-12 xl:p-14">
        <button
          type="button"
          className="flex h-12 flex-1 items-center justify-center gap-3 rounded-lg bg-muted text-xs font-bold text-primary shadow-sm transition-colors hover:bg-muted sm:h-14 sm:text-sm"
        >
          <Settings2 size={18} strokeWidth={2.5} />
          Change Template
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex h-12 flex-[1.4] items-center justify-center gap-3 rounded-md bg-primary text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:h-14 sm:text-sm"
        >
          <Download size={18} strokeWidth={2.5} />
          Export PDF
        </button>
      </div>
    </div>
  );
}
