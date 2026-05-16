import api from "@/lib/api";
import type { GeneratedResumeOut } from "@/types/generated-resume";

export async function generateResume(targetRole: string): Promise<GeneratedResumeOut> {
  const res = await api.post<GeneratedResumeOut>("/api/resume/generate", {
    target_role: targetRole,
  });
  return res.data;
}

export async function listResumes(): Promise<GeneratedResumeOut[]> {
  const res = await api.get<GeneratedResumeOut[]>("/api/resume");
  return res.data;
}

export async function getResume(resumeId: string): Promise<GeneratedResumeOut> {
  const res = await api.get<GeneratedResumeOut>(`/api/resume/${resumeId}`);
  return res.data;
}
