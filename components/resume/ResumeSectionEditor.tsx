"use client";

import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import { ListDraftTextarea } from "@/components/resume/ListDraftTextarea";
import {
  highlightsToText,
  parseCommaList,
  technologiesToText,
  textToHighlights,
} from "@/lib/resume-editor-mappers";
import type { ResumeEditorSection } from "@/types/generated-resume";
import {
  cvEntryCard,
  cvHeadlineInput,
  cvInlineInput,
  cvInlineTextarea,
  cvSummaryTextarea,
} from "@/components/resume/resume-cv-styles";

const textareaClass =
  "flex min-h-[88px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

function Field({
  label,
  children,
  hideLabel,
}: {
  label: string;
  children: ReactNode;
  hideLabel?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {hideLabel ? (
        <Label className="sr-only">{label}</Label>
      ) : (
        <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      )}
      {children}
    </div>
  );
}

export function ResumeSectionEditor({
  section,
  resume,
  onChange,
  disabled,
  variant = "form",
}: {
  section: ResumeEditorSection;
  resume: Resume;
  onChange: (next: Resume) => void;
  disabled?: boolean;
  /** `cv` = inline on the document; `form` = separate panel */
  variant?: "form" | "cv";
}) {
  const onCv = variant === "cv";
  const inputCls = onCv ? cvInlineInput : "";
  const areaCls = onCv ? cvInlineTextarea : textareaClass;
  const entryCls = onCv ? cvEntryCard : "space-y-3 rounded-xl border border-border bg-muted/20 p-4";
  const patch = (updater: (r: Resume) => Resume) => {
    if (!disabled) {
      onChange(updater(resume));
    }
  };

  if (section === "target") {
    return (
      <div className={onCv ? "space-y-4" : "space-y-5"}>
        <Field label="Target role" hideLabel={onCv}>
          {onCv ? (
            <input
              className={cvHeadlineInput}
              value={resume.title}
              onChange={(e) =>
                patch((r) => ({ ...r, title: e.target.value }))
              }
              disabled={disabled}
              placeholder="Target role headline"
              aria-label="Target role"
            />
          ) : (
            <Input
              value={resume.title}
              onChange={(e) =>
                patch((r) => ({ ...r, title: e.target.value }))
              }
              disabled={disabled}
              placeholder="e.g. Senior Software Engineer"
            />
          )}
        </Field>
        <Field label="Professional summary" hideLabel={onCv}>
          <textarea
            className={onCv ? cvSummaryTextarea : textareaClass}
            rows={onCv ? 5 : 7}
            value={resume.content.summary}
            onChange={(e) =>
              patch((r) => ({
                ...r,
                content: { ...r.content, summary: e.target.value },
              }))
            }
            disabled={disabled}
            placeholder="Professional summary — appears directly under your headline"
            aria-label="Professional summary"
          />
        </Field>
      </div>
    );
  }

  if (section === "skills") {
    return (
      <div className="space-y-4">
        <Field label="Technical skills" hideLabel={onCv}>
          <ListDraftTextarea
            className={areaCls}
            rows={3}
            items={resume.technicalSkills ?? []}
            toText={(items) => items.join(", ")}
            parse={parseCommaList}
            onCommit={(technical) =>
              patch((r) => ({
                ...r,
                technicalSkills: technical,
                content: {
                  ...r.content,
                  skills: [...technical, ...(r.softSkills ?? [])],
                },
              }))
            }
            disabled={disabled}
            placeholder="Technical skills, comma-separated"
            aria-label="Technical skills"
          />
        </Field>
        <Field label="Soft skills" hideLabel={onCv}>
          <ListDraftTextarea
            className={areaCls}
            rows={2}
            items={resume.softSkills ?? []}
            toText={(items) => items.join(", ")}
            parse={parseCommaList}
            onCommit={(soft) => patch((r) => ({ ...r, softSkills: soft }))}
            disabled={disabled}
            placeholder="Soft skills, comma-separated"
            aria-label="Soft skills"
          />
        </Field>
        <Field label="Market-highlighted skills" hideLabel={onCv}>
          <ListDraftTextarea
            className={areaCls}
            rows={2}
            items={resume.trendingSkills ?? []}
            toText={(items) => items.join(", ")}
            parse={parseCommaList}
            onCommit={(trending) =>
              patch((r) => ({
                ...r,
                trendingSkills: trending,
                tags: trending.slice(0, 4),
              }))
            }
            disabled={disabled}
            placeholder="Market-highlighted skills (optional)"
            aria-label="Market-highlighted skills"
          />
        </Field>
      </div>
    );
  }

  if (section === "experience") {
    return (
      <div className="space-y-4">
        {resume.content.experience.map((exp, index) => (
          <div key={exp.id} className={entryCls}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                Role {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:text-destructive"
                disabled={disabled}
                onClick={() =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      experience: r.content.experience.filter(
                        (e) => e.id !== exp.id,
                      ),
                    },
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Company" hideLabel={onCv}>
                <Input
                  className={onCv ? inputCls : undefined}
                  value={exp.company}
                  onChange={(e) =>
                    patch((r) => ({
                      ...r,
                      content: {
                        ...r.content,
                        experience: r.content.experience.map((x) =>
                          x.id === exp.id
                            ? { ...x, company: e.target.value }
                            : x,
                        ),
                      },
                    }))
                  }
                  disabled={disabled}
                />
              </Field>
              <Field label="Role title" hideLabel={onCv}>
                <Input
                  className={onCv ? inputCls : undefined}
                  value={exp.role}
                  onChange={(e) =>
                    patch((r) => ({
                      ...r,
                      content: {
                        ...r.content,
                        experience: r.content.experience.map((x) =>
                          x.id === exp.id
                            ? { ...x, role: e.target.value }
                            : x,
                        ),
                      },
                    }))
                  }
                  disabled={disabled}
                />
              </Field>
            </div>
            <Field label="Duration" hideLabel={onCv}>
              <Input
                className={onCv ? inputCls : undefined}
                value={exp.duration}
                onChange={(e) =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      experience: r.content.experience.map((x) =>
                        x.id === exp.id
                          ? { ...x, duration: e.target.value }
                          : x,
                      ),
                    },
                  }))
                }
                disabled={disabled}
                placeholder="2022 – Present"
              />
            </Field>
            <Field label="Highlights" hideLabel={onCv}>
              <ListDraftTextarea
                className={areaCls}
                rows={4}
                items={exp.description}
                toText={highlightsToText}
                parse={textToHighlights}
                onCommit={(description) =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      experience: r.content.experience.map((x) =>
                        x.id === exp.id ? { ...x, description } : x,
                      ),
                    },
                  }))
                }
                disabled={disabled}
                aria-label="Experience highlights"
              />
            </Field>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={disabled}
          onClick={() =>
            patch((r) => ({
              ...r,
              content: {
                ...r.content,
                experience: [
                  ...r.content.experience,
                  {
                    id: `exp-${Date.now()}`,
                    company: "",
                    role: "",
                    duration: "",
                    description: [],
                  },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" />
          Add experience
        </Button>
      </div>
    );
  }

  if (section === "education") {
    return (
      <div className="space-y-4">
        {resume.content.education.map((edu, index) => (
          <div key={edu.id} className={entryCls}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Education {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                disabled={disabled}
                onClick={() =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      education: r.content.education.filter(
                        (e) => e.id !== edu.id,
                      ),
                    },
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Field label="Institution" hideLabel={onCv}>
              <Input
                className={onCv ? inputCls : undefined}
                value={edu.school}
                onChange={(e) =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      education: r.content.education.map((x) =>
                        x.id === edu.id ? { ...x, school: e.target.value } : x,
                      ),
                    },
                  }))
                }
                disabled={disabled}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Degree" hideLabel={onCv}>
                <Input
                  className={onCv ? inputCls : undefined}
                  value={edu.degree}
                  onChange={(e) =>
                    patch((r) => ({
                      ...r,
                      content: {
                        ...r.content,
                        education: r.content.education.map((x) =>
                          x.id === edu.id
                            ? { ...x, degree: e.target.value }
                            : x,
                        ),
                      },
                    }))
                  }
                  disabled={disabled}
                />
              </Field>
              <Field label="Field of study" hideLabel={onCv}>
                <Input
                  className={onCv ? inputCls : undefined}
                  value={edu.field ?? ""}
                  onChange={(e) =>
                    patch((r) => ({
                      ...r,
                      content: {
                        ...r.content,
                        education: r.content.education.map((x) =>
                          x.id === edu.id
                            ? { ...x, field: e.target.value }
                            : x,
                        ),
                      },
                    }))
                  }
                  disabled={disabled}
                />
              </Field>
            </div>
            <Field label="Year" hideLabel={onCv}>
              <Input
                className={onCv ? inputCls : undefined}
                value={edu.year}
                onChange={(e) =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      education: r.content.education.map((x) =>
                        x.id === edu.id ? { ...x, year: e.target.value } : x,
                      ),
                    },
                  }))
                }
                disabled={disabled}
              />
            </Field>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={disabled}
          onClick={() =>
            patch((r) => ({
              ...r,
              content: {
                ...r.content,
                education: [
                  ...r.content.education,
                  {
                    id: `edu-${Date.now()}`,
                    degree: "",
                    school: "",
                    year: "",
                  },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" />
          Add education
        </Button>
      </div>
    );
  }

  if (section === "projects") {
    return (
      <div className="space-y-4">
        {resume.content.projects.map((proj, index) => (
          <div key={proj.id} className={entryCls}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Project {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                disabled={disabled}
                onClick={() =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      projects: r.content.projects.filter(
                        (p) => p.id !== proj.id,
                      ),
                    },
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Field label="Name" hideLabel={onCv}>
              <Input
                className={onCv ? inputCls : undefined}
                value={proj.name}
                onChange={(e) =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      projects: r.content.projects.map((x) =>
                        x.id === proj.id ? { ...x, name: e.target.value } : x,
                      ),
                    },
                  }))
                }
                disabled={disabled}
              />
            </Field>
            <Field label="Description" hideLabel={onCv}>
              <textarea
                className={areaCls}
                rows={3}
                value={proj.description}
                onChange={(e) =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      projects: r.content.projects.map((x) =>
                        x.id === proj.id
                          ? { ...x, description: e.target.value }
                          : x,
                      ),
                    },
                  }))
                }
                disabled={disabled}
              />
            </Field>
            <Field label="Technologies" hideLabel={onCv}>
              <ListDraftTextarea
                className={onCv ? inputCls : areaCls}
                rows={onCv ? 2 : 2}
                items={proj.technologies}
                toText={technologiesToText}
                parse={parseCommaList}
                onCommit={(technologies) =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      projects: r.content.projects.map((x) =>
                        x.id === proj.id ? { ...x, technologies } : x,
                      ),
                    },
                  }))
                }
                disabled={disabled}
                placeholder="Technologies, comma-separated"
                aria-label="Project technologies"
              />
            </Field>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={disabled}
          onClick={() =>
            patch((r) => ({
              ...r,
              content: {
                ...r.content,
                projects: [
                  ...r.content.projects,
                  {
                    id: `proj-${Date.now()}`,
                    name: "",
                    description: "",
                    technologies: [],
                  },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" />
          Add project
        </Button>
      </div>
    );
  }

  if (section === "certifications") {
    return (
      <div className="space-y-4">
        {resume.content.certifications.map((cert, index) => (
          <div key={cert.id} className={entryCls}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Certification {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                disabled={disabled}
                onClick={() =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      certifications: r.content.certifications.filter(
                        (c) => c.id !== cert.id,
                      ),
                    },
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Field label="Name" hideLabel={onCv}>
              <Input
                className={onCv ? inputCls : undefined}
                value={cert.name}
                onChange={(e) =>
                  patch((r) => ({
                    ...r,
                    content: {
                      ...r.content,
                      certifications: r.content.certifications.map((x) =>
                        x.id === cert.id ? { ...x, name: e.target.value } : x,
                      ),
                    },
                  }))
                }
                disabled={disabled}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Issuer" hideLabel={onCv}>
                <Input
                  className={onCv ? inputCls : undefined}
                  value={cert.issuer ?? ""}
                  onChange={(e) =>
                    patch((r) => ({
                      ...r,
                      content: {
                        ...r.content,
                        certifications: r.content.certifications.map((x) =>
                          x.id === cert.id
                            ? { ...x, issuer: e.target.value }
                            : x,
                        ),
                      },
                    }))
                  }
                  disabled={disabled}
                />
              </Field>
              <Field label="Year" hideLabel={onCv}>
                <Input
                  className={onCv ? inputCls : undefined}
                  value={cert.year ?? ""}
                  onChange={(e) =>
                    patch((r) => ({
                      ...r,
                      content: {
                        ...r.content,
                        certifications: r.content.certifications.map((x) =>
                          x.id === cert.id
                            ? { ...x, year: e.target.value }
                            : x,
                        ),
                      },
                    }))
                  }
                  disabled={disabled}
                />
              </Field>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={disabled}
          onClick={() =>
            patch((r) => ({
              ...r,
              content: {
                ...r.content,
                certifications: [
                  ...r.content.certifications,
                  { id: `cert-${Date.now()}`, name: "" },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" />
          Add certification
        </Button>
      </div>
    );
  }

  return null;
}
