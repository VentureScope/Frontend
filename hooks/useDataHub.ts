"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentUserProfile,
  getExperiences,
  getGithubSyncedData,
  getLatestTranscript,
  getTranscriptConfig,
  uploadCurrentUserCv,
} from "@/lib/auth-api";
import { listTranscripts } from "@/lib/data-hub-api";
import {
  buildDataHubSources,
  computeHubCompletionPercent,
  type DataHubSourceStatus,
} from "@/lib/data-hub-utils";
import type { AuthUser, Experience } from "@/types/auth";
import type { GitHubSyncedDataResponse } from "@/types/github";
import type {
  TranscriptConfigResponse,
  TranscriptListResponse,
  TranscriptResponse,
} from "@/types/transcript";

export function useDataHub() {
  const [loading, setLoading] = useState(true);
  const [github, setGithub] = useState<GitHubSyncedDataResponse | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [transcriptList, setTranscriptList] =
    useState<TranscriptListResponse | null>(null);
  const [config, setConfig] = useState<TranscriptConfigResponse | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [
        githubResult,
        transcriptResult,
        listResult,
        configResult,
        profileResult,
        experiencesResult,
      ] = await Promise.allSettled([
        getGithubSyncedData(),
        getLatestTranscript(),
        listTranscripts(),
        getTranscriptConfig(),
        getCurrentUserProfile(),
        getExperiences(),
      ]);

      setGithub(
        githubResult.status === "fulfilled" ? githubResult.value : null,
      );
      setTranscript(
        transcriptResult.status === "fulfilled" ? transcriptResult.value : null,
      );
      setTranscriptList(
        listResult.status === "fulfilled" ? listResult.value : null,
      );
      setConfig(configResult.status === "fulfilled" ? configResult.value : null);
      setProfile(
        profileResult.status === "fulfilled" ? profileResult.value : null,
      );
      setExperiences(
        experiencesResult.status === "fulfilled"
          ? experiencesResult.value
          : [],
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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

  const refreshProfile = useCallback(async () => {
    const [nextProfile, nextExperiences] = await Promise.all([
      getCurrentUserProfile(),
      getExperiences(),
    ]);
    setProfile(nextProfile);
    setExperiences(nextExperiences);
  }, []);

  const uploadCv = useCallback(
    async (file: File) => {
      const result = await uploadCurrentUserCv(file);
      await refreshProfile();
      return result;
    },
    [refreshProfile],
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
    reload: load,
    refreshProfile,
    uploadCv,
    setTranscript,
    setGithub,
  };
}
