import { getResume, listResumes } from "@/lib/resume-api";
import type { GeneratedResumeOut } from "@/types/generated-resume";

export async function fetchResumesList(): Promise<GeneratedResumeOut[]> {
  return listResumes();
}

export async function fetchResumeDetail(
  resumeId: string,
): Promise<GeneratedResumeOut> {
  return getResume(resumeId);
}
