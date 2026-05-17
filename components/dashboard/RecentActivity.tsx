export default function RecentActivity() {
  const activities = [
    {
      title: "Synced Semester 4 Grades",
      time: "3 HOURS AGO",
      badge: "Academic Hub",
      badgeClass: "vs-badge vs-badge-success",
      dotClass: "bg-success",
    },
    {
      title: "Updated Resume keyword: Python",
      time: "YESTERDAY",
      badge: "Resume Builder",
      badgeClass: "vs-badge vs-badge-warning",
      dotClass: "bg-warning",
    },
    {
      title: "Completed Module: Data Pre-processing",
      time: "2 DAYS AGO",
      badge: "Learning Path",
      badgeClass: "vs-badge vs-badge-accent",
      dotClass: "bg-accent",
    },
  ];

  return (
    <div className="vs-surface p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Recent Activity
        </h2>
        <button
          type="button"
          className="text-btn font-medium text-primary transition-colors hover:text-primary/80"
        >
          View All
        </button>
      </div>
      <div className="space-y-8 sm:space-y-10">
        {activities.map((act, i) => (
          <div key={i} className="flex gap-4 sm:gap-5">
            <div
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full sm:mt-2 ${act.dotClass}`}
            />
            <div className="min-w-0 space-y-1.5">
              <h4 className="text-body font-medium text-foreground">{act.title}</h4>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-data text-label text-muted-foreground">
                  {act.time}
                </span>
                <span className={act.badgeClass}>{act.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

