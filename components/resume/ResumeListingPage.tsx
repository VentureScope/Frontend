"use client";

import { useEffect, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResumeListSkeleton } from "@/components/resume/ResumeSkeletons";
import { listResumes } from "@/lib/resume-api";
import { generatedResumeToListingResume } from "@/lib/map-generated-resume-to-ui";
import type { Resume } from "@/app/(dashboard)/dashboard/resume-builder/mockData";
import { toast } from "sonner";

export default function ResumeListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-resumes");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await listResumes();
        if (!cancelled) {
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
      resume.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-primary/[0.04] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="text-label text-primary">Career documents</p>
              <h1 className="text-h1 text-foreground">Resume Builder</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Construct your professional narrative using AI-optimized
                <br className="hidden sm:block" />
                frameworks. Our curator ensures your experience aligns with
                high-growth market demands.
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
                  className="w-full rounded-lg bg-muted pl-10 pr-4 py-2.5 text-sm border border-border placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg bg-muted p-2.5 hover:bg-muted/80 transition-colors"
            >
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.5 1.5H3a1.5 1.5 0 00-1.5 1.5v16A1.5 1.5 0 003 20.5h18a1.5 1.5 0 001.5-1.5V10.5m-9-8v8m0 0H3m6.5 0h8"
                />
              </svg>
            </button>
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
              My Resumes
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
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {filteredResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="vs-surface overflow-hidden transition-colors hover:border-primary/20"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                        <div className="flex-shrink-0 w-full sm:w-32 lg:w-40">
                          <div className="flex aspect-[3/4] items-center justify-center rounded-md border border-primary/15 bg-primary/5">
                            <p className="px-2 text-center text-xs text-muted-foreground">
                              Resume Preview
                            </p>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              {resume.isRecent && (
                                <span className="vs-badge vs-badge-warning mb-2">Recent</span>
                              )}
                              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                {resume.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {resume.company}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Last updated {resume.lastUpdated}
                              </p>
                              {resume.tags.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {resume.tags.join(" · ")}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              className="p-1.5 hover:bg-muted rounded transition-colors"
                            >
                              <MoreVertical className="h-5 w-5 text-muted-foreground" />
                            </button>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase">
                                Match Score
                              </p>
                              <p className="mt-1 text-2xl font-bold text-primary">
                                {resume.matchScore}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase">
                                ATS Optimization
                              </p>
                              <p className="mt-1 text-base font-bold text-foreground">
                                {resume.atsStatus || "Pending"}
                              </p>
                            </div>
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
                    <div className="text-center py-12 text-muted-foreground">
                      No resumes yet.{" "}
                      <button
                        type="button"
                        className="text-primary underline"
                        onClick={() =>
                          router.push("/dashboard/resume-builder/new-resume")
                        }
                      >
                        Create your first CV
                      </button>
                    </div>
                  )}
                </div>

                <div className="vs-band h-fit rounded-lg p-6">
                  <h3 className="font-semibold">Impact Analysis</h3>
                  <p className="vs-band-muted mt-2 text-xs">
                    Live scoring uses your generated resume payload (skills,
                    highlights, trending tags).
                  </p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold vs-band-muted">
                        Visibility Factor
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="mr-2 h-2 w-full rounded-full bg-inverse-foreground/20">
                          <div className="h-full w-3/4 rounded-lg bg-primary" />
                        </div>
                        <span className="text-xs font-semibold text-success">
                          +12%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


