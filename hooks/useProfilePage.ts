"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useExperiencesQuery,
  useGithubSyncedQuery,
  useLatestTranscriptQuery,
  useUserProfileQuery,
} from "@/hooks/queries/use-profile-queries";
import {
  getReadinessQueryError,
  useRefreshUserReadiness,
  useUserReadinessQuery,
} from "@/hooks/queries/use-readiness-query";
import { queryKeys } from "@/lib/query-keys";
import { useAppStore } from "@/store/useAppStore";
import type { AuthUser } from "@/types/auth";
import type { UserReadiness } from "@/types/readiness";

export type ProfilePageLoading = {
  header: boolean;
  personal: boolean;
  connected: boolean;
  skills: boolean;
  cv: boolean;
  interests: boolean;
  readiness: boolean;
};

export function useProfilePage() {
  const queryClient = useQueryClient();
  const setAuthData = useAppStore((state) => state.setAuthData);

  const profileQuery = useUserProfileQuery();
  const githubQuery = useGithubSyncedQuery();
  const transcriptQuery = useLatestTranscriptQuery();
  const experiencesQuery = useExperiencesQuery();
  const readinessQuery = useUserReadinessQuery();
  const refreshUserReadiness = useRefreshUserReadiness();

  const [refreshingReadiness, setRefreshingReadiness] = useState(false);

  const profile = profileQuery.data ?? null;
  const github = githubQuery.data ?? null;
  const transcript = transcriptQuery.data ?? null;
  const readiness = readinessQuery.data ?? null;

  useEffect(() => {
    if (!profile) {
      return;
    }
    const session = useAppStore.getState().authData;
    setAuthData({
      ...session,
      user: profile,
    });
  }, [profile, setAuthData]);

  const loading = useMemo<ProfilePageLoading>(
    () => ({
      header: profileQuery.isPending,
      personal: profileQuery.isPending,
      connected: githubQuery.isPending || transcriptQuery.isPending,
      skills: profileQuery.isPending || githubQuery.isPending,
      cv: profileQuery.isPending,
      interests: profileQuery.isPending,
      readiness: readinessQuery.isPending,
    }),
    [
      profileQuery.isPending,
      githubQuery.isPending,
      transcriptQuery.isPending,
      readinessQuery.isPending,
    ],
  );

  const setProfile = useCallback(
    (next: AuthUser | null) => {
      queryClient.setQueryData(queryKeys.profile.me(), next);
      if (next) {
        const session = useAppStore.getState().authData;
        setAuthData({
          ...session,
          user: next,
        });
      }
    },
    [queryClient, setAuthData],
  );

  const reload = useCallback(async () => {
    await Promise.all([
      profileQuery.refetch(),
      githubQuery.refetch(),
      transcriptQuery.refetch(),
      experiencesQuery.refetch(),
      readinessQuery.refetch(),
    ]);
  }, [
    profileQuery,
    githubQuery,
    transcriptQuery,
    experiencesQuery,
    readinessQuery,
  ]);

  const refreshReadiness = useCallback(async (): Promise<UserReadiness> => {
    setRefreshingReadiness(true);
    try {
      return await refreshUserReadiness();
    } finally {
      setRefreshingReadiness(false);
    }
  }, [refreshUserReadiness]);

  const readinessError = getReadinessQueryError(readinessQuery.error);

  return {
    loading,
    profile,
    github,
    transcript,
    readiness,
    readinessError,
    refreshingReadiness,
    reload,
    setProfile,
    refreshReadiness,
  };
}
