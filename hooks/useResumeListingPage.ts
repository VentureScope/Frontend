"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useResumesListQuery } from "@/hooks/queries/use-resumes-list-query";
import { deleteResume } from "@/lib/resume-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { generatedResumeToListingResume } from "@/lib/map-generated-resume-to-ui";
import { queryKeys } from "@/lib/query-keys";
import type { GeneratedResumeOut } from "@/types/generated-resume";

export function useResumeListingPage() {
  const queryClient = useQueryClient();
  const listQuery = useResumesListQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (listQuery.isError) {
      toast.error("Could not load resumes.");
    }
  }, [listQuery.isError]);

  const rawResumes = listQuery.data ?? [];
  const resumes = useMemo(
    () => rawResumes.map(generatedResumeToListingResume),
    [rawResumes],
  );

  const filteredResumes = useMemo(
    () =>
      resumes.filter(
        (resume) =>
          resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resume.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resume.content.summary
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [resumes, searchQuery],
  );

  const handleDelete = useCallback(
    async (id: string, title: string) => {
      if (
        !window.confirm(`Delete “${title}” permanently? This cannot be undone.`)
      ) {
        return;
      }
      setDeletingId(id);
      try {
        await deleteResume(id);
        toast.success("Resume deleted.");
        queryClient.setQueryData<GeneratedResumeOut[]>(
          queryKeys.resumes.list(),
          (prev) => prev?.filter((r) => r.id !== id) ?? [],
        );
        queryClient.removeQueries({ queryKey: queryKeys.resumes.detail(id) });
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      } finally {
        setDeletingId(null);
      }
    },
    [queryClient],
  );

  const cardsLoading = listQuery.isPending && rawResumes.length === 0;
  const portfolioLoading = cardsLoading;

  return {
    searchQuery,
    setSearchQuery,
    rawResumes,
    resumes,
    filteredResumes,
    deletingId,
    handleDelete,
    cardsLoading,
    portfolioLoading,
    isEmpty:
      !cardsLoading && listQuery.isSuccess && filteredResumes.length === 0,
    hasNoResumes: !cardsLoading && listQuery.isSuccess && resumes.length === 0,
  };
}
