"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResumePreview from "@/components/resume/ResumePreview";
import { getResume } from "@/lib/resume-api";
import { generatedResumeToListingResume } from "@/lib/map-generated-resume-to-ui";
import type { Resume } from "../mockData";
import { ResumeDetailSkeleton } from "@/components/resume/ResumeSkeletons";
import { toast } from "sonner";

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const api = await getResume(id);
        if (!cancelled) {
          setResume(generatedResumeToListingResume(api));
        }
      } catch {
        if (!cancelled) {
          toast.error("Could not load resume.");
          setResume(null);
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <ResumeDetailSkeleton />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/dashboard/resume-builder"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{resume.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">
              Updated {resume.lastUpdated}
            </p>
          </div>
        </div>

        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
