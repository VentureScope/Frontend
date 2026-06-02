"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchResumeDetail } from "@/lib/queries/resumes";

export function useResumeDetailQuery(
  resumeId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.resumes.detail(resumeId),
    queryFn: () => fetchResumeDetail(resumeId),
    enabled: options?.enabled ?? Boolean(resumeId),
  });
}
