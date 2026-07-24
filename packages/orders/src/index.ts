import type { HttpClient, RealtimeClient } from '@smartdine/core';
import type {
  Order,
  PlaceDineInInput,
  PlaceWindowInput,
  GuestRequestInput,
  OrderStatus,
  OrderItemStatus,
} from '@smartdine/types';

export interface TrackOptions {
  orderId: string;
  onStatusChange?: (status: OrderStatus) => void;
  onItemStatusChange?: (itemId: string, status: OrderItemStatus) => void;
  onUpdate?: (order: Order) => void;
}

export class OrdersClient {
  constructor(
    private http: HttpClient,
    private realtime: RealtimeClient,
  ) {}

  async placeDineIn(input: PlaceDineInInput): Promise<Order> {
    return this.http.post<Order>('/guest/orders/dine-in', input, { noAuth: true });
  }

  async placeWindow(input: PlaceWindowInput, guestToken?: string): Promise<Order> {
    if (guestToken) this.http.setAuthToken(guestToken);
    const order = await this.http.post<Order>('/guest/orders/window', input);
    if (guestToken) this.http.clearAuthToken();
    return order;
  }

  async get(orderId: string): Promise<Order> {
    return this.http.get<Order>(`/guest/orders/${orderId}`, { noAuth: true });
  }

  async findByNumber(orderNumber: string): Promise<Order> {
    return this.http.get<Order>(
      `/guest/orders/by-number/${encodeURIComponent(orderNumber)}`,
      { noAuth: true },
    );
  }

  async sendRequest(input: GuestRequestInput): Promise<void> {
    await this.http.post(`/guest/orders/${input.orderId}/requests`, {
      type: input.type,
      note: input.note,
    });
  }

  async submitFeedback(orderId: string, rating: number, text?: string): Promise<void> {
    await this.http.post(`/guest/orders/${orderId}/feedback`, { rating, text });
  }

  track(options: TrackOptions): () => void {
    return this.realtime.subscribe(
      'guest',
      {
        'order:updated': () => {
          this.get(options.orderId).then(options.onUpdate ?? (() => {}));
        },
        'order:status_changed': (data: unknown) => {
          const { status } = data as { status: OrderStatus };
          options.onStatusChange?.(status);
          this.get(options.orderId).then(options.onUpdate ?? (() => {}));
        },
        'order:item_status_changed': (data: unknown) => {
          const { itemId, status } = data as { itemId: string; status: OrderItemStatus };
          options.onItemStatusChange?.(itemId, status);
        },
      },
      { orderId: options.orderId },
    );
  }
}

export type { Order, PlaceDineInInput, PlaceWindowInput, GuestRequestInput };
