// components/dashboard/DataSyncCard.tsx
import { Database, Github, GraduationCap } from "lucide-react";

export default function DataSyncCard() {
  const syncItems = [
    { label: "GitHub Repos", icon: Github, status: "SYNCED" },
    { label: "eStudent Records", icon: GraduationCap, status: "SYNCED" },
  ];

  return (
    <div className="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm h-full">
      <div className="flex items-center gap-4 mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Database size={24} />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            Data Sync Status
          </h3>
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Real-time Integration
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {syncItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold text-slate-700">
                {item.label}
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
