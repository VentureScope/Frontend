import { Database, Github, GraduationCap } from "lucide-react";

export default function DataSyncCard() {
  const syncItems = [
    { label: "GitHub Repos", icon: Github, status: "SYNCED" as const },
    { label: "eStudent Records", icon: GraduationCap, status: "SYNCED" as const },
  ];

  return (
    <div className="vs-surface h-full p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <div className="vs-icon-tile vs-icon-tile-primary h-10 w-10 shrink-0 sm:h-12 sm:w-12">
          <Database className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold leading-tight text-foreground sm:text-xl">
            Data Sync Status
          </h3>
          <p className="text-label text-primary">Real-time Integration</p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {syncItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="vs-icon-tile vs-icon-tile-accent flex h-8 w-8 sm:h-10 sm:w-10">
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-body font-medium text-foreground">{item.label}</span>
            </div>
            <span className="vs-badge vs-badge-success">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

