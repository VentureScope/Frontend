export type AdminNotificationSource = "pipeline" | "sentry" | string;

export interface AdminNotificationItem {
  id: string;
  source: AdminNotificationSource;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  event_type?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface AdminNotificationListResponse {
  items: AdminNotificationItem[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  unread_count: number;
}
