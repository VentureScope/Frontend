import React from "react";
import { Check, BarChart3, Cloud } from "lucide-react";
import { RoadmapResourceItem } from "./RoadmapResourceItem";

export const RoadmapDetailView = ({ path }: any) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BarChart3": return <BarChart3 size={28} />;
      case "Cloud": return <Cloud size={28} />;
      default: return <BarChart3 size={28} />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Info Block */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted text-primary shadow-sm">
            {getIcon(path.iconName)}
          </div>
          <div className="space-y-2">
            <h2 className="text-h1 text-foreground">
              {path.title}
            </h2>
            <p className="text-lg font-medium text-muted-foreground">
              Focus: {path.focus}
            </p>
          </div>
        </div>

        <div className="w-full space-y-3 md:w-80">
          <div className="text-label flex justify-between">
            <span className="text-muted-foreground">Current Progress</span>
            <span className="text-primary">{path.progress}% Complete</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-lg bg-primary shadow-sm"
              style={{ width: `${path.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* The Roadmap Content */}
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm sm:p-12">
        <div className="relative space-y-20">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[19px] top-4 bottom-0 w-[2px] bg-muted" />

          {path.modules.map((module: any, index: number) => (
            <div key={module.id} className="relative pl-16">
              <div
                className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full ring-[10px] ring-background ${
                  module.status === "completed"
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-primary bg-card text-lg font-semibold text-primary"
                }`}
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
                  <p className="mt-1 text-muted-foreground">
                    {module.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {module.resources.map((resource: any) => (
                    <RoadmapResourceItem
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
