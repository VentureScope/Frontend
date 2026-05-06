export const EvolutionTabs = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "current", label: "Current Trending Roles" },
    { id: "future", label: "Future Predicted Roles" }
  ];

  return (
    <div className="flex border-b border-slate-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 pb-4 text-[15px] font-bold transition-colors ${
            activeTab === tab.id ? "text-[#2563eb]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-[-1px] left-0 h-[3px] w-full bg-[#2563eb]" />
          )}
        </button>
      ))}
    </div>
  );
};

