export const TabNavigation = ({
  tabs,
  activeTabId,
  onTabChange,
}: {
  tabs: { id: string; name: string }[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}) => {
  return (
    <div className="mt-12 flex border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`text-btn relative px-4 pb-4 font-medium transition-colors ${
            activeTabId === tab.id
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.name}
          {activeTabId === tab.id && (
            <span className="absolute bottom-[-1px] left-0 h-[3px] w-full rounded-lg bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
};
