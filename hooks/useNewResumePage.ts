"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTrendingCareersQuery } from "@/hooks/queries/use-trending-careers-query";
import { useMarketAnalyticsPeriod } from "@/hooks/useMarketAnalyticsPeriod";
import { ROADMAP_ROLE_PICKER_LIMIT } from "@/lib/queries/constants";
import { generateResume } from "@/lib/resume-api";
import { mapTrendingToRoleRows } from "@/lib/trending-role-rows";
import { queryKeys } from "@/lib/query-keys";
import { formatResumeWarningSummary } from "@/lib/resume-warning-links";

export function useNewResumePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { days, lookbackPhrase } = useMarketAnalyticsPeriod();
  const limit = ROADMAP_ROLE_PICKER_LIMIT;

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const trendingQuery = useTrendingCareersQuery(days, limit);

  const roles = useMemo(
    () =>
      mapTrendingToRoleRows(
        trendingQuery.data ?? [],
        "current",
        lookbackPhrase,
      ).map((row) => ({
        ...row,
        targetRole: row.trendName,
      })),
    [trendingQuery.data, lookbackPhrase],
  );

  useEffect(() => {
    if (trendingQuery.isError) {
      toast.error("Could not load current trending roles.");
    }
  }, [trendingQuery.isError]);

  useEffect(() => {
    if (selectedRoleId || !roles[0]) {
      return;
    }
    setSelectedRoleId(roles[0].id);
  }, [roles, selectedRoleId]);

  const selected = roles.find((r) => r.id === selectedRoleId);

  const handleGenerate = useCallback(async () => {
    const targetRole = selected?.targetRole;
    if (!targetRole) {
      toast.error("Select a role first.");
      return;
    }
    setIsGenerating(true);
    try {
      const resume = await generateResume(targetRole);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.list(),
      });
      queryClient.setQueryData(queryKeys.resumes.detail(resume.id), resume);
      if (resume.warnings && resume.warnings.length > 0) {
        toast.success("Resume generated with profile gaps.", {
          description: `${formatResumeWarningSummary(resume.warnings)} — open links on the resume page.`,
        });
      } else {
        toast.success("Resume generated.");
      }
      router.push(`/dashboard/resume-builder/${resume.id}`);
    } catch {
      toast.error("Could not generate resume.");
    } finally {
      setIsGenerating(false);
    }
  }, [queryClient, router, selected?.targetRole]);

  return {
    roles,
    selectedRoleId,
    setSelectedRoleId,
    loadingRoles: trendingQuery.isPending && roles.length === 0,
    isEmpty: !trendingQuery.isPending && trendingQuery.isSuccess && roles.length === 0,
    isGenerating,
    handleGenerate,
  };
}
