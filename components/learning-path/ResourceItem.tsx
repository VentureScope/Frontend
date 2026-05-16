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
  const typeColors: Record<ResourceType, string> = {
    VIDEO: "text-primary",
    DOCUMENTATION: "text-rose-600",
    "COURSE MODULE": "text-indigo-600",
    ARTICLE: "text-amber-600",
    PROJECT: "text-emerald-600",
    BOOK: "text-violet-600",
  };

  const href = url && /^https?:\/\//i.test(url.trim()) ? url.trim() : null;

  return (
    <div
      onClick={() => onToggle && id ? onToggle(id) : undefined}
      className={`group flex items-center justify-between rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer ${status === "in-progress" ? "border-l-4 border-l-primary" : "border-border"}`}
    >
      <div className="flex items-center gap-4">
        {thumbnail ? (
          <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted">
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
                  className="ml-0.5 text-muted-foreground"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen size={24} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p
            className={`text-[10px] font-bold tracking-widest ${typeColors[type]}`}
          >
            {type}
          </p>
          <h5 className="text-[15px] font-bold text-foreground">{title}</h5>
          <p className="text-[12px] font-medium text-muted-foreground break-words">
            {meta}
          </p>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Open resource <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <div className="pr-2 shrink-0">
        {status === "completed" ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <Check size={14} className="text-primary" strokeWidth={3} />
          </div>
        ) : (
          <Circle size={20} className="text-muted-foreground/50" />
        )}
      </div>
    </div>
  );
}
