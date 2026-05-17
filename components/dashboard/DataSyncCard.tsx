import { Database, Github, GraduationCap } from "lucide-react";

export default function DataSyncCard() {
  const syncItems = [
    { label: "GitHub Repos", icon: Github, status: "SYNCED" },
    { label: "eStudent Records", icon: GraduationCap, status: "SYNCED" },
  ];

  return (
    <div className="h-full vs-surface p-6 sm:p-8 sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background sm:h-12 sm:w-12">
          <Database className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold leading-tight text-foreground sm:text-xl">
            Data Sync Status
          </h3>
          <p className="text-label text-muted-foreground">Real-time Integration</p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {syncItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground sm:h-10 sm:w-10">
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-body font-medium text-muted-foreground">
                {item.label}
              </span>
            </div>
            <span className="text-label text-success">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
