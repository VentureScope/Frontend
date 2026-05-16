export const TabNavigation = ({ tabs, activeTabId, onTabChange }: any) => {
  return (
    <div className="mt-12 flex border-b border-border">
      {tabs.map((tab: any) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 pb-4 text-sm font-bold transition-all ${
            activeTabId === tab.id ? "text-primary" : "text-muted-foreground hover:text-muted-foreground"
          }`}
        >
          {tab.name}
          {activeTabId === tab.id && (
            <div className="absolute bottom-[-1px] left-0 h-1 w-full rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
};
