"use client";

import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import { ResumeSectionEditor } from "@/components/resume/ResumeSectionEditor";
import {
  cvActiveSectionRing,
  cvInactiveSection,
} from "@/components/resume/resume-cv-styles";
import type { ResumeEditorSection } from "@/types/generated-resume";
import { cn } from "@/lib/utils";

function ResumeSectionHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="border-b border-border pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
      {children}
    </h4>
  );
}

function CvSection({
  sectionId,
  activeSection,
  label,
  show,
  children,
}: {
  sectionId: ResumeEditorSection;
  activeSection: ResumeEditorSection;
  label: string;
  show: boolean;
  children: ReactNode;
}) {
  if (!show) {
    return null;
  }

  const isActive = activeSection === sectionId;

  return (
    <div
      className={cn(
        isActive ? cvActiveSectionRing : cvInactiveSection,
        !isActive && "cursor-default",
      )}
      data-section={sectionId}
    >
      {isActive ? (
        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
          <Pencil className="h-3 w-3" />
          Editing {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}

type EditableResumeDocumentProps = {
  resume: Resume;
  activeSection: ResumeEditorSection;
  onChange: (next: Resume) => void;
  disabled?: boolean;
};

export function EditableResumeDocument({
  resume,
  activeSection,
  onChange,
  disabled,
}: EditableResumeDocumentProps) {
  const { content } = resume;
  const summary = content.summary.trim();
  const hasTechnical = (resume.technicalSkills?.length ?? 0) > 0;
  const hasSoft = (resume.softSkills?.length ?? 0) > 0;
  const hasFlatSkills = content.skills.length > 0;
  const hasSkills = hasTechnical || hasSoft || hasFlatSkills;

  const showSkills =
    activeSection === "skills" || hasSkills;
  const showProjects =
    activeSection === "projects" || content.projects.length > 0;
  const showCerts =
    activeSection === "certifications" ||
    content.certifications.length > 0;

  return (
    <div className="resume-print-surface mx-auto w-full max-w-[210mm] overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className="space-y-7 p-6 sm:p-8 sm:space-y-8 lg:p-10">
        <CvSection
          sectionId="target"
          activeSection={activeSection}
          label="role & summary"
          show
        >
          {activeSection === "target" ? (
            <header className="space-y-3 border-b border-border pb-6 text-left">
              <ResumeSectionEditor
                section="target"
                resume={resume}
                onChange={onChange}
                disabled={disabled}
                variant="cv"
              />
            </header>
          ) : (
            <header className="space-y-3 border-b border-border pb-6 text-left">
              <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-[28px]">
                {resume.title}
              </h2>
              {summary ? (
                <p className="text-[14px] leading-[1.65] text-foreground/90 sm:text-[15px]">
                  {summary}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No summary yet
                </p>
              )}
            </header>
          )}
        </CvSection>

        <CvSection
          sectionId="skills"
          activeSection={activeSection}
          label="skills"
          show={showSkills}
        >
          {activeSection === "skills" ? (
            <section className="space-y-4">
              <ResumeSectionHeading>Skills</ResumeSectionHeading>
              <ResumeSectionEditor
                section="skills"
                resume={resume}
                onChange={onChange}
                disabled={disabled}
                variant="cv"
              />
            </section>
          ) : (
            <section className="space-y-4">
              <ResumeSectionHeading>Skills</ResumeSectionHeading>
              {hasTechnical ? (
                <p className="text-[13px] leading-relaxed text-foreground">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Technical:{" "}
                  </span>
                  {resume.technicalSkills!.join(" · ")}
                </p>
              ) : null}
              {hasSoft ? (
                <p className="text-[13px] leading-relaxed text-foreground">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Interpersonal:{" "}
                  </span>
                  {resume.softSkills!.join(" · ")}
                </p>
              ) : null}
            </section>
          )}
        </CvSection>

        <CvSection
          sectionId="experience"
          activeSection={activeSection}
          label="experience"
          show
        >
          {activeSection === "experience" ? (
            <section className="space-y-4">
              <ResumeSectionHeading>Experience</ResumeSectionHeading>
              <ResumeSectionEditor
                section="experience"
                resume={resume}
                onChange={onChange}
                disabled={disabled}
                variant="cv"
              />
            </section>
          ) : (
            <section className="space-y-5">
              <ResumeSectionHeading>Experience</ResumeSectionHeading>
              {content.experience.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No experience listed.
                </p>
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
                          <span className="text-[11px] font-semibold text-muted-foreground">
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
          )}
        </CvSection>

        <CvSection
          sectionId="projects"
          activeSection={activeSection}
          label="projects"
          show={showProjects}
        >
          {activeSection === "projects" ? (
            <section className="space-y-4">
              <ResumeSectionHeading>Projects</ResumeSectionHeading>
              <ResumeSectionEditor
                section="projects"
                resume={resume}
                onChange={onChange}
                disabled={disabled}
                variant="cv"
              />
            </section>
          ) : (
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
                  </article>
                ))}
              </div>
            </section>
          )}
        </CvSection>

        <CvSection
          sectionId="education"
          activeSection={activeSection}
          label="education"
          show
        >
          {activeSection === "education" ? (
            <section className="space-y-4">
              <ResumeSectionHeading>Education</ResumeSectionHeading>
              <ResumeSectionEditor
                section="education"
                resume={resume}
                onChange={onChange}
                disabled={disabled}
                variant="cv"
              />
            </section>
          ) : (
            <section className="space-y-5">
              <ResumeSectionHeading>Education</ResumeSectionHeading>
              {content.education.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No education listed.
                </p>
              ) : (
                <div className="space-y-5">
                  {content.education.map((edu) => (
                    <article key={edu.id} className="space-y-0.5">
                      <h5 className="text-[15px] font-bold text-foreground">
                        {edu.degree}
                        {edu.field ? ` — ${edu.field}` : ""}
                      </h5>
                      <p className="text-[13px] text-muted-foreground">
                        {edu.school}
                        {edu.year ? ` · ${edu.year}` : ""}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </CvSection>

        <CvSection
          sectionId="certifications"
          activeSection={activeSection}
          label="certifications"
          show={showCerts}
        >
          {activeSection === "certifications" ? (
            <section className="space-y-4">
              <ResumeSectionHeading>Certifications</ResumeSectionHeading>
              <ResumeSectionEditor
                section="certifications"
                resume={resume}
                onChange={onChange}
                disabled={disabled}
                variant="cv"
              />
            </section>
          ) : (
            <section className="space-y-4">
              <ResumeSectionHeading>Certifications</ResumeSectionHeading>
              <ul className="space-y-2">
                {content.certifications.map((cert) => (
                  <li
                    key={cert.id}
                    className="text-[13px] text-muted-foreground"
                  >
                    <span className="font-bold text-foreground">
                      {cert.name}
                    </span>
                    {[cert.issuer, cert.year].filter(Boolean).length > 0
                      ? ` — ${[cert.issuer, cert.year].filter(Boolean).join(", ")}`
                      : null}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </CvSection>
      </div>
    </div>
  );
}
