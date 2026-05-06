export const TabNavigation = ({ tabs, activeTabId, onTabChange }: any) => {
  return (
    <div className="mt-12 flex border-b border-slate-200">
      {tabs.map((tab: any) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 pb-4 text-sm font-bold transition-all ${
            activeTabId === tab.id ? "text-blue-700" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {tab.name}
          {activeTabId === tab.id && (
            <div className="absolute bottom-[-1px] left-0 h-1 w-full rounded-full bg-blue-600" />
          )}
        </button>
      ))}
    </div>
  );
};
