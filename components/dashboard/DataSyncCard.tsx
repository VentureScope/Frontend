// components/dashboard/DataSyncCard.tsx
import { Database, Github, GraduationCap } from "lucide-react";

export default function DataSyncCard() {
  const syncItems = [
    { label: "GitHub Repos", icon: Github, status: "SYNCED" },
    { label: "eStudent Records", icon: GraduationCap, status: "SYNCED" },
  ];

  return (
    <div className="rounded-3xl sm:rounded-[40px] border border-slate-100 bg-white p-6 sm:p-8 lg:p-10 shadow-sm h-full">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Database className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
            Data Sync Status
          </h3>
          <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Real-time Integration
          </p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {syncItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                {item.label}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
