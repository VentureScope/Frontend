"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { isDashboardHomePath, isDashboardPath } from "@/lib/dashboard-routes";
import { queryKeys } from "@/lib/query-keys";
import { fetchNotificationsSummary } from "@/lib/queries/notifications";
import { useAppStore } from "@/store/useAppStore";

/** Unread count on dashboard sub-routes (skipped on home — activity query covers it). */
export function useNotificationsSummaryQuery() {
  const pathname = usePathname();
  const token = useAppStore((s) => s.authData.token);
  const enabled =
    Boolean(token) &&
    isDashboardPath(pathname) &&
    !isDashboardHomePath(pathname);

  return useQuery({
    queryKey: queryKeys.notifications.summary(),
    queryFn: fetchNotificationsSummary,
    enabled,
  });
}
