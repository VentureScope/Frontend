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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
            {getIcon(path.iconName)}
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              {path.title}
            </h2>
            <p className="text-lg font-medium text-muted-foreground">
              Focus: {path.focus}
            </p>
          </div>
        </div>

        <div className="w-full space-y-3 md:w-80">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-muted-foreground uppercase tracking-widest">
              Current Progress
            </span>
            <span className="text-primary">{path.progress}% Complete</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-200/50">
            <div
              className="h-full rounded-full bg-primary shadow-sm"
              style={{ width: `${path.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* The Roadmap Content */}
      <div className="rounded-[32px] border border-border bg-card p-8 shadow-sm sm:p-12">
        <div className="relative space-y-20">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[19px] top-4 bottom-0 w-[2px] bg-primary/10" />

          {path.modules.map((module: any, index: number) => (
            <div key={module.id} className="relative pl-16">
              <div className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full ring-[10px] ring-white ${module.status === 'completed' ? 'bg-primary text-white' : 'border-2 border-primary bg-card text-primary font-bold text-lg'}`}>
                {module.status === 'completed' ? <Check size={20} strokeWidth={3} /> : index + 1}
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-2xl font-bold text-foreground">
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
