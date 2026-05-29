"use client";

import { useCallback, useMemo } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
  getTranscriptConfig,
  uploadCurrentUserCv,
} from "@/lib/auth-api";
import { listTranscripts } from "@/lib/data-hub-api";
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
import type { GitHubSyncedDataResponse } from "@/types/github";
import type {
  TranscriptConfigResponse,
  TranscriptListResponse,
  TranscriptResponse,
} from "@/types/transcript";

export function useDataHub() {
  const queryClient = useQueryClient();
  const githubQuery = useGithubSyncedQuery();
  const transcriptQuery = useLatestTranscriptQuery();
  const profileQuery = useUserProfileQuery();
  const experiencesQuery = useExperiencesQuery();

  const [transcriptListQuery, configQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.dataHub.transcriptList(),
        queryFn: listTranscripts,
      },
      {
        queryKey: queryKeys.dataHub.transcriptConfig(),
        queryFn: getTranscriptConfig,
      },
    ],
  });

  const loading =
    githubQuery.isPending ||
    transcriptQuery.isPending ||
    profileQuery.isPending ||
    experiencesQuery.isPending ||
    transcriptListQuery.isPending ||
    configQuery.isPending;

  const github = githubQuery.data ?? null;
  const transcript = transcriptQuery.data ?? null;
  const transcriptList = transcriptListQuery.data ?? null;
  const config = configQuery.data ?? null;
  const profile = profileQuery.data ?? null;
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
      githubQuery.refetch(),
      transcriptQuery.refetch(),
      profileQuery.refetch(),
      experiencesQuery.refetch(),
      transcriptListQuery.refetch(),
      configQuery.refetch(),
    ]);
  }, [
    githubQuery,
    transcriptQuery,
    profileQuery,
    experiencesQuery,
    transcriptListQuery,
    configQuery,
  ]);

  const refreshProfile = useCallback(async () => {
    await Promise.all([profileQuery.refetch(), experiencesQuery.refetch()]);
  }, [profileQuery, experiencesQuery]);

  const uploadCv = useCallback(
    async (file: File) => {
      const result = await uploadCurrentUserCv(file);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.profile.me(),
      });
      return result;
    },
    [queryClient],
  );

  const setTranscript = useCallback(
    (next: TranscriptResponse | null) => {
      queryClient.setQueryData(queryKeys.profile.transcriptLatest(), next);
    },
    [queryClient],
  );

  const setGithub = useCallback(
    (next: GitHubSyncedDataResponse | null) => {
      queryClient.setQueryData(queryKeys.profile.github(), next);
    },
    [queryClient],
  );

  return {
    loading,
    github,
    transcript,
    transcriptList,
    config,
    profile,
    experiences,
    sources,
    completionPercent,
    reload,
    refreshProfile,
    uploadCv,
    setTranscript,
    setGithub,
  };
}
