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
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                Resume Builder
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
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
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-blue-700 transition-colors whitespace-nowrap"
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
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resumes…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 pl-10 pr-4 py-2.5 text-sm border border-slate-200 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg bg-slate-100 p-2.5 hover:bg-slate-200 transition-colors"
            >
              <svg
                className="h-5 w-5 text-slate-600"
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

          <div className="mt-6 flex gap-6 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("my-resumes")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === "my-resumes"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Resumes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === "analytics"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
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
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                        <div className="flex-shrink-0 w-full sm:w-32 lg:w-40">
                          <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <div className="text-slate-400 text-xs text-center px-2">
                              Resume Preview
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              {resume.isRecent && (
                                <div className="inline-block rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 mb-2">
                                  RECENT
                                </div>
                              )}
                              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                {resume.title}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {resume.company}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Last updated {resume.lastUpdated}
                              </p>
                              {resume.tags.length > 0 && (
                                <p className="text-xs text-slate-600 mt-2">
                                  {resume.tags.join(" · ")}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                            >
                              <MoreVertical className="h-5 w-5 text-slate-400" />
                            </button>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase">
                                Match Score
                              </p>
                              <p className="mt-1 text-2xl font-bold text-blue-600">
                                {resume.matchScore}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase">
                                ATS Optimization
                              </p>
                              <p className="mt-1 text-base font-bold text-slate-900">
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
                              className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
                              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredResumes.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No resumes yet.{" "}
                      <button
                        type="button"
                        className="text-blue-600 underline"
                        onClick={() =>
                          router.push("/dashboard/resume-builder/new-resume")
                        }
                      >
                        Create your first CV
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm h-fit">
                  <h3 className="font-bold">Impact Analysis</h3>
                  <p className="mt-2 text-xs text-slate-400">
                    Live scoring uses your generated resume payload (skills,
                    highlights, trending tags).
                  </p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Visibility Factor
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="h-2 w-full rounded-full bg-slate-700 mr-2">
                          <div className="h-full w-3/4 rounded-full bg-blue-500" />
                        </div>
                        <span className="text-xs font-semibold text-green-400">
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
