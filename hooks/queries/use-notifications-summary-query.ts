"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { isDashboardPath } from "@/lib/dashboard-routes";
import { queryKeys } from "@/lib/query-keys";
import { fetchNotificationsSummary } from "@/lib/queries/notifications";
import { useAppStore } from "@/store/useAppStore";

/** Lightweight unread count for the dashboard header bell. */
export function useNotificationsSummaryQuery(options?: { enabled?: boolean }) {
  const pathname = usePathname();
  const token = useAppStore((s) => s.authData.token);
  const enabled =
    Boolean(token) &&
    isDashboardPath(pathname) &&
    (options?.enabled ?? true);

  return useQuery({
    queryKey: queryKeys.notifications.summary(),
    queryFn: fetchNotificationsSummary,
    enabled,
  });
}
