"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCertificates,
  getCurrentUserProfile,
  getExperiences,
  getGithubSyncedData,
  getLatestTranscript,
} from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";
import type { Experience } from "@/types/auth";
import type { Certificate } from "@/types/certificate";

function sortExperiences(experiences: Experience[]): Experience[] {
  return [...experiences].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  );
}

export function useGithubSyncedQuery() {
  return useQuery({
    queryKey: queryKeys.profile.github(),
    queryFn: async () => {
      try {
        return await getGithubSyncedData();
      } catch {
        return null;
      }
    },
  });
}

export function useLatestTranscriptQuery() {
  return useQuery({
    queryKey: queryKeys.profile.transcriptLatest(),
    queryFn: async () => {
      try {
        return await getLatestTranscript();
      } catch {
        return null;
      }
    },
  });
}

export function useUserProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: getCurrentUserProfile,
  });
}

export function useExperiencesQuery() {
  return useQuery({
    queryKey: queryKeys.profile.experiences(),
    queryFn: getExperiences,
    select: sortExperiences,
  });
}

function sortCertificates(certificates: Certificate[]): Certificate[] {
  return [...certificates].sort((a, b) => {
    const aDate = a.issue_date ?? a.created_at;
    const bDate = b.issue_date ?? b.created_at;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
}

export function useCertificatesQuery() {
  return useQuery({
    queryKey: queryKeys.profile.certificates(),
    queryFn: getCertificates,
    select: sortCertificates,
  });
}

export function useInvalidateProfileQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all }),
    invalidateProfile: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() }),
    invalidateGithub: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.github() }),
    invalidateTranscript: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.transcriptLatest(),
      }),
    invalidateExperiences: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.experiences(),
      }),
    invalidateCertificates: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.certificates(),
      }),
    invalidateDataHub: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dataHub.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.profile.transcriptLatest(),
        }),
      ]),
  };
}
