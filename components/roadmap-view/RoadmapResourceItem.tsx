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

  const typeColor =
    type === "DOCUMENTATION" || type === "ARTICLE"
      ? "text-rose-500"
      : type === "PROJECT"
        ? "text-emerald-600"
        : type === "BOOK"
          ? "text-violet-600"
          : "text-blue-600";

  return (
    <div
      onClick={() => onToggle && id ? onToggle(id) : undefined}
      className={`group flex items-center justify-between rounded-[24px] border bg-white p-5 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer ${isInProgress ? "border-l-4 border-l-blue-600 border-slate-100 shadow-sm" : "border-slate-100 opacity-90 hover:opacity-100"}`}
    >
      <div className="flex items-center gap-5 min-w-0 flex-1">
        {thumbnail ? (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <img
              src={thumbnail}
              className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
              alt=""
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md">
                <Play
                  size={12}
                  fill="currentColor"
                  className="ml-0.5 text-blue-600"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <BookOpen size={28} />
          </div>
        )}

        <div className="space-y-1 min-w-0">
          <p
            className={`text-[10px] font-bold tracking-[0.15em] ${typeColor}`}
          >
            {type}
          </p>
          <h5 className="text-[17px] font-bold text-slate-900">{title}</h5>
          <p className="text-sm font-medium text-slate-400 break-words">
            {meta}
          </p>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              Open link <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <div className="px-4 shrink-0">
        {status === "completed" ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Check size={16} strokeWidth={3} />
          </div>
        ) : (
          <Circle size={24} className="text-slate-200" />
        )}
      </div>
    </div>
  );
};
