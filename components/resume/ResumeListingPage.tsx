"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResumeListSkeleton } from "@/components/resume/ResumeSkeletons";
import { listResumes } from "@/lib/resume-api";
import { generatedResumeToListingResume } from "@/lib/map-generated-resume-to-ui";
import { aggregateResumeAnalytics } from "@/lib/resume-utils";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import type { GeneratedResumeOut } from "@/types/generated-resume";
import { toast } from "sonner";

export default function ResumeListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"my-resumes" | "analytics">(
    "my-resumes",
  );
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [rawResumes, setRawResumes] = useState<GeneratedResumeOut[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await listResumes();
        if (!cancelled) {
          setRawResumes(list);
          setResumes(list.map(generatedResumeToListingResume));
        }
      } catch {
        if (!cancelled) {
          toast.error("Could not load resumes.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.content.summary.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const analytics = useMemo(
    () => aggregateResumeAnalytics(rawResumes),
    [rawResumes],
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

          <div className="mt-6 flex gap-6 border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab("my-resumes")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === "my-resumes"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Resumes ({resumes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === "analytics"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Analytics
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {loading ? (
              <ResumeListSkeleton />
            ) : activeTab === "analytics" ? (
              <div className="vs-band max-w-lg rounded-lg p-6">
                <h3 className="font-semibold">Portfolio analytics</h3>
                {analytics ? (
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Resumes</dt>
                      <dd className="font-semibold">{analytics.count}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Avg match score</dt>
                      <dd className="font-semibold text-primary">
                        {analytics.avgMatch}%
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">
                        Avg skills per resume
                      </dt>
                      <dd className="font-semibold">
                        {analytics.avgSkillsPerResume}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">
                        With profile gaps
                      </dt>
                      <dd className="font-semibold">
                        {analytics.withWarnings}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="vs-band-muted mt-2 text-sm">
                    Generate a resume to see analytics.
                  </p>
                )}
              </div>
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
                              Match
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
                              className="rounded p-1.5 transition-colors hover:bg-muted"
                              aria-label="More options"
                            >
                              <MoreVertical className="h-5 w-5 text-muted-foreground" />
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
                              className="flex-1 rounded-md border border-primary/25 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/dashboard/resume-builder/${resume.id}`,
                                )
                              }
                              className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              Edit
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

                <div className="vs-band h-fit rounded-lg p-6">
                  <h3 className="font-semibold">Impact Analysis</h3>
                  <p className="vs-band-muted mt-2 text-xs">
                    Scores are computed from your resume sections: summary,
                    experience, education, projects, skills, and profile
                    warnings.
                  </p>
                  {analytics ? (
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold vs-band-muted">
                          Average match
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="mr-2 h-2 w-full rounded-full bg-inverse-foreground/20">
                            <div
                              className="h-full rounded-lg bg-primary transition-all"
                              style={{ width: `${analytics.avgMatch}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-success">
                            {analytics.avgMatch}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs vs-band-muted">
                        {analytics.count} resume
                        {analytics.count === 1 ? "" : "s"} · ~
                        {analytics.avgSkillsPerResume} skills each
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs vs-band-muted">
                      Create a resume to see impact metrics.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
