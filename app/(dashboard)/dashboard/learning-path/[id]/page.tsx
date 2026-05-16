"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoadmapDetailView } from "@/components/roadmap-view/RoadmapDetailView";
import type { LearningPath } from "../mockData";
import { getRoadmap } from "@/lib/roadmaps-api";
import { roadmapOutToLearningPath } from "@/lib/map-roadmap-to-learning-path";
import { syncRoadmapStepProgress } from "@/lib/roadmap-progress-sync";
import { RoadmapDetailPageSkeleton } from "@/components/learning-path/LearningPathSkeletons";
import { toast } from "sonner";

function toggleResourceInPath(
  path: LearningPath,
  moduleId: string,
  resourceId: string,
): LearningPath {
  return {
    ...path,
    modules: path.modules.map((module) => {
      if (module.id !== moduleId) {
        return module;
      }
      return {
        ...module,
        resources: module.resources.map((resource) => {
          if (resource.id !== resourceId) {
            return resource;
          }
          const newStatus =
            resource.status === "completed" ? "in-progress" : "completed";
          return { ...resource, status: newStatus };
        }),
      };
    }),
  };
}

export default function StandaloneRoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const full = await getRoadmap(id);
        if (!cancelled) {
          setPath(roadmapOutToLearningPath(full));
        }
      } catch {
        if (!cancelled) {
          setLoadError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleToggleResource = useCallback(
    (moduleId: string, resourceId: string) => {
      setPath((prevPath) => {
        if (!prevPath) {
          return prevPath;
        }
        const next = toggleResourceInPath(
          prevPath,
          moduleId,
          resourceId,
        );
        const mod = next.modules.find((m) => m.id === moduleId);
        if (mod) {
          void syncRoadmapStepProgress(moduleId, mod.resources).catch(() => {
            toast.error("Could not sync step progress.");
          });
        }
        return next;
      });
    },
    [],
  );

  if (loadError || (!path && !loadError)) {
    if (!path && !loadError) {
      return <RoadmapDetailPageSkeleton />;
    }
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground">Roadmap Not Found</h1>
        <Link
          href="/dashboard/learning-path"
          className="mt-4 text-primary hover:underline"
        >
          Go back to Learning Paths
        </Link>
      </div>
    );
  }

  if (!path) {
    return null;
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
                Roadmap · API synced
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden h-10 gap-2 rounded-full border-border px-5 font-semibold text-muted-foreground sm:flex"
            >
              <Share2 size={16} />
              Share
            </Button>
            <Button className="h-10 rounded-full bg-primary px-6 font-semibold text-white hover:bg-primary/90">
              Update Progress
            </Button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <RoadmapDetailView
          path={{
            ...path,
            onToggleResource: handleToggleResource,
          }}
        />
      </main>
    </div>
  );
}
