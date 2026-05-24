"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResumeListSkeleton } from "@/components/resume/ResumeSkeletons";
import { ResumePortfolioSummary } from "@/components/resume/ResumePortfolioSummary";
import { deleteResume, listResumes } from "@/lib/resume-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { generatedResumeToListingResume } from "@/lib/map-generated-resume-to-ui";
import { RESUME_COMPLETENESS_LABEL } from "@/lib/resume-utils";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import type { GeneratedResumeOut } from "@/types/generated-resume";
import { toast } from "sonner";

export default function ResumeListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [rawResumes, setRawResumes] = useState<GeneratedResumeOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const loadResumes = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listResumes();
      setRawResumes(list);
      setResumes(list.map(generatedResumeToListingResume));
    } catch {
      toast.error("Could not load resumes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResumes();
  }, [loadResumes]);

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(`Delete “${title}” permanently? This cannot be undone.`)
    ) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteResume(id);
      toast.success("Resume deleted.");
      await loadResumes();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.content.summary.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-primary/[0.04] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="text-label text-primary">Career documents</p>
              <h1 className="text-h1 text-foreground">Resume Builder</h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Construct your professional narrative using AI-optimized
                frameworks. Resumes are generated from your profile, GitHub, and
                transcript data.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/resume-builder/new-resume")
              }
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90 sm:px-8 sm:py-3 sm:text-base"
            >
              <span>+</span>
              Create New CV
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resumes…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none"
                />
              </div>
            </div>
          </div>

          {resumes.length > 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {resumes.length} saved resume{resumes.length === 1 ? "" : "s"}
            </p>
          ) : null}

          <div className="mt-6 space-y-6">
            {loading ? (
              <ResumeListSkeleton />
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  {filteredResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="vs-surface overflow-hidden transition-colors hover:border-primary/20"
                    >
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-6">
                        <div className="w-full shrink-0 sm:w-32 lg:w-40">
                          <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-md border border-primary/15 bg-primary/5 p-3">
                            <p className="text-center text-2xl font-bold text-primary">
                              {resume.matchScore}%
                            </p>
                            <p className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {RESUME_COMPLETENESS_LABEL}
                            </p>
                            <p className="text-center text-[10px] text-muted-foreground">
                              ATS {resume.atsStatus}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="mb-2 flex flex-wrap gap-2">
                                {resume.isRecent && (
                                  <span className="vs-badge vs-badge-warning">
                                    Recent
                                  </span>
                                )}
                                {(resume.warnings?.length ?? 0) > 0 && (
                                  <span className="vs-badge vs-badge-warning">
                                    {resume.warnings!.length} profile gap
                                    {resume.warnings!.length === 1 ? "" : "s"}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-bold text-foreground sm:text-xl">
                                {resume.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {resume.company}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Updated {resume.lastUpdated}
                              </p>
                              {resume.content.summary ? (
                                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                  {resume.content.summary}
                                </p>
                              ) : null}
                              {resume.tags.length > 0 && (
                                <p className="mt-2 text-xs text-primary">
                                  {resume.tags.join(" · ")}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                              aria-label={`Delete ${resume.title}`}
                              disabled={deletingId === resume.id}
                              onClick={() =>
                                void handleDelete(resume.id, resume.title)
                              }
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/dashboard/resume-builder/${resume.id}`,
                                )
                              }
                              className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              Edit resume
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredResumes.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      {resumes.length === 0 ? (
                        <>
                          No resumes yet.{" "}
                          <button
                            type="button"
                            className="text-primary underline"
                            onClick={() =>
                              router.push(
                                "/dashboard/resume-builder/new-resume",
                              )
                            }
                          >
                            Create your first CV
                          </button>
                        </>
                      ) : (
                        "No resumes match your search."
                      )}
                    </div>
                  )}
                </div>

                <ResumePortfolioSummary resumes={rawResumes} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
