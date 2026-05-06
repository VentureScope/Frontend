import { Play, BookOpen, Check, Circle } from "lucide-react";

interface ResourceItemProps {
  id?: string;
  type: "VIDEO" | "DOCUMENTATION" | "COURSE MODULE";
  title: string;
  meta: string;
  status: "completed" | "in-progress" | "locked";
  thumbnail?: string;
  onToggle?: (id: string) => void;
}

export default function ResourceItem({
  id,
  type,
  title,
  meta,
  status,
  thumbnail,
  onToggle,
}: ResourceItemProps) {
  const typeColors = {
    VIDEO: "text-blue-600",
    DOCUMENTATION: "text-rose-600",
    "COURSE MODULE": "text-blue-600",
  };

  return (
    <div
      onClick={() => onToggle && id ? onToggle(id) : undefined}
      className={`group flex items-center justify-between rounded-2xl border bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md cursor-pointer ${status === "in-progress" ? "border-l-4 border-l-blue-600" : "border-slate-100"}`}
    >
      <div className="flex items-center gap-4">
        {thumbnail ? (
          <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
            <img
              src={thumbnail}
              className="h-full w-full object-cover opacity-80"
              alt=""
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm">
                <Play
                  size={12}
                  fill="currentColor"
                  className="ml-0.5 text-slate-600"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BookOpen size={24} />
          </div>
        )}

        <div>
          <p
            className={`text-[10px] font-bold tracking-widest ${typeColors[type]}`}
          >
            {type}
          </p>
          <h5 className="text-[15px] font-bold text-slate-900">{title}</h5>
          <p className="text-[12px] font-medium text-slate-400">{meta}</p>
        </div>
      </div>

      <div className="pr-2">
        {status === "completed" ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
            <Check size={14} className="text-blue-600" strokeWidth={3} />
          </div>
        ) : (
          <Circle size={20} className="text-slate-300" />
        )}
      </div>
    </div>
  );
}
