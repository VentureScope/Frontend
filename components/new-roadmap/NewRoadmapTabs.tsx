export const EvolutionTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    {
      id: "current",
      label: "Current Trending Roles",
      description:
        "Roles with the strongest hiring momentum in live market data from the selected period.",
    },
    {
      id: "future",
      label: "Future Predicted Roles",
      description:
        "Compare all forecasted roles at a glance — ranked by projected monthly postings. Click a bar to pick your roadmap target.",
    },
  ];

  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="space-y-4">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`text-btn relative px-4 pb-4 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-[-1px] left-0 h-[3px] w-full bg-primary" />
            )}
          </button>
        ))}
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {active.description}
      </p>
    </div>
  );
};
