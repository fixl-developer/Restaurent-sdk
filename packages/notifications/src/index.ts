import type { HttpClient } from '@fixl1234/restaurent-core';

// ── Types ─────────────────────────────────────────────────────────────────────

export type NotificationChannel = 'sms' | 'whatsapp' | 'push' | 'email';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

export interface NotificationDto {
  _id: string;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  body: string;
  status: NotificationStatus;
  orderId?: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface SendNotificationInput {
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  body: string;
  orderId?: string;
}

export interface OrderStatusNotificationInput {
  orderId: string;
  phone: string;
  channel?: NotificationChannel;
}

export interface NotificationQuery {
  channel?: NotificationChannel;
  status?: NotificationStatus;
  orderId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

// ── NotificationsClient ───────────────────────────────────────────────────────

export class NotificationsClient {
  constructor(private http: HttpClient) {}

  /** Send a custom notification to any recipient. */
  async send(input: SendNotificationInput): Promise<NotificationDto> {
    return this.http.post<NotificationDto>('/notifications', input);
  }

  /** Send an order status update notification to the guest. */
  async notifyOrderStatus(input: OrderStatusNotificationInput): Promise<NotificationDto> {
    return this.http.post<NotificationDto>('/notifications/order-status', input);
  }

  /** Send a bill-ready notification to the guest (requesting bill). */
  async notifyBillReady(orderId: string, phone: string): Promise<NotificationDto> {
    return this.http.post<NotificationDto>('/notifications/bill-ready', { orderId, phone });
  }

  /** Send an order-ready notification for window/takeaway pickup. */
  async notifyOrderReady(orderId: string, phone: string): Promise<NotificationDto> {
    return this.http.post<NotificationDto>('/notifications/order-ready', { orderId, phone });
  }

  /** List sent notifications with optional filters. */
  async list(query: NotificationQuery = {}): Promise<NotificationDto[]> {
    return this.http.get<NotificationDto[]>('/notifications', { query } as never);
  }

  /** Get a single notification by ID. */
  async get(id: string): Promise<NotificationDto> {
    return this.http.get<NotificationDto>(`/notifications/${id}`);
  }
}
