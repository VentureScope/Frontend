"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Users } from "lucide-react";
import { toast } from "sonner";
import { CreateOrgRoadmapHeader } from "@/components/organization/roadmaps/create/CreateOrgRoadmapHeader";
import { OrgAreaSelectionList } from "@/components/organization/roadmaps/create/OrgAreaSelectionList";
import { OrgRoadmapTrendingToggle } from "@/components/organization/roadmaps/create/OrgRoadmapTrendingToggle";
import { RoadmapInfoCallout } from "@/components/organization/roadmaps/RoadmapInfoCallout";
import {
  buildOrgRoadmapGenerationGoal,
  getOrgRoadmapFocusAreas,
} from "@/lib/organization-roadmap-areas";
import {
  fetchTrendingCareersForOrgRoadmap,
  filterTrendingForArea,
} from "@/lib/organization-roadmap-trends";
import { parseOrgRoadmapOutApi } from "@/lib/organization-roadmap-parsers";
import { assignOrganizationRoadmap } from "@/lib/organizations-api";
import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { getApiErrorMessage } from "@/lib/auth-api";
import type { TrendingCareer } from "@/types/jobs";

export function CreateOrgRoadmapWizard({ orgId }: { orgId: string }) {
  const router = useRouter();
  const { displayName: orgName } = useOrganizationProfile(orgId);
  const { members } = useOrganizationMembers(orgId);
  const { profile } = useOrganizationProfile(orgId);

  const areas = useMemo(
    () => getOrgRoadmapFocusAreas(orgId, { profile, members }),
    [orgId, profile, members],
  );

  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [includeTrending, setIncludeTrending] = useState(false);
  const [trendingCareers, setTrendingCareers] = useState<TrendingCareer[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (areas.length > 0 && !selectedAreaId) {
      setSelectedAreaId(areas[0].id);
    }
  }, [areas, selectedAreaId]);

  const selected = areas.find((a) => a.id === selectedAreaId);

  const matchedTrends = useMemo(() => {
    if (!selected || trendingCareers.length === 0) {
      return [];
    }
    return filterTrendingForArea(selected, trendingCareers);
  }, [selected, trendingCareers]);

  useEffect(() => {
    if (!includeTrending) {
      return;
    }
    let cancelled = false;
    (async () => {
      setTrendingLoading(true);
      try {
        const careers = await fetchTrendingCareersForOrgRoadmap();
        if (!cancelled) {
          setTrendingCareers(careers);
        }
      } catch {
        if (!cancelled) {
          setTrendingCareers([]);
        }
      } finally {
        if (!cancelled) {
          setTrendingLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [includeTrending]);

  const handleGenerate = useCallback(async () => {
    if (!selected) {
      toast.error("Select a practice area first.");
      return;
    }
    setIsGenerating(true);
    try {
      let trendsForGoal = includeTrending ? matchedTrends : [];
      if (includeTrending && trendsForGoal.length === 0) {
        const careers = await fetchTrendingCareersForOrgRoadmap();
        trendsForGoal = filterTrendingForArea(selected, careers);
      }
      const goal = buildOrgRoadmapGenerationGoal(orgId, selected, {
        profile,
        trendingCareers:
          includeTrending && trendsForGoal.length > 0 ? trendsForGoal : undefined,
      });

      const raw = await assignOrganizationRoadmap(orgId, {
        trend_name: selected.generationTrendName,
        goal,
      });
      const parsed = parseOrgRoadmapOutApi(raw);
      if (!parsed) {
        throw new Error("Roadmap was created but the response was invalid.");
      }

      toast.success(`Roadmap created for ${selected.title}.`);
      router.push(`/dashboard/organization/${orgId}/roadmaps/${parsed.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  }, [orgId, router, selected, includeTrending, matchedTrends]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute right-0 top-0 h-[600px] w-auto text-border opacity-50 dark:opacity-25"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M800 50C600 150 400 50 200 250S0 450 -100 550"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M850 150C650 250 450 150 250 350S50 550 -50 650"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary/20"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <CreateOrgRoadmapHeader
          orgId={orgId}
          orgName={orgName}
          onGenerate={() => void handleGenerate()}
          isGenerating={isGenerating}
          canGenerate={
            Boolean(selected) && !(includeTrending && trendingLoading)
          }
        />

        <div className="mt-10 space-y-8">
          <RoadmapInfoCallout icon={Building2} title="Company-first, trends optional">
            By default we use your organization profile and teammates in each
            area. Turn on market trends below to blend in live hiring demand for
            related roles—without replacing your team context.
          </RoadmapInfoCallout>

          {areas.length === 0 ? (
            <div className="vs-surface rounded-md border border-dashed border-border px-6 py-14 text-center">
              <p className="text-sm font-medium text-foreground">
                No practice areas defined yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Add core services on your company profile, or invite members
                with role titles so we can suggest areas for roadmap generation.
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-label mb-2 text-muted-foreground">
                  Step 1 · Select focus area
                </p>
                <h2 className="text-lg font-semibold text-foreground">
                  Company practice areas
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Areas come from your profile services, enriched with team
                  skills where members match the area.
                </p>
              </div>

              <OrgAreaSelectionList
                areas={areas}
                selectedId={selectedAreaId}
                onSelect={setSelectedAreaId}
              />

              <OrgRoadmapTrendingToggle
                enabled={includeTrending}
                onEnabledChange={setIncludeTrending}
                loading={trendingLoading}
                matchedTrends={matchedTrends}
                disabled={isGenerating}
              />

              {selected && selected.memberPreview.length > 0 ? (
                <RoadmapInfoCallout icon={Users} title="Team context for generation">
                  {selected.memberPreview.join(", ")}
                  {selected.memberCount > selected.memberPreview.length
                    ? ` and ${selected.memberCount - selected.memberPreview.length} more`
                    : ""}{" "}
                  will inform skills in this roadmap. Top skills:{" "}
                  {selected.topSkills.slice(0, 5).join(", ") || "—"}.
                </RoadmapInfoCallout>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
