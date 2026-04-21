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
    <div className="rounded-3xl sm:rounded-[40px] bg-slate-50/50 p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-sm h-full flex flex-col justify-between">
      <div className="space-y-6 sm:space-y-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Suggested Actions
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {actions.map((action, i) => (
            <div
              key={i}
              className="rounded-2xl sm:rounded-3xl bg-blue-50/50 p-5 sm:p-6 lg:p-8 border border-blue-100 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div className="flex gap-3 sm:gap-4">
                <div className="shrink-0">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                    <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    {action.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-8 sm:mt-10 flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 hover:gap-3 transition-all">
        Platform Roadmap <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
