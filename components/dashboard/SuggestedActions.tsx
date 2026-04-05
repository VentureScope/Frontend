// components/dashboard/SuggestedActions.tsx
import { Lightbulb, Zap, ChevronRight } from "lucide-react";

export default function SuggestedActions() {
  const actions = [
    {
      title: "Update LinkedIn Certifications",
      desc: "Your new certificates aren't reflected in your public profile yet.",
      icon: Lightbulb,
    },
    {
      title: "Quick Skill Test: AWS",
      desc: "Validate your cloud knowledge to boost match score by +4%.",
      icon: Zap,
    },
  ];

  return (
    <div className="rounded-[40px] bg-slate-50/50 p-10 border border-slate-100 shadow-sm h-full flex flex-col justify-between">
      <div className="space-y-10">
        <h2 className="text-2xl font-bold text-slate-900">Suggested Actions</h2>

        <div className="space-y-4">
          {actions.map((action, i) => (
            <div
              key={i}
              className="rounded-3xl bg-blue-50/50 p-8 border border-blue-100 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                    <action.icon size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-10 flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all">
        Platform Roadmap <ChevronRight size={16} />
      </button>
    </div>
  );
}
