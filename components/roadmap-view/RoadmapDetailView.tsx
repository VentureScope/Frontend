import React from "react";
import { Check, BarChart3, Cloud } from "lucide-react";
import { RoadmapResourceItem } from "./RoadmapResourceItem";
import { RoadmapOverviewBlock } from "@/components/learning-path/RoadmapOverviewBlock";
import type { LearningPath } from "@/app/(dashboard)/dashboard/learning-path/mockData";

function moduleStepClass(status: string): string {
  if (status === "completed") {
    return "bg-primary text-primary-foreground";
  }
  if (status === "in-progress") {
    return "border-2 border-primary bg-primary/10 text-primary";
  }
  return "border-2 border-border bg-card text-sm font-semibold text-muted-foreground";
}

type RoadmapDetailViewProps = {
  path: LearningPath & {
    onToggleResource?: (moduleId: string, resourceId: string) => void;
  };
  syncingResourceId?: string | null;
};

export const RoadmapDetailView = ({
  path,
  syncingResourceId = null,
}: RoadmapDetailViewProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BarChart3":
        return <BarChart3 size={28} />;
      case "Cloud":
        return <Cloud size={28} />;
      default:
        return <BarChart3 size={28} />;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-6 md:flex-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted text-primary shadow-sm">
            {getIcon(path.iconName)}
          </div>
          <h2 className="text-h1 text-foreground">{path.title}</h2>
          <RoadmapOverviewBlock path={path} />
        </div>

        <div className="w-full shrink-0 space-y-3 md:w-80">
          <div className="text-label flex justify-between">
            <span className="text-muted-foreground">Current Progress</span>
            <span className="text-primary">{path.progress}% Complete</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-lg bg-primary shadow-sm transition-all"
              style={{ width: `${path.progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{path.focus}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 shadow-sm sm:p-12">
        <div className="relative space-y-20">
          <div className="absolute left-[19px] top-4 bottom-0 w-[2px] bg-muted" />

          {path.modules.map((module, index) => (
            <div key={module.id} className="relative pl-16">
              <div
                className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full ring-[10px] ring-background ${moduleStepClass(module.status)}`}
              >
                {module.status === "completed" ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-2xl font-semibold text-foreground">
                    {module.title}
                  </h4>
                  {module.description ? (
                    <p className="mt-1 text-muted-foreground">
                      {module.description}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {module.resources.map((resource) => (
                    <RoadmapResourceItem
                      key={resource.id}
                      id={resource.id}
                      type={resource.type}
                      title={resource.title}
                      meta={resource.meta}
                      status={resource.status}
                      thumbnail={resource.thumbnail}
                      url={resource.url}
                      isSaving={syncingResourceId === resource.id}
                      onToggle={() =>
                        path.onToggleResource?.(module.id, resource.id)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
