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
    <div className="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
        <button className="text-sm font-bold text-blue-600 hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-10">
        {activities.map((act, i) => (
          <div key={i} className="flex gap-6 relative">
            <div
              className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${act.color}`}
            />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">{act.title}</h4>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {act.time}
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">
                  {act.badge}
                </span>
              </div>
            </div>
            {i !== activities.length - 1 && (
              <div className="absolute left-[5.5px] top-6 w-0.5 h-12 bg-slate-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
