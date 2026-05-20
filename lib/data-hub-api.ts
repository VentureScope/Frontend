import api from "@/lib/api";
import type { CVUploadResponse } from "@/lib/auth-api";
import type { TranscriptListResponse } from "@/types/transcript";

export async function listTranscripts(): Promise<TranscriptListResponse> {
  const res = await api.get<TranscriptListResponse>("/api/transcripts/");
  return res.data;
}

export async function getCvPresignedUrl(
  expiration = 3600,
): Promise<string | null> {
  const res = await api.get<{ url?: string; cv_url?: string }>(
    "/api/users/me/cv/url",
    { params: { expiration } },
  );
  return res.data.url ?? res.data.cv_url ?? null;
}

export async function deleteCurrentUserCv(): Promise<void> {
  await api.delete("/api/users/me/cv");
}

export type { CVUploadResponse };
