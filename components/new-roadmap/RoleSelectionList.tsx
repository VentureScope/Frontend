import { Check, Cpu, Share2, Shield, BarChart2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoadmapRoleItem = {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeType: "high-demand" | "steady-growth";
  count: string;
  iconName: string;
};

interface RoleItemProps extends RoadmapRoleItem {
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Cpu":
      return <Cpu size={24} />;
    case "Share2":
      return <Share2 size={24} />;
    case "Shield":
      return <Shield size={24} />;
    case "BarChart2":
      return <BarChart2 size={24} />;
    default:
      return <Cpu size={24} />;
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
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={isSelected}
      className={cn(
        "group relative flex w-full cursor-pointer flex-col gap-4 rounded-[24px] border p-6 text-left transition-all duration-200 sm:flex-row sm:items-center sm:justify-between",
        isSelected
          ? "border-primary bg-muted shadow-md ring-2 ring-primary/25"
          : "border-border bg-card hover:border-border hover:bg-muted/50",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center sm:gap-6">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center pt-0.5 sm:pt-0">
          {isSelected ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
              <Check
                size={14}
                strokeWidth={4}
                className="text-primary-foreground"
              />
            </div>
          ) : (
            <Circle
              className="text-muted-foreground/60 group-hover:text-muted-foreground"
              size={24}
              strokeWidth={1.5}
            />
          )}
        </div>

        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-lg transition-colors",
            isSelected
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground group-hover:text-foreground",
          )}
        >
          {getIcon(iconName)}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="text-lg font-semibold text-foreground sm:text-xl">
              {title}
            </h3>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                badgeType === "high-demand"
                  ? "bg-muted text-secondary"
                  : "bg-success/15 text-success",
              )}
            >
              {badge}
            </span>
          </div>
          <p className="text-body text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-border pt-3 text-left sm:border-t-0 sm:pt-0 sm:text-right sm:pl-4">
        <div className="text-2xl font-semibold text-foreground">{count}</div>
        <div className="text-[12px] font-medium text-muted-foreground">
          Active Openings
        </div>
      </div>
    </button>
  );
};

export const RoleSelectionList = ({
  roles,
  selectedId,
  onSelect,
}: {
  roles: RoadmapRoleItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="space-y-4" role="listbox" aria-label="Trending roles">
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
