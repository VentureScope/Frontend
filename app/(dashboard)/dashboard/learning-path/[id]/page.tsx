"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { RoadmapDetailView } from "@/components/roadmap-view/RoadmapDetailView";
import type { LearningPath } from "../mockData";
import {
  formatRoadmapStatus,
  roadmapStatusBadgeClass,
} from "@/lib/roadmap-utils";
import { useRoadmapResourceToggle } from "@/hooks/useRoadmapResourceToggle";
import { useRoadmapDetailQuery } from "@/hooks/queries/use-roadmap-detail-query";
import { queryKeys } from "@/lib/query-keys";
import { RoadmapDetailPageSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { RoadmapUxTips } from "@/components/roadmap-view/RoadmapUxTips";

export default function StandaloneRoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const detailQuery = useRoadmapDetailQuery(id);
  const [path, setPath] = useState<LearningPath | null>(null);

  useEffect(() => {
    if (detailQuery.data) {
      setPath(detailQuery.data);
    }
  }, [detailQuery.data]);

  useEffect(() => {
    if (path) {
      queryClient.setQueryData(queryKeys.roadmaps.detail(id), path);
    }
  }, [path, id, queryClient]);

  const { syncingResourceId, handleToggleResource } =
    useRoadmapResourceToggle(setPath);

  if (detailQuery.isPending && !path) {
    return <RoadmapDetailPageSkeleton />;
  }

  if (detailQuery.isError || !path) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <h1 className="text-h1 text-foreground">Roadmap Not Found</h1>
        <Link
          href="/dashboard/learning-path"
          className="mt-4 text-primary hover:underline"
        >
          Go back to Learning Paths
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/learning-path"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-foreground">{path.title}</h1>
              <p className="text-[11px] font-medium text-muted-foreground">
                {path.totalWeeks != null
                  ? `${path.totalWeeks} week${path.totalWeeks === 1 ? "" : "s"}`
                  : "Learning roadmap"}
                {path.trendName ? ` · ${path.trendName}` : ""}
              </p>
            </div>
          </div>

          {path.roadmapStatus ? (
            <span className={roadmapStatusBadgeClass(path.roadmapStatus)}>
              {formatRoadmapStatus(path.roadmapStatus)}
            </span>
          ) : null}
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <RoadmapUxTips variant="personal-detail" className="mb-8" compact />
        <RoadmapDetailView
          path={{
            ...path,
            onToggleResource: handleToggleResource,
          }}
          syncingResourceId={syncingResourceId}
        />
      </main>
    </div>
  );
}
