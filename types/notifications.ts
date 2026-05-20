/** From OpenAPI `NotificationResponse` / `NotificationListResponse` */

export interface NotificationItem {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  body: string;
  is_read: boolean;
  metadata_?: Record<string, unknown> | null;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  total_count: number;
  unread_count: number;
}
