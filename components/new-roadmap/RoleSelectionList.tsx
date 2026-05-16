import { Check, Cpu, Share2, Shield, BarChart2, Circle } from "lucide-react";

interface RoleItemProps {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeType: "high-demand" | "steady-growth";
  count: string;
  iconName: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Cpu": return <Cpu size={24} />;
    case "Share2": return <Share2 size={24} />;
    case "Shield": return <Shield size={24} />;
    case "BarChart2": return <BarChart2 size={24} />;
    default: return <Cpu size={24} />;
  }
};

const RoleItem = ({
  id,
  title,
  description,
  badge,
  badgeType,
  count,
  iconName,
  isSelected,
  onSelect,
}: RoleItemProps) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative flex cursor-pointer items-center justify-between rounded-[24px] border p-6 transition-all duration-200 ${
        isSelected
          ? "border-primary/20 bg-[#f4f8ff] shadow-sm"
          : "border-border bg-card hover:border-border"
      }`}
    >
      <div className="flex items-center gap-6">
        {/* Selection Indicator */}
        <div className="flex h-6 w-6 items-center justify-center">
          {isSelected ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563eb]">
              <Check size={14} strokeWidth={4} className="text-white" />
            </div>
          ) : (
            <Circle className="text-muted-foreground/50" size={24} strokeWidth={1.5} />
          )}
        </div>

        {/* Icon Container */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            isSelected
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {getIcon(iconName)}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                badgeType === "high-demand"
                  ? "bg-[#be123c] text-white"
                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {badge}
            </span>
          </div>
          <p className="text-[15px] text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="text-right">
        <div className="text-2xl font-bold text-foreground">{count}</div>
        <div className="text-[12px] font-medium text-muted-foreground">
          Active Openings
        </div>
      </div>
    </div>
  );
};

export const RoleSelectionList = ({
  roles,
  selectedId,
  onSelect,
}: {
  roles: any[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <RoleItem
          key={role.id}
          {...role}
          isSelected={selectedId === role.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
