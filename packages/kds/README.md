# @fixl1234/restaurent-kds

Kitchen Display System module for the SmartDine SDK. Fetch active orders, update item preparation status, and subscribe to live kitchen events via Socket.IO.

## Install

```
npm install @fixl1234/restaurent-kds @fixl1234/restaurent-core
```

Requires staff authentication — call `http.setAuthToken(token)` before using.

## Setup

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';
import { KdsClient } from '@fixl1234/restaurent-kds';

const sdk = new SmartDineClient({ baseUrl: 'https://api.myrestaurant.com' });
sdk.http.setAuthToken(staffAccessToken);

const kds = new KdsClient(sdk.http, sdk.realtime);
```

## KdsClient

### kds.getActiveOrders()

Fetch all orders currently in the kitchen (placed, accepted, or preparing).

```ts
const orders = await kds.getActiveOrders();
orders.forEach((order) => {
  console.log(order.orderNumber, order.channel, order.items.length, 'items');
});
```

### kds.updateItemStatus(orderId, itemId, status)

Mark a single item as `'accepting'`, `'preparing'`, `'ready'`, or `'served'`.

```ts
await kds.updateItemStatus('order_abc', 'item_xyz', 'ready');
```

### kds.subscribe(options)

Subscribe to real-time KDS events. Returns an `unsubscribe` function.

```ts
const unsubscribe = kds.subscribe({
  onNewOrder: (order) => {
    console.log('New order:', order.orderNumber);
    addToKdsBoard(order);
  },
  onItemUpdate: (orderId, item) => {
    console.log('Item updated:', item.name, item.status);
    refreshItem(orderId, item);
  },
  onOrderUpdate: (order) => {
    refreshOrder(order);
  },
});

// Stop listening when the KDS screen is unmounted:
unsubscribe();
```

## Types

```ts
import type { KdsOrder, KdsOrderItem } from '@fixl1234/restaurent-kds';
```

`KdsOrder` includes `orderNumber`, `channel`, `tableLabel`, `windowToken`, `placedAt`, and `items[]`.

`KdsOrderItem` includes `name`, `variantName`, `qty`, `status`, `modifiers`, `notes`.

## Public Exports

`KdsClient`, `KdsSubscribeOptions`, `KdsOrder`, `KdsOrderItem`
