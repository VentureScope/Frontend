export const CURRENT_TRENDS_TAB = "current-trends";
export const FUTURE_PREDICTIONS_TAB = "future-predictions";

export function normalizeTrendName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildTrendNameSet(names: string[]): Set<string> {
  return new Set(names.map((n) => normalizeTrendName(n)).filter(Boolean));
}

function matchesSet(trendName: string, names: Set<string>): boolean {
  const key = normalizeTrendName(trendName);
  if (names.has(key)) {
    return true;
  }
  for (const candidate of names) {
    if (key.includes(candidate) || candidate.includes(key)) {
      return true;
    }
  }
  return false;
}

/**
 * Current tab (default): all roadmaps except those tagged as future trending roles.
 * Future tab: only roadmaps whose trend_name appears on the future-trending API.
 */
export function roadmapBelongsToTab(
  trendName: string | null | undefined,
  tabId: string,
  futureTrendNames: Set<string>,
): boolean {
  const name = trendName?.trim() ?? "";
  const inFuture = name.length > 0 && matchesSet(name, futureTrendNames);

  if (tabId === FUTURE_PREDICTIONS_TAB) {
    return inFuture;
  }

  // Current trends tab — default bucket; never infer “future” from a shared list
  return !inFuture;
}
