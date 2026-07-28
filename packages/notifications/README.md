# @fixl1234/restaurent-notifications

Notifications module for the SmartDine SDK. Send order status alerts, bill-ready and pickup-ready messages to guests via SMS, WhatsApp, push, or email.

## Install

```
npm install @fixl1234/restaurent-notifications @fixl1234/restaurent-core
```

Requires staff authentication — call `http.setAuthToken(token)` before using.

## Setup

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';
import { NotificationsClient } from '@fixl1234/restaurent-notifications';

const sdk = new SmartDineClient({ baseUrl: 'https://api.myrestaurant.com' });
sdk.http.setAuthToken(staffAccessToken);

const notifications = new NotificationsClient(sdk.http);
```

## NotificationsClient

### notifications.send(input)

Send a fully custom notification to any recipient.

```ts
const notification = await notifications.send({
  channel: 'whatsapp',
  recipient: '+919876543210',
  subject: 'Your order is ready',
  body: 'Hi Rahul, your order ORD-042 is ready for pickup at the counter.',
  orderId: 'order_abc123',
});

console.log(notification._id, notification.status);
```

`channel`: `'sms' | 'whatsapp' | 'push' | 'email'`

### notifications.notifyOrderStatus(input)

Send a templated order-status update to the guest.

```ts
await notifications.notifyOrderStatus({
  orderId: 'order_abc123',
  phone: '+919876543210',
  channel: 'sms',         // optional, default: 'sms'
});
```

### notifications.notifyBillReady(orderId, phone)

Notify the guest that their bill is ready (triggered when they request the bill).

```ts
await notifications.notifyBillReady('order_abc123', '+919876543210');
```

### notifications.notifyOrderReady(orderId, phone)

Notify the guest that their window/takeaway order is ready for pickup.

```ts
await notifications.notifyOrderReady('order_abc123', '+919876543210');
```

### notifications.list(query?)

List sent notifications with optional filters.

```ts
const sent = await notifications.list({
  channel: 'whatsapp',
  status: 'delivered',
  orderId: 'order_abc123',
  from: '2024-06-01',
  to: '2024-06-30',
  page: 1,
  limit: 50,
});
```

### notifications.get(id)

Fetch a single notification by ID.

```ts
const notification = await notifications.get('notif_abc123');
console.log(notification.status, notification.deliveredAt);
```

## Types

```ts
import type {
  NotificationDto,
  SendNotificationInput,
  OrderStatusNotificationInput,
  NotificationQuery,
  NotificationChannel,
  NotificationStatus,
} from '@fixl1234/restaurent-notifications';
```

`NotificationStatus`: `'pending' | 'sent' | 'delivered' | 'failed' | 'read'`

## Public Exports

`NotificationsClient`, `NotificationDto`, `SendNotificationInput`, `OrderStatusNotificationInput`, `NotificationQuery`, `NotificationChannel`, `NotificationStatus`
