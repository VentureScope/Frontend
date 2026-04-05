// components/data-hub/GitHubCard.tsx
import { Github, RefreshCw } from "lucide-react";

export default function GitHubCard() {
  const stats = [
    { label: "REPOS SYNCED", value: "5" },
    { label: "COMMITS", value: "142" },
    { label: "LANGUAGES", value: "3" },
  ];

  return (
    <div className="flex h-full flex-col justify-between rounded-[32px] border border-slate-100 bg-white p-10 shadow-sm">
      <div className="space-y-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Github size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                GitHub Integration
              </h3>
              <p className="text-sm text-slate-500">
                Syncing technical contributions & repositories
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
            CONNECTED
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-blue-50/50 p-6 border border-blue-100/50"
            >
              <p className="text-3xl font-bold text-blue-700">{s.value}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-blue-500/70">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Last Synced
          </p>
          <p className="text-xs font-medium text-slate-600">
            Oct 24, 2024 • 14:02 PM
          </p>
        </div>
        <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700">
          <RefreshCw size={14} /> Re-sync Now
        </button>
      </div>
    </div>
  );
}
