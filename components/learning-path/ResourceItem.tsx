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

export default function ResourceItem({
  id,
  type,
  title,
  meta,
  status,
  thumbnail,
  url,
  onToggle,
}: ResourceItemProps) {
  const href = url && /^https?:\/\//i.test(url.trim()) ? url.trim() : null;

  return (
    <div
      onClick={() => onToggle && id && onToggle(id)}
      className={`group flex cursor-pointer items-center justify-between rounded-lg border bg-card p-4 transition-all hover:border-border hover:shadow-md ${
        status === "in-progress"
          ? "border-l-4 border-l-primary border-border"
          : "border-border"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {thumbnail ? (
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            <img
              src={thumbnail}
              className="h-full w-full object-cover opacity-80"
              alt=""
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 shadow-sm">
                <Play
                  size={12}
                  fill="currentColor"
                  className="ml-0.5 text-primary"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
            <BookOpen size={24} />
          </div>
        )}

        <div className="min-w-0 flex-1">
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
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Open resource <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <div className="shrink-0 pr-2">
        {status === "completed" ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted">
            <Check size={14} className="text-primary" strokeWidth={3} />
          </div>
        ) : (
          <Circle size={20} className="text-muted-foreground/50" />
        )}
      </div>
    </div>
  );
}
