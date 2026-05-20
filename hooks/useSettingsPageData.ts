"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentUserProfile,
  getExperiences,
  getGithubSyncedData,
  getLatestTranscript,
  retryUserEmbedding,
} from "@/lib/auth-api";
import {
  buildDataHubSources,
  computeHubCompletionPercent,
  type DataHubSourceStatus,
} from "@/lib/data-hub-utils";
import type { AuthUser, Experience } from "@/types/auth";
import type { GitHubSyncedDataResponse } from "@/types/github";
import type { TranscriptResponse } from "@/types/transcript";

export function useSettingsPageData() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [github, setGithub] = useState<GitHubSyncedDataResponse | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [embeddingLoading, setEmbeddingLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, githubRes, transcriptRes, expRes] =
        await Promise.allSettled([
          getCurrentUserProfile(),
          getGithubSyncedData(),
          getLatestTranscript(),
          getExperiences(),
        ]);

      setProfile(
        profileRes.status === "fulfilled" ? profileRes.value : null,
      );
      setGithub(githubRes.status === "fulfilled" ? githubRes.value : null);
      setTranscript(
        transcriptRes.status === "fulfilled" ? transcriptRes.value : null,
      );
      setExperiences(
        expRes.status === "fulfilled" ? expRes.value : [],
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
    reload: load,
    setProfile,
    retryEmbedding,
    embeddingLoading,
  };
}
