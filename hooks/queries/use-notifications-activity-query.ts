"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { isDashboardHomePath } from "@/lib/dashboard-routes";
import { queryKeys } from "@/lib/query-keys";
import { fetchNotificationsActivity } from "@/lib/queries/notifications";
import { useAppStore } from "@/store/useAppStore";

/** Recent notifications for dashboard overview (home only). */
export function useNotificationsActivityQuery(options?: { enabled?: boolean }) {
  const pathname = usePathname();
  const token = useAppStore((s) => s.authData.token);
  const enabled =
    Boolean(token) &&
    isDashboardHomePath(pathname) &&
    (options?.enabled ?? true);

  return useQuery({
    queryKey: queryKeys.notifications.activity(),
    queryFn: fetchNotificationsActivity,
    enabled,
  });
}
