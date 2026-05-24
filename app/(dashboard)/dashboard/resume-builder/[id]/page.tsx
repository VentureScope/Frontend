"use client";

import { use } from "react";
import { ResumeEditorWorkspace } from "@/components/resume/ResumeEditorWorkspace";

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ResumeEditorWorkspace resumeId={id} />;
}
