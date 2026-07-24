import type { HttpClient, RealtimeClient } from '@smartdine/core';
import type { KdsOrder, KdsOrderItem, OrderItemStatus } from '@smartdine/types';

export interface KdsSubscribeOptions {
  onNewOrder?: (order: KdsOrder) => void;
  onItemUpdate?: (orderId: string, item: KdsOrderItem) => void;
  onOrderUpdate?: (order: KdsOrder) => void;
}

export class KdsClient {
  constructor(
    private http: HttpClient,
    private realtime: RealtimeClient,
  ) {}

  async getActiveOrders(): Promise<KdsOrder[]> {
    return this.http.get<KdsOrder[]>('/kds/orders');
  }

  async updateItemStatus(
    orderId: string,
    itemId: string,
    status: OrderItemStatus,
  ): Promise<void> {
    await this.http.patch(`/kds/orders/${orderId}/items/${itemId}`, { status });
  }

  subscribe(options: KdsSubscribeOptions): () => void {
    return this.realtime.subscribe('kds', {
      'order:new': (data: unknown) => {
        options.onNewOrder?.(data as KdsOrder);
      },
      'order:item_updated': (data: unknown) => {
        const { orderId, item } = data as { orderId: string; item: KdsOrderItem };
        options.onItemUpdate?.(orderId, item);
      },
      'order:updated': (data: unknown) => {
        options.onOrderUpdate?.(data as KdsOrder);
      },
    });
  }
}

export type { KdsOrder, KdsOrderItem };
