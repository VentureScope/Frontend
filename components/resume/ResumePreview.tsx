"use client";

import { Settings2, Download } from "lucide-react";
import { mockResumes, Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";

function resumeMetaLine(resume: Resume): string {
  const parts = [resume.company, ...resume.tags].filter(Boolean);
  return parts.slice(0, 4).join(" · ") || "Professional profile";
}

export default function ResumePreview({ resume = mockResumes[0] }: { resume?: Resume }) {
  if (!resume) return null;

  return (
    <div className="resume-print-surface w-full max-w-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] lg:rounded-xl">
      {/* 1. Main Resume Paper Content */}
      <div className="space-y-8 p-5 pb-6 sm:space-y-10 sm:p-8 sm:pb-7 lg:space-y-12 lg:p-12 lg:pb-8 xl:p-14">
        {/* Header Section */}
        <div className="space-y-4 text-center sm:space-y-6">
          <h2 className="wrap-break-word text-2xl font-semibold uppercase leading-tight tracking-tight text-foreground print:text-foreground sm:text-3xl lg:text-[38px] lg:leading-none">
            {resume.title}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:gap-x-4 sm:text-[11px]">
            <span className="wrap-break-word text-center max-w-md">
              {resumeMetaLine(resume)}
            </span>
          </div>
        </div>

        {/* Section: Professional Profile */}
        <div className="space-y-5">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] border-b border-border pb-2.5">
            Professional Profile
          </h4>
          <p className="text-[13.5px] font-medium leading-relaxed text-muted-foreground sm:text-[14.5px]">
            {resume.content.summary}
          </p>
        </div>

        {/* Section: Technical Stack */}
        <div className="space-y-5">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] border-b border-border pb-2.5">
            Technical Stack
          </h4>
          <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
            {resume.content.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 text-[13px] font-bold"
              >
                <span className="wrap-break-word text-foreground">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Experience */}
        <div className="space-y-8">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] border-b border-border pb-2.5">
            Experience
          </h4>
          <div className="space-y-10">
            {resume.content.experience.map((job) => (
              <div key={job.id} className="space-y-4">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h5 className="wrap-break-word text-[15px] font-bold text-foreground print:text-foreground sm:text-[15.5px]">
                    {job.company} — {job.role}
                  </h5>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {job.duration}
                  </span>
                </div>
                <ul className="space-y-2 pl-4">
                  {job.description.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-[13.5px] text-muted-foreground leading-relaxed list-disc"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Education */}
        <div className="space-y-8">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] border-b border-border pb-2.5">
            Education
          </h4>
          <div className="space-y-10">
            {resume.content.education.map((edu) => (
              <div key={edu.id} className="space-y-4">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h5 className="wrap-break-word text-[15px] font-bold text-foreground print:text-foreground sm:text-[15.5px]">
                    {edu.degree}
                  </h5>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {edu.year}
                  </span>
                </div>
                <ul className="space-y-2 pl-4">
                  <li className="text-[13.5px] text-muted-foreground leading-relaxed list-disc">
                    {edu.school}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
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

