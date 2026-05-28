/** In-memory notification summary for badge dedup (Phase 1; replaced by React Query in Phase 3). */

const TTL_MS = 60_000;

type NotificationSummaryCache = {
  unreadCount: number;
  fetchedAt: number;
};

let cache: NotificationSummaryCache | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function getNotificationSummaryCache(): NotificationSummaryCache | null {
  if (!cache) return null;
  if (Date.now() - cache.fetchedAt > TTL_MS) {
    cache = null;
    return null;
  }
  return cache;
}

export function getCachedNotificationUnreadCount(): number | null {
  return getNotificationSummaryCache()?.unreadCount ?? null;
}

export function setNotificationSummaryCache(unreadCount: number): void {
  cache = { unreadCount, fetchedAt: Date.now() };
  notify();
}

export function adjustCachedNotificationUnreadCount(delta: number): void {
  const current = getNotificationSummaryCache();
  if (!current) return;
  cache = {
    unreadCount: Math.max(0, current.unreadCount + delta),
    fetchedAt: current.fetchedAt,
  };
  notify();
}

export function clearNotificationSummaryCache(): void {
  cache = null;
  notify();
}

export function subscribeNotificationSummaryCache(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
