"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Download,
  GraduationCap,
  Layers,
  Loader2,
  Save,
  Target,
  Trash2,
  Award,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EditableResumeDocument } from "@/components/resume/EditableResumeDocument";
import { ResumeExportPreviewModal } from "@/components/resume/ResumeExportPreviewModal";
import { ResumeWarningsBanner } from "@/components/resume/ResumeWarningsBanner";
import { ResumeDetailSkeleton } from "@/components/resume/ResumeSkeletons";
import {
  deleteResume,
  getResume,
  updateResume,
} from "@/lib/resume-api";
import { buildResumeSectionPatch } from "@/lib/resume-editor-mappers";
import { generatedResumeToListingResume } from "@/lib/map-generated-resume-to-ui";
import {
  computeAtsLabel,
  computeResumeMatchScore,
  formatResumeSubtitle,
  RESUME_COMPLETENESS_LABEL,
  resumeSectionCounts,
} from "@/lib/resume-utils";
import { getApiErrorMessage } from "@/lib/auth-api";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import type { GeneratedResumeOut, ResumeEditorSection } from "@/types/generated-resume";
import { cn } from "@/lib/utils";

const SECTIONS: {
  id: ResumeEditorSection;
  label: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    id: "target",
    label: "Role & summary",
    description: "Headline and opening paragraph on your CV",
    icon: <Target className="h-4 w-4" />,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Technical, soft, and market-highlighted skills",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Roles, companies, dates, and bullet highlights",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: "education",
    label: "Education",
    description: "Degrees and institutions",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Portfolio and side projects",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    id: "certifications",
    label: "Certifications",
    description: "Licenses and credentials",
    icon: <Award className="h-4 w-4" />,
  },
];

function sectionCount(resume: Resume, id: ResumeEditorSection): number {
  const c = resume.content;
  switch (id) {
    case "experience":
      return c.experience.length;
    case "education":
      return c.education.length;
    case "projects":
      return c.projects.length;
    case "certifications":
      return c.certifications.length;
    case "skills":
      return (
        (resume.technicalSkills?.length ?? 0) + (resume.softSkills?.length ?? 0)
      );
    case "target":
      return resume.content.summary.trim().length > 0 ? 1 : 0;
    default:
      return 0;
  }
}

function applyApiToResume(api: GeneratedResumeOut): Resume {
  return generatedResumeToListingResume(api);
}

function refreshScores(resume: Resume, api: GeneratedResumeOut): Resume {
  const matchScore = computeResumeMatchScore(api);
  return {
    ...resume,
    matchScore,
    atsStatus: computeAtsLabel(api, matchScore),
    company: formatResumeSubtitle(api),
  };
}

export function ResumeEditorWorkspace({ resumeId }: { resumeId: string }) {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [apiResume, setApiResume] = useState<GeneratedResumeOut | null>(null);
  const [activeSection, setActiveSection] =
    useState<ResumeEditorSection>("target");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [exportPreviewOpen, setExportPreviewOpen] = useState(false);
  const resumeRef = useRef<Resume | null>(null);

  useEffect(() => {
    resumeRef.current = resume;
  }, [resume]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const api = await getResume(resumeId);
      setApiResume(api);
      setResume(applyApiToResume(api));
      setDirty(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setResume(null);
      setApiResume(null);
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const el = document.querySelector(`[data-section="${activeSection}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeSection]);

  const handleResumeChange = useCallback((next: Resume) => {
    resumeRef.current = next;
    setResume(next);
    setDirty(true);
  }, []);

  const flushActiveFieldEdits = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
  }, []);

  const handleOpenExportPreview = useCallback(() => {
    flushActiveFieldEdits();
    window.setTimeout(() => setExportPreviewOpen(true), 0);
  }, [flushActiveFieldEdits]);

  const handleSave = useCallback(async () => {
    if (!resumeRef.current) {
      return;
    }
    flushActiveFieldEdits();
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    const current = resumeRef.current;
    if (!current) {
      return;
    }
    setSaving(true);
    try {
      const patch = buildResumeSectionPatch(activeSection, current);
      const updated = await updateResume(resumeId, patch);
      setApiResume(updated);
      setResume(refreshScores(applyApiToResume(updated), updated));
      setDirty(false);
      toast.success("Saved to your resume.");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }, [activeSection, resumeId, flushActiveFieldEdits]);

  const handleDelete = useCallback(async () => {
    if (
      !window.confirm(
        "Delete this resume permanently? This cannot be undone.",
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await deleteResume(resumeId);
      toast.success("Resume deleted.");
      router.push("/dashboard/resume-builder");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }, [resumeId, router]);

  const sectionMeta = useMemo(() => {
    if (!apiResume) {
      return null;
    }
    return resumeSectionCounts(apiResume);
  }, [apiResume]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <ResumeDetailSkeleton />
      </div>
    );
  }

  if (!resume || !apiResume) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <h1 className="text-2xl font-bold text-foreground">Resume not found</h1>
        <Link
          href="/dashboard/resume-builder"
          className="mt-4 text-primary hover:underline"
        >
          Back to Resume Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              href="/dashboard/resume-builder"
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0">
              <p className="text-label text-primary">Resume editor</p>
              <h1 className="truncate text-lg font-bold text-foreground sm:text-xl">
                {resume.title}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Updated {resume.lastUpdated}</span>
                <span className="hidden sm:inline">·</span>
                <span className="vs-badge vs-badge-accent text-[10px]">
                  {resume.matchScore}% {RESUME_COMPLETENESS_LABEL.toLowerCase()}
                </span>
                <span className="vs-badge bg-muted text-[10px] text-muted-foreground">
                  ATS {resume.atsStatus}
                </span>
                {sectionMeta ? (
                  <span>
                    {sectionMeta.experience} exp · {sectionMeta.skills} skills
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {dirty ? (
              <span className="rounded-md bg-warning/15 px-2 py-1 text-xs font-medium text-warning">
                Unsaved changes
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">All changes saved</span>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive"
              disabled={deleting || saving}
              onClick={() => void handleDelete()}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-2"
              disabled={saving || !dirty}
              onClick={() => void handleSave()}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!resume}
              onClick={handleOpenExportPreview}
            >
              <Download className="h-4 w-4" />
              Preview &amp; export
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
        {resume.warnings && resume.warnings.length > 0 ? (
          <div className="mb-6">
            <ResumeWarningsBanner warnings={resume.warnings} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-8">
          <aside className="lg:sticky lg:top-[5.5rem] lg:self-start">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sections
            </p>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Select a section to edit it directly on your CV. Click Save when
              finished.
            </p>
            <nav
              className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
              aria-label="Resume sections"
            >
              {SECTIONS.map((item) => {
                const count = sectionCount(resume, item.id);
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "flex min-w-[140px] items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors lg:min-w-0 lg:w-full",
                      active
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                    )}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {count > 0 ? (
                      <span className="rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] tabular-nums">
                        {count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-3 sm:p-5 lg:p-6">
              <EditableResumeDocument
                resume={resume}
                activeSection={activeSection}
                onChange={handleResumeChange}
                disabled={saving}
              />
            </div>
          </div>
        </div>
      </div>

      <ResumeExportPreviewModal
        open={exportPreviewOpen}
        onOpenChange={setExportPreviewOpen}
        resume={resumeRef.current ?? resume}
      />
    </div>
  );
}
