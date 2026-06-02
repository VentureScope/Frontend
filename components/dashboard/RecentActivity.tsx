import Link from "next/link";
import { RecentActivitySkeleton } from "@/components/dashboard/DashboardSkeletons";
import type { DashboardActivityItem } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";

export default function RecentActivity({
  activities,
  unreadCount,
  loading,
}: {
  activities: DashboardActivityItem[];
  unreadCount: number;
  loading?: boolean;
}) {
  if (loading) {
    return <RecentActivitySkeleton />;
  }

  return (
    <div className="vs-surface h-full min-h-0 p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Recent activity
        </h2>
        <Link
          href="/dashboard/profile"
          className="text-btn shrink-0 font-medium text-primary transition-colors hover:text-primary/80"
        >
          {unreadCount > 0 ? `${unreadCount} unread · ` : ""}
          View profile
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            No recent notifications yet. Activity from learning paths, resumes,
            and data sync will appear here.
          </p>
          <Link
            href="/dashboard/data-hub"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Set up your data sources →
          </Link>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">
          {activities.map((act) => (
            <Link
              key={act.id}
              href={act.href}
              className={cn(
                "flex gap-4 sm:gap-5 rounded-md transition-colors hover:bg-muted/40 -mx-2 px-2 py-1",
              )}
            >
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full sm:mt-2 ${act.dotClass}`}
              />
              <div className="min-w-0 space-y-1.5">
                <h4 className="text-body font-medium text-foreground">
                  {act.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-data text-label text-muted-foreground">
                    {act.time}
                  </span>
                  <span className={act.badgeClass}>{act.badge}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
