import { Database, Github, GraduationCap } from "lucide-react";
import Link from "next/link";
import { DataSyncCardSkeleton } from "@/components/dashboard/DashboardSkeletons";
import type { DashboardSyncItem } from "@/hooks/useDashboardOverview";

const ICONS: Record<string, typeof Github> = {
  github: Github,
  estudent: GraduationCap,
};

function statusLabel(status: DashboardSyncItem["status"]) {
  switch (status) {
    case "SYNCED":
      return "SYNCED";
    case "PENDING":
      return "PENDING";
    default:
      return "NOT CONNECTED";
  }
}

function statusBadgeClass(status: DashboardSyncItem["status"]) {
  switch (status) {
    case "SYNCED":
      return "vs-badge vs-badge-success";
    case "PENDING":
      return "vs-badge vs-badge-warning";
    default:
      return "vs-badge bg-muted text-muted-foreground";
  }
}

export default function DataSyncCard({
  items,
  loading,
}: {
  items: DashboardSyncItem[];
  loading?: boolean;
}) {
  if (loading) {
    return <DataSyncCardSkeleton />;
  }

  return (
    <Link
      href="/dashboard/data-hub"
      className="vs-surface block h-full p-6 transition-colors hover:border-primary/25 sm:p-8 lg:p-10"
    >
      <div className="mb-6 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <div className="vs-icon-tile vs-icon-tile-primary h-10 w-10 shrink-0 sm:h-12 sm:w-12">
          <Database className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold leading-tight text-foreground sm:text-xl">
            Data sync status
          </h3>
          <p className="text-label text-primary">Real-time integration</p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {items.map((item) => {
          const Icon = ICONS[item.id] ?? Github;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="vs-icon-tile vs-icon-tile-accent flex h-8 w-8 sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-body font-medium text-foreground">
                  {item.label}
                </span>
              </div>
              <span className={statusBadgeClass(item.status)}>
                {statusLabel(item.status)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs font-semibold text-primary sm:mt-8">
        Open Data Hub →
      </p>
    </Link>
  );
}
