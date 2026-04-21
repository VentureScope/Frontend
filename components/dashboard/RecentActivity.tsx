export default function RecentActivity() {
  const activities = [
    {
      title: "Synced Semester 4 Grades",
      time: "3 HOURS AGO",
      badge: "Academic Hub",
      color: "bg-blue-600",
    },
    {
      title: "Updated Resume keyword: Python",
      time: "YESTERDAY",
      badge: "Resume Builder",
      color: "bg-rose-500",
    },
    {
      title: "Completed Module: Data Pre-processing",
      time: "2 DAYS AGO",
      badge: "Learning Path",
      color: "bg-blue-600",
    },
  ];

  return (
    <div className="rounded-3xl sm:rounded-[40px] border border-slate-100 bg-white p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
      <div className="mb-6 sm:mb-10 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Recent Activity
        </h2>
        <button className="text-xs sm:text-sm font-bold text-blue-600 hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-8 sm:space-y-10 pl-2">
        {activities.map((act, i) => (
          <div key={i} className="flex gap-4 sm:gap-6 relative shrink-0">
            <div
              className={`mt-1 sm:mt-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full shrink-0 ${act.color}`}
            />
            <div className="space-y-1 -mt-1 sm:mt-0">
              <h4 className="font-bold text-sm sm:text-base text-slate-900">
                {act.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {act.time}
                </span>
                <span className="rounded-full bg-slate-50 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                  {act.badge}
                </span>
              </div>
            </div>
            {i !== activities.length - 1 && (
              <div className="absolute left-[4.5px] sm:left-[5.5px] top-4 sm:top-6 w-1 h-full -mb-4 bg-slate-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
