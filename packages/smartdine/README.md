# @fixl1234/smartdine

Complete SmartDine SDK in a single package — menu, orders, KDS, auth, payments, analytics, and notifications.

## Install

```
npm install @fixl1234/smartdine
```

Requires Node.js 18+. For real-time features (order tracking, KDS live updates), also install:

```
npm install socket.io-client
```

## Quick Start

```ts
import {
  SmartDineClient,
  MenuClient,
  OrdersClient,
  AuthClient,
  PaymentsClient,
  AnalyticsClient,
  KdsClient,
  NotificationsClient,
  OtpClient,
} from '@fixl1234/smartdine';

const sdk = new SmartDineClient({
  baseUrl: 'https://api.myrestaurant.com',
  // apiKey: 'sk_live_...',  // SmartDine cloud
});

// Guest — fetch menu
const menu = new MenuClient(sdk.http);
const fullMenu = await menu.get({ slug: 'my-restaurant' });

// Guest — place order
const orders = new OrdersClient(sdk.http, sdk.realtime);
const order = await orders.placeDineIn({
  qrSlug: 'table-5',
  items: [{ itemId: 'item_abc', qty: 2 }],
});

// Guest — track live
const unsubscribe = orders.track({
  orderId: order.id,
  onStatusChange: (status) => console.log(status),
});

// Staff — login
const auth = new AuthClient(sdk.http);
const session = await auth.staffLogin({ email: 'manager@res.com', password: 'secret' });
sdk.http.setAuthToken(session.accessToken!);

// Staff — billing
const payments = new PaymentsClient(sdk.http);
const invoice = await payments.generateInvoice(order.id);
await payments.recordPayment(invoice._id, { mode: 'upi', amount: invoice.amountDue });

// Staff — analytics
const analytics = new AnalyticsClient(sdk.http);
const kpi = await analytics.kpiDashboard();
console.log('Today revenue:', kpi.todayRevenue);
```

## Clients

| Client | Purpose |
|---|---|
| `SmartDineClient` | Root client — creates `sdk.http` and `sdk.realtime` |
| `MenuClient` | Fetch menu, categories, items, search |
| `OrdersClient` | Place dine-in/window orders, track live, guest requests |
| `OtpClient` | Phone OTP for guest identity verification |
| `KdsClient` | Kitchen display — active orders, item status, live events |
| `AuthClient` | Staff login + 2FA, token refresh, guest OTP |
| `PaymentsClient` | Invoices, payments (cash/UPI/card), UPI QR, cash sessions |
| `AnalyticsClient` | KPI dashboard, sales/items/inventory reports, peak hours |
| `NotificationsClient` | SMS/WhatsApp/push alerts for order status, bill ready, pickup |

## SmartDineClient Config

```ts
const sdk = new SmartDineClient({
  baseUrl: 'https://api.myrestaurant.com', // self-hosted
  // apiKey: 'sk_live_...',               // SmartDine cloud
  timeout: 8000,                          // optional, default 10 000 ms
});
```

Either `baseUrl` or `apiKey` is required.

## MenuClient

```ts
const menu = new MenuClient(sdk.http);

await menu.get({ slug: 'my-restaurant', lang: 'en' });     // full menu
await menu.getCategories({ slug: 'my-restaurant' });        // categories only
await menu.getItem({ slug: 'my-restaurant' }, 'item_id');   // single item
await menu.search({ slug: 'my-restaurant' }, 'paneer');     // search by name/tag
```

## OrdersClient

```ts
const orders = new OrdersClient(sdk.http, sdk.realtime);

// Place orders
await orders.placeDineIn({ qrSlug: 'table-5', items: [...] });
await orders.placeWindow({ guestName: 'Priya', items: [...] }, guestToken);

// Fetch
await orders.get('order_id');
await orders.findByNumber('ORD-042');

// Guest actions
await orders.sendRequest({ orderId: 'order_id', type: 'bill' });
await orders.submitFeedback('order_id', 5, 'Great food!');

// Live tracking — returns unsubscribe()
const stop = orders.track({
  orderId: 'order_id',
  onStatusChange: (status) => {},
  onUpdate: (order) => {},
});
```

## OtpClient

```ts
const otp = new OtpClient(sdk.http);

const { sentTo } = await otp.request('+919876543210');
const { guestToken } = await otp.verify('+919876543210', '482910');
```

## KdsClient

```ts
const kds = new KdsClient(sdk.http, sdk.realtime);

await kds.getActiveOrders();
await kds.updateItemStatus('order_id', 'item_id', 'ready');

const stop = kds.subscribe({
  onNewOrder: (order) => {},
  onItemUpdate: (orderId, item) => {},
});
```

## AuthClient

```ts
const auth = new AuthClient(sdk.http);

// Staff
const result = await auth.staffLogin({ email: '...', password: '...' });
if (result.mfaRequired) {
  const session = await auth.staffVerify2fa(result.userId!, code);
  sdk.http.setAuthToken(session.accessToken);
} else {
  sdk.http.setAuthToken(result.accessToken!);
}

await auth.refreshToken(refreshToken);
await auth.me();
await auth.staffLogout();

// Guest OTP
await auth.guestOtpRequest('+919876543210');
await auth.guestOtpVerify('+919876543210', '482910');
```

## PaymentsClient

```ts
const payments = new PaymentsClient(sdk.http);

const invoice = await payments.generateInvoice('order_id', { discount: 50, couponCode: 'SAVE10' });
await payments.recordPayment(invoice._id, { mode: 'cash', amount: 450, cashTendered: 500 });
await payments.upiQr(invoice._id);
await payments.voidInvoice(invoice._id, 'Cancelled');

await payments.openCashSession(2000);
await payments.currentCashSession();
await payments.closeCashSession(session._id, 5400);
```

## AnalyticsClient

```ts
const analytics = new AnalyticsClient(sdk.http);

await analytics.kpiDashboard();
await analytics.salesReport({ from: '2024-06-01', to: '2024-06-30', groupBy: 'day' });
await analytics.itemsReport({ limit: 20 });
await analytics.inventoryReport();
await analytics.channelBreakdown();
await analytics.peakHours();
```

## NotificationsClient

```ts
const notifs = new NotificationsClient(sdk.http);

await notifs.notifyOrderStatus({ orderId: 'order_id', phone: '+91...' });
await notifs.notifyBillReady('order_id', '+91...');
await notifs.notifyOrderReady('order_id', '+91...');
await notifs.send({ channel: 'whatsapp', recipient: '+91...', body: 'Your order is ready' });
```

## Errors

```ts
import { NotFoundError, UnauthorizedError, ValidationError, SmartDineError } from '@fixl1234/smartdine';

try {
  await orders.get('bad_id');
} catch (err) {
  if (err instanceof NotFoundError) console.error('Not found');
  if (err instanceof UnauthorizedError) console.error('Login required');
}
```

## Individual Packages

Each client is also available as its own package if you want to install only what you need:

`@fixl1234/restaurent-core` · `@fixl1234/restaurent-types` · `@fixl1234/restaurent-menu` · `@fixl1234/restaurent-orders` · `@fixl1234/restaurent-otp` · `@fixl1234/restaurent-kds` · `@fixl1234/restaurent-auth` · `@fixl1234/restaurent-payments` · `@fixl1234/restaurent-analytics` · `@fixl1234/restaurent-notifications`
