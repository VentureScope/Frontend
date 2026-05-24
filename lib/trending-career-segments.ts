export const CURRENT_TRENDS_TAB = "current-trends";
export const FUTURE_PREDICTIONS_TAB = "future-predictions";

export function normalizeTrendName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildTrendNameSet(names: string[]): Set<string> {
  return new Set(names.map((n) => normalizeTrendName(n)).filter(Boolean));
}

export function normalizeRoadmapTrendMode(
  mode: string | null | undefined,
): "current" | "future" {
  return mode?.toLowerCase() === "future" ? "future" : "current";
}

/** Filter list items by API `trend_mode` for Current vs Future tabs. */
export function roadmapBelongsToTab(
  trendMode: string | null | undefined,
  tabId: string,
): boolean {
  const mode = normalizeRoadmapTrendMode(trendMode);
  if (tabId === FUTURE_PREDICTIONS_TAB) {
    return mode === "future";
  }
  return mode === "current";
}
