"use client";

import {
  MARKET_TRENDS_CURRENT_TAB,
  MARKET_TRENDS_FUTURE_TAB,
} from "@/lib/market-trends-tabs";

export function MarketTrendsTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const tabs = [
    {
      id: MARKET_TRENDS_FUTURE_TAB,
      label: "Future demand",
      description:
        "Ensemble forecasts ranked by projected postings. Compare roles, then inspect month-by-month progression for any selection.",
    },
    {
      id: MARKET_TRENDS_CURRENT_TAB,
      label: "Current market",
      description:
        "Live hiring volume, momentum, and in-demand skills from indexed listings in your selected period.",
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
}
