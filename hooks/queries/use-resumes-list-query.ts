"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchResumesList } from "@/lib/queries/resumes";

/** Saved resumes list (shared with dashboard overview). */
export function useResumesListQuery() {
  return useQuery({
    queryKey: queryKeys.resumes.list(),
    queryFn: fetchResumesList,
  });
}
