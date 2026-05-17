import {
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import ResourceItem from "./ResourceItem";
import { PathCardModulesSkeleton } from "./LearningPathSkeletons";

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
      {/* Card Header */}
      <div className="flex items-center justify-between p-6 sm:p-8 cursor-pointer" onClick={() => onToggleExpand(path.id)}>
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            {path.icon}
          </div>
          <div>
            <h3
              className="text-xl font-semibold text-foreground transition-colors hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(path.id);
              }}
            >
              {path.title}
            </h3>
            <p className="text-body text-muted-foreground">Focus: {path.focus}</p>
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
            <ChevronUp className="h-6 w-6 text-muted-foreground cursor-pointer" />
          ) : (
            <ChevronDown className="h-6 w-6 text-muted-foreground cursor-pointer" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-muted/40 border-t border-border p-6 sm:p-10">
          {isDetailLoading && path.modules.length === 0 ? (
            <PathCardModulesSkeleton />
          ) : (
          <div className="relative space-y-12">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[15px] top-4 bottom-0 w-[1px] bg-primary/20" />

            {path.modules.map((module: any, index: number) => (
              <div key={module.id} className="relative pl-12">
                <div
                  className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-background ${
                    module.status === "completed"
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-primary bg-card text-sm font-semibold text-primary"
                  }`}
                >
                  {module.status === 'completed' ? <Check size={16} strokeWidth={3} /> : index + 1}
                </div>
                <h4 className="mb-6 text-lg font-semibold text-foreground">
                  {module.title}
                </h4>

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
                      onToggle={() => path.onToggleResource && path.onToggleResource(module.id, resource.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
};
