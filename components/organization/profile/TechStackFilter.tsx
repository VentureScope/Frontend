"use client";

import { Layers } from "lucide-react";
import { ALL_TECH_FILTER } from "@/lib/skill-tech-stack-utils";
import { cn } from "@/lib/utils";

type Props = {
  techStacks: string[];
  value: string;
  onChange: (tech: string) => void;
  className?: string;
};

export function TechStackFilter({
  techStacks,
  value,
  onChange,
  className,
}: Props) {
  if (techStacks.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <p className="text-label text-muted-foreground">Filter by tech stack</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(ALL_TECH_FILTER)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            value === ALL_TECH_FILTER
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          All technologies
        </button>
        {techStacks.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => onChange(tech)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              value === tech
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
}
