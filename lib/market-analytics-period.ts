export type MarketPeriodId = "all" | "3m" | "6m" | "1y";

export type MarketAnalyticsPeriod = {
  id: MarketPeriodId;
  label: string;
  /** Days to look back (`period` query param on jobs APIs). */
  days: number;
};

/** Wide lookback passed to `/api/jobs/stats` for full corpus totals. */
export const MARKET_ALL_TIME_DAYS = 10_000;

export const MARKET_ANALYTICS_PERIODS: MarketAnalyticsPeriod[] = [
  { id: "all", label: "All time", days: MARKET_ALL_TIME_DAYS },
  { id: "3m", label: "3 months", days: 90 },
  { id: "6m", label: "6 months", days: 180 },
  { id: "1y", label: "1 year", days: 365 },
];

export const DEFAULT_MARKET_PERIOD_ID: MarketPeriodId = "3m";

export const MARKET_PERIOD_STORAGE_KEY = "venturescope.marketAnalyticsPeriod";

const PERIOD_BY_ID = Object.fromEntries(
  MARKET_ANALYTICS_PERIODS.map((p) => [p.id, p]),
) as Record<MarketPeriodId, MarketAnalyticsPeriod>;

export function isMarketPeriodId(value: string): value is MarketPeriodId {
  return value === "all" || value === "3m" || value === "6m" || value === "1y";
}

export function isMarketAllTimePeriod(id: MarketPeriodId): boolean {
  return id === "all";
}

export function marketPeriodFromId(id: MarketPeriodId): MarketAnalyticsPeriod {
  return PERIOD_BY_ID[id];
}

export function marketPeriodDays(id: MarketPeriodId): number {
  return PERIOD_BY_ID[id].days;
}

export function marketPeriodLabel(id: MarketPeriodId): string {
  return PERIOD_BY_ID[id].label;
}

/** e.g. "all time" or "the last 3 months" */
export function marketPeriodLookbackPhrase(days: number): string {
  if (days >= MARKET_ALL_TIME_DAYS) {
    return "all time";
  }
  const match = MARKET_ANALYTICS_PERIODS.find((p) => p.days === days);
  if (match) {
    return match.id === "all" ? "all time" : `the last ${match.label}`;
  }
  return `the last ${days} days`;
}

export function readStoredMarketPeriodId(): MarketPeriodId {
  if (typeof window === "undefined") {
    return DEFAULT_MARKET_PERIOD_ID;
  }
  const stored = window.localStorage.getItem(MARKET_PERIOD_STORAGE_KEY);
  return stored && isMarketPeriodId(stored) ? stored : DEFAULT_MARKET_PERIOD_ID;
}

export function writeStoredMarketPeriodId(id: MarketPeriodId): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(MARKET_PERIOD_STORAGE_KEY, id);
}

export const MARKET_PERIOD_CHANGE_EVENT = "venturescope:market-period-change";

export function dispatchMarketPeriodChange(id: MarketPeriodId): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<MarketPeriodId>(MARKET_PERIOD_CHANGE_EVENT, { detail: id }),
  );
}
