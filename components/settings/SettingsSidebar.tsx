"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsTabId =
  | "profile"
  | "intelligence"
  | "ai-advisor"
  | "privacy"
  | "billing";

export type SettingsSidebarItem = {
  id: SettingsTabId;
  label: string;
  icon: LucideIcon;
};

type SettingsSidebarProps = {
  items: SettingsSidebarItem[];
  activeTab: SettingsTabId;
  onTabChange: (id: SettingsTabId) => void;
};

export function SettingsSidebar({
  items,
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-[220px] xl:w-[240px]">
      <p className="mb-3 hidden text-[10px] font-bold uppercase tracking-widest text-muted-foreground lg:block">
        Sections
      </p>
      <nav
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
        aria-label="Settings sections"
      >
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex h-auto shrink-0 items-center gap-2.5 rounded-lg border-l-2 px-3.5 py-2.5 text-left text-sm font-medium transition-colors sm:gap-3 sm:px-4 sm:py-3",
                "lg:w-full lg:gap-3",
                isActive
                  ? "vs-nav-active border-l-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:bg-primary/5 hover:text-foreground",
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground/60",
                )}
              />
              <span className="whitespace-nowrap lg:whitespace-normal">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
