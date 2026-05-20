import { ChevronDown, ChevronUp, Check } from "lucide-react";
import ResourceItem from "./ResourceItem";
import { PathCardModulesSkeleton } from "./LearningPathSkeletons";
import {
  formatRoadmapStatus,
  roadmapStatusBadgeClass,
} from "@/lib/roadmap-utils";
import { RoadmapOverviewBlock } from "./RoadmapOverviewBlock";

function moduleStepClass(status: string): string {
  if (status === "completed") {
    return "bg-primary text-primary-foreground";
  }
  if (status === "in-progress") {
    return "border-2 border-primary bg-primary/10 text-primary";
  }
  return "border-2 border-border bg-card text-sm font-semibold text-muted-foreground";
}

export const PathCard = ({
  path,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  isDetailLoading,
}: {
  path: any;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onViewDetails: (id: string) => void;
  isDetailLoading?: boolean;
}) => {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all">
      <div
        className="flex cursor-pointer items-center justify-between p-6 sm:p-8"
        onClick={() => onToggleExpand(path.id)}
      >
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            {path.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className="text-xl font-semibold text-foreground transition-colors hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(path.id);
                }}
              >
                {path.title}
              </h3>
              {path.roadmapStatus ? (
                <span
                  className={roadmapStatusBadgeClass(path.roadmapStatus)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatRoadmapStatus(path.roadmapStatus)}
                </span>
              ) : null}
            </div>
            <p className="text-body text-muted-foreground">{path.focus}</p>
            {path.summary && !isExpanded ? (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {path.summary}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden w-64 md:block">
            <div className="text-label mb-2 flex justify-between">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary">{path.progress}% Complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-lg bg-primary transition-all duration-500"
                style={{ width: `${path.progress}%` }}
              />
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-6 w-6 cursor-pointer text-muted-foreground" />
          ) : (
            <ChevronDown className="h-6 w-6 cursor-pointer text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border bg-muted/40 p-6 sm:p-10">
          {isDetailLoading && path.modules.length === 0 ? (
            <PathCardModulesSkeleton />
          ) : (
            <div className="space-y-10">
              {(path.summary || path.goal) && (
                <RoadmapOverviewBlock path={path} compact />
              )}
              <div className="relative space-y-12">
                <div className="absolute left-[15px] top-4 bottom-0 w-[1px] bg-primary/20" />

                {path.modules.map((module: any, index: number) => (
                  <div key={module.id} className="relative pl-12">
                    <div
                      className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-background ${moduleStepClass(module.status)}`}
                    >
                      {module.status === "completed" ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-foreground">
                      {module.title}
                    </h4>
                    {module.description ? (
                      <p className="mb-6 text-sm text-muted-foreground">
                        {module.description}
                      </p>
                    ) : (
                      <div className="mb-6" />
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {module.resources.map((resource: any) => (
                        <ResourceItem
                          key={resource.id}
                          id={resource.id}
                          type={resource.type}
                          title={resource.title}
                          meta={resource.meta}
                          status={resource.status}
                          thumbnail={resource.thumbnail}
                          url={resource.url}
                          onToggle={() =>
                            path.onToggleResource?.(module.id, resource.id)
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
