export const EvolutionTabs = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "current", label: "Current Trending Roles" },
    { id: "future", label: "Future Predicted Roles" }
  ];

  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-btn relative px-4 pb-4 font-medium transition-colors ${
            activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-[-1px] left-0 h-[3px] w-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
};

