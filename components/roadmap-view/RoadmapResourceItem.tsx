import { Play, BookOpen, Check, Circle, ExternalLink } from "lucide-react";
import type { ResourceType } from "@/app/(dashboard)/dashboard/learning-path/mockData";

interface ResourceItemProps {
  id?: string;
  type: ResourceType;
  title: string;
  meta: string;
  status: "completed" | "in-progress" | "locked";
  thumbnail?: string;
  url?: string | null;
  onToggle?: (id: string) => void;
}

const TYPE_COLORS: Record<ResourceType, string> = {
  VIDEO: "text-primary",
  DOCUMENTATION: "text-secondary",
  "COURSE MODULE": "text-accent",
  ARTICLE: "text-muted-foreground",
  PROJECT: "text-success",
  BOOK: "text-accent",
};

export const RoadmapResourceItem = ({
  id,
  type,
  title,
  meta,
  status,
  thumbnail,
  url,
  onToggle,
}: ResourceItemProps) => {
  const isInProgress = status === "in-progress";
  const href = url && /^https?:\/\//i.test(url.trim()) ? url.trim() : null;

  return (
    <div
      onClick={() => onToggle && id && onToggle(id)}
      className={`group flex cursor-pointer items-center justify-between rounded-lg border bg-card p-5 transition-all hover:border-border hover:shadow-lg hover: ${
        isInProgress
          ? "border-l-4 border-l-primary border-border shadow-sm"
          : "border-border opacity-90 hover:opacity-100"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-5">
        {thumbnail ? (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
            <img
              src={thumbnail}
              className="h-full w-full object-cover grayscale-[20%] transition-all group-hover:grayscale-0"
              alt=""
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card/95 shadow-md">
                <Play
                  size={12}
                  fill="currentColor"
                  className="ml-0.5 text-primary"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-muted group-hover:text-primary">
            <BookOpen size={28} />
          </div>
        )}

        <div className="min-w-0 space-y-1">
          <p className={`text-label ${TYPE_COLORS[type]}`}>{type}</p>
          <h5 className="text-body font-semibold text-foreground">{title}</h5>
          <p className="text-sm font-medium break-words text-muted-foreground">
            {meta}
          </p>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Open link <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <div className="shrink-0 px-4">
        {status === "completed" ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-primary">
            <Check size={16} strokeWidth={3} />
          </div>
        ) : (
          <Circle size={24} className="text-muted-foreground/40" />
        )}
      </div>
    </div>
  );
};
