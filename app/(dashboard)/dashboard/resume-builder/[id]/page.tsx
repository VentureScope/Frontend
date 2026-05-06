"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResumePreview from "@/components/resume/ResumePreview";
import { mockResumes } from "../mockData";

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  
  const resume = mockResumes.find(r => r.id === id);

  if (!resume) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900">Resume Not Found</h1>
        <Link href="/dashboard/resume-builder" className="mt-4 text-blue-600 hover:underline">
          Go back to Resume Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/dashboard/resume-builder"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {resume.title}
            </h1>
            <p className="text-sm font-medium text-slate-400">
              {resume.company}
            </p>
          </div>
        </div>

        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
