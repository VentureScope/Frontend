"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { retryUserEmbedding } from "@/lib/auth-api";
import {
  buildDataHubSources,
  computeHubCompletionPercent,
  type DataHubSourceStatus,
} from "@/lib/data-hub-utils";
import {
  useExperiencesQuery,
  useGithubSyncedQuery,
  useLatestTranscriptQuery,
  useUserProfileQuery,
} from "@/hooks/queries/use-profile-queries";
import { queryKeys } from "@/lib/query-keys";
import type { AuthUser } from "@/types/auth";

export function useSettingsPageData() {
  const queryClient = useQueryClient();
  const profileQuery = useUserProfileQuery();
  const githubQuery = useGithubSyncedQuery();
  const transcriptQuery = useLatestTranscriptQuery();
  const experiencesQuery = useExperiencesQuery();
  const [embeddingLoading, setEmbeddingLoading] = useState(false);

  const loading =
    profileQuery.isPending ||
    githubQuery.isPending ||
    transcriptQuery.isPending ||
    experiencesQuery.isPending;

  const profile = profileQuery.data ?? null;
  const github = githubQuery.data ?? null;
  const transcript = transcriptQuery.data ?? null;
  const experiences = experiencesQuery.data ?? [];

  const sources: DataHubSourceStatus[] = useMemo(
    () =>
      buildDataHubSources({
        github,
        transcript,
        profile,
        experiences,
      }),
    [github, transcript, profile, experiences],
  );

  const completionPercent = useMemo(
    () => computeHubCompletionPercent(sources),
    [sources],
  );

  const reload = useCallback(async () => {
    await Promise.all([
      profileQuery.refetch(),
      githubQuery.refetch(),
      transcriptQuery.refetch(),
      experiencesQuery.refetch(),
    ]);
  }, [profileQuery, githubQuery, transcriptQuery, experiencesQuery]);

  const setProfile = useCallback(
    (next: AuthUser | null) => {
      queryClient.setQueryData(queryKeys.profile.me(), next);
    },
    [queryClient],
  );

  const retryEmbedding = useCallback(async () => {
    setEmbeddingLoading(true);
    try {
      const res = await retryUserEmbedding();
      return res.message;
    } finally {
      setEmbeddingLoading(false);
    }
  }, []);

  return {
    loading,
    profile,
    github,
    transcript,
    experiences,
    sources,
    completionPercent,
    reload,
    setProfile,
    retryEmbedding,
    embeddingLoading,
  };
}
