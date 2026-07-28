# @fixl1234/restaurent-orders

Orders module for the SmartDine SDK. Place dine-in and window orders, track live status, send guest requests, and submit feedback.

## Install

```
npm install @fixl1234/restaurent-orders @fixl1234/restaurent-core
```

## Setup

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';
import { OrdersClient } from '@fixl1234/restaurent-orders';

const sdk = new SmartDineClient({ baseUrl: 'https://api.myrestaurant.com' });
const orders = new OrdersClient(sdk.http, sdk.realtime);
```

## OrdersClient

### orders.placeDineIn(input)

Place a dine-in order for a table (via QR slug or table ID). No authentication required.

```ts
const order = await orders.placeDineIn({
  qrSlug: 'table-5',
  guestName: 'Rahul',
  guestNotes: 'Less spicy please',
  items: [
    { itemId: 'item_abc', qty: 2 },
    { itemId: 'item_xyz', qty: 1, variantId: 'variant_large' },
  ],
  couponCode: 'SAVE10',
});

console.log(order.orderNumber, order.status);
```

### orders.placeWindow(input, guestToken?)

Place a window / takeaway order. Pass `guestToken` from OTP verification to associate the order with the guest.

```ts
const order = await orders.placeWindow(
  {
    guestName: 'Priya',
    pickupAt: '2024-06-01T13:00:00Z',
    items: [{ itemId: 'item_abc', qty: 1 }],
  },
  guestToken,
);
```

### orders.get(orderId)

Fetch a single order by ID.

```ts
const order = await orders.get('order_abc123');
console.log(order.status, order.totals.grand);
```

### orders.findByNumber(orderNumber)

Fetch an order by its human-readable number (e.g. `'ORD-042'`).

```ts
const order = await orders.findByNumber('ORD-042');
```

### orders.sendRequest(input)

Send a guest request (call waiter, request water, ask for bill, etc.).

```ts
await orders.sendRequest({
  orderId: 'order_abc123',
  type: 'bill',         // 'call_waiter' | 'water' | 'bill' | 'other'
  note: 'Please bring receipt',
});
```

### orders.submitFeedback(orderId, rating, text?)

Submit a star rating and optional comment after the meal.

```ts
await orders.submitFeedback('order_abc123', 5, 'Great food and service!');
```

### orders.track(options)

Subscribe to real-time order updates via Socket.IO. Returns an `unsubscribe` function.

```ts
const unsubscribe = orders.track({
  orderId: 'order_abc123',
  onStatusChange: (status) => console.log('Status:', status),
  onItemStatusChange: (itemId, status) => console.log(itemId, status),
  onUpdate: (order) => setOrder(order),
});

// Later, when the component unmounts:
unsubscribe();
```

## Types

```ts
import type {
  Order,
  PlaceDineInInput,
  PlaceWindowInput,
  GuestRequestInput,
} from '@fixl1234/restaurent-orders';
```

## Public Exports

`OrdersClient`, `TrackOptions`, `Order`, `PlaceDineInInput`, `PlaceWindowInput`, `GuestRequestInput`
