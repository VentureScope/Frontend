"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewResumeHeader } from "@/components/resume/NewResumeHeader";
import { RoleSelectionList } from "@/components/new-roadmap/RoleSelectionList";
import { getCurrentTrendingRoles } from "@/lib/jobs-api";
import { generateResume } from "@/lib/resume-api";
import {
  formatCompactNumber,
  formatGrowthLabel,
  formatRoadmapRoleMetric,
} from "@/lib/job-market-insights";
import type { TrendingCareer } from "@/types/jobs";
import { NewRoadmapRolesSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { toast } from "sonner";
import { formatResumeWarningSummary } from "@/lib/resume-warning-links";

const ICONS = ["Cpu", "Share2", "Shield", "BarChart2"] as const;

type ResumeRoleRow = {
  id: string;
  title: string;
  badge: string;
  badgeType: "high-demand" | "steady-growth";
  metricValue: string;
  metricLabel: string;
  iconName: string;
  description: string;
  targetRole: string;
};

function mapTrendingToRoles(careers: TrendingCareer[]): ResumeRoleRow[] {
  return careers.map((c, i) => {
    const growth = c.growth_pct ?? 0;
    const high = growth >= 8 || c.job_count > 5000;
    const growthText = formatGrowthLabel(c.growth_pct);
    const metric = formatRoadmapRoleMetric(c, "current");
    const context =
      c.company_count > 0
        ? `${formatCompactNumber(c.company_count)} employers in market data`
        : "Indexed market listings";

    return {
      id: `trend-${i}-${encodeURIComponent(c.name)}`,
      title: c.name,
      badge: high ? "STRONG SIGNAL" : "EMERGING",
      badgeType: high ? "high-demand" : "steady-growth",
      metricValue: metric.value,
      metricLabel: metric.label,
      iconName: ICONS[i % ICONS.length],
      description: `${context} · ${growthText.label} vs prior 30 days`,
      targetRole: c.name,
    };
  });
}

export default function NewResumePage() {
  const router = useRouter();
  const [roles, setRoles] = useState<ResumeRoleRow[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingTrends(true);
      try {
        const careers = await getCurrentTrendingRoles({ limit: 12, period: 30 });
        if (cancelled) {
          return;
        }
        const mapped = mapTrendingToRoles(careers);
        setRoles(mapped);
        if (mapped[0]) {
          setSelectedRoleId(mapped[0].id);
        }
      } catch {
        if (!cancelled) {
          toast.error("Could not load current trending roles.");
        }
      } finally {
        if (!cancelled) {
          setLoadingTrends(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
  }, [router, selected?.targetRole]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <NewResumeHeader
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <div className="mt-16">
          {loadingTrends ? (
            <NewRoadmapRolesSkeleton />
          ) : roles.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No current trending roles available.
            </p>
          ) : (
            <RoleSelectionList
              roles={roles}
              selectedId={selectedRoleId}
              onSelect={setSelectedRoleId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
