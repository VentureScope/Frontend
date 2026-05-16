"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NewRoadmapHeader } from "@/components/new-roadmap/NewRoadmapHeader";
import { EvolutionTabs } from "@/components/new-roadmap/NewRoadmapTabs";
import { RoleSelectionList } from "@/components/new-roadmap/RoleSelectionList";
import {
  getCurrentTrendingRoles,
  getFutureTrendingRoles,
} from "@/lib/jobs-api";
import { generateRoadmap } from "@/lib/roadmaps-api";
import type { TrendingCareer } from "@/types/jobs";
import { NewRoadmapRolesSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { toast } from "sonner";

const ICONS = ["Cpu", "Share2", "Shield", "BarChart2"] as const;

type RoadmapRoleRow = {
  id: string;
  title: string;
  badge: string;
  badgeType: "high-demand" | "steady-growth";
  count: string;
  iconName: string;
  description: string;
  trendName: string;
};

function mapTrendingToRoles(careers: TrendingCareer[]): RoadmapRoleRow[] {
  return careers.map((c, i) => {
    const growth = c.growth_pct ?? 0;
    const high = growth >= 8 || c.job_count > 5000;
    return {
      id: `trend-${i}-${encodeURIComponent(c.name)}`,
      title: c.name,
      badge: high ? "HIGH DEMAND" : "STEADY GROWTH",
      badgeType: high ? "high-demand" : "steady-growth",
      count: `${c.job_count.toLocaleString()}+`,
      iconName: ICONS[i % ICONS.length],
      description: `${c.company_count.toLocaleString()} companies tracked · ${growth > 0 ? `+${growth.toFixed(0)}%` : "stable"} vs baseline`,
      trendName: c.name,
    };
  });
}

export default function NewRoadmapPage() {
  const router = useRouter();
  const [currentRoles, setCurrentRoles] = useState<RoadmapRoleRow[]>([]);
  const [futureRoles, setFutureRoles] = useState<RoadmapRoleRow[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("current");
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingTrends(true);
      try {
        const [currentCareers, futureCareers] = await Promise.all([
          getCurrentTrendingRoles({ limit: 12, period: 30 }),
          getFutureTrendingRoles({ limit: 12 }).catch(() => []),
        ]);
        if (cancelled) {
          return;
        }
        const mappedCurrent = mapTrendingToRoles(currentCareers);
        const mappedFuture = mapTrendingToRoles(futureCareers);
        setCurrentRoles(mappedCurrent);
        setFutureRoles(mappedFuture);
        if (mappedCurrent[0]) {
          setSelectedRoleId(mappedCurrent[0].id);
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

  const displayedRoles =
    activeTab === "current" ? currentRoles : futureRoles;

  const allRoles = [...currentRoles, ...futureRoles];
  const selected = allRoles.find((r) => r.id === selectedRoleId);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const nextList = tab === "current" ? currentRoles : futureRoles;
    if (nextList.length > 0) {
      const stillVisible = nextList.some((r) => r.id === selectedRoleId);
      if (!stillVisible) {
        setSelectedRoleId(nextList[0].id);
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    const trendName = selected?.trendName;
    if (!trendName) {
      toast.error("Select a role first.");
      return;
    }
    setIsGenerating(true);
    try {
      const roadmap = await generateRoadmap({ trend_name: trendName });
      toast.success("Roadmap created.");
      router.push(`/dashboard/learning-path/${roadmap.id}`);
    } catch {
      toast.error("Could not generate roadmap.");
    } finally {
      setIsGenerating(false);
    }
  }, [router, selected?.trendName]);

  return (
    <div className="relative min-h-screen bg-card">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute right-0 top-0 h-[600px] w-auto opacity-40"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M800 50C600 150 400 50 200 250S0 450 -100 550"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <path
            d="M850 150C650 250 450 150 250 350S50 550 -50 650"
            stroke="#eff6ff"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <NewRoadmapHeader
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <div className="mt-16">
          <EvolutionTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <div className="mt-10">
            {loadingTrends ? (
              <NewRoadmapRolesSkeleton />
            ) : displayedRoles.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                {activeTab === "future"
                  ? "Future predicted roles are not available yet."
                  : "No current trending roles available."}
              </p>
            ) : (
              <RoleSelectionList
                roles={displayedRoles}
                selectedId={selectedRoleId}
                onSelect={setSelectedRoleId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
