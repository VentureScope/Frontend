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
    <div className="vs-surface-accent flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
      <div className="space-y-6 sm:space-y-10">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Suggested Actions
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {actions.map((action, i) => (
            <button
              key={i}
              type="button"
              className="w-full cursor-pointer rounded-md border border-border bg-card p-5 text-left transition-colors hover:border-primary/20 hover:bg-primary/5 sm:p-6 lg:p-8"
            >
              <div className="flex gap-3 sm:gap-4">
                <div className="vs-icon-tile vs-icon-tile-primary flex h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10">
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h4 className="text-body font-medium text-foreground leading-tight">
                    {action.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="text-btn mt-8 flex items-center gap-2 font-medium text-primary transition-all hover:gap-3 sm:mt-10"
      >
        Platform Roadmap <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
