# @fixl1234/restaurent-analytics

Analytics module for the SmartDine SDK. KPI dashboard, sales reports, top-item rankings, inventory status, channel breakdowns, and peak-hour heatmaps.

## Install

```
npm install @fixl1234/restaurent-analytics @fixl1234/restaurent-core
```

Requires staff authentication — call `http.setAuthToken(token)` before using.

## Setup

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';
import { AnalyticsClient } from '@fixl1234/restaurent-analytics';

const sdk = new SmartDineClient({ baseUrl: 'https://api.myrestaurant.com' });
sdk.http.setAuthToken(staffAccessToken);

const analytics = new AnalyticsClient(sdk.http);
```

## AnalyticsClient

### analytics.kpiDashboard()

Today's at-a-glance KPIs — revenue, orders, average order value, active orders, low-stock alerts, pending guest requests, and rating.

```ts
const kpi = await analytics.kpiDashboard();

console.log('Today revenue:', kpi.todayRevenue);
console.log('Orders:', kpi.todayOrders);
console.log('Avg order:', kpi.avgOrderValue);
console.log('Active:', kpi.activeOrders);
console.log('Low stock items:', kpi.lowStockItems);
console.log('Rating:', kpi.averageRating, '/', kpi.totalReviews, 'reviews');
```

### analytics.salesReport(query?)

Revenue and order counts over a date range, grouped by day / week / month.

```ts
const report = await analytics.salesReport({
  from: '2024-06-01',
  to: '2024-06-30',
  groupBy: 'day',
});

console.log('Total revenue:', report.totalRevenue);
console.log('Total orders:', report.totalOrders);
report.data.forEach((pt) => console.log(pt.date, pt.revenue, pt.orders));
```

### analytics.itemsReport(query?)

Ranked list of items by quantity sold and revenue — useful for menu engineering.

```ts
const report = await analytics.itemsReport({
  from: '2024-06-01',
  to: '2024-06-30',
  limit: 20,
});

report.items.forEach((item) => {
  console.log(item.name, item.qty, 'sold,', item.revenue, 'revenue');
});
```

### analytics.inventoryReport()

Current stock levels for all inventory items with low-stock and out-of-stock flags.

```ts
const report = await analytics.inventoryReport();

console.log('Low stock:', report.lowStockCount);
console.log('Out of stock:', report.outOfStockCount);
report.items
  .filter((i) => i.isLow)
  .forEach((i) => console.log(i.name, i.currentStock, '/', i.reorderPoint));
```

### analytics.channelBreakdown(query?)

Revenue and order count split by channel (dine-in, window, delivery).

```ts
const breakdown = await analytics.channelBreakdown({ from: '2024-06-01', to: '2024-06-30' });

// breakdown['dine_in'].revenue, breakdown['window'].orders, ...
Object.entries(breakdown).forEach(([channel, data]) => {
  console.log(channel, data.revenue, data.orders);
});
```

### analytics.peakHours(query?)

Orders and revenue per hour of day — use to visualise your busiest times.

```ts
const peaks = await analytics.peakHours({ from: '2024-06-01', to: '2024-06-30' });

peaks.forEach((slot) => {
  console.log(`${slot.hour}:00 — ${slot.orders} orders, ₹${slot.revenue}`);
});
```

## Common Query Options

```ts
interface ReportsQuery {
  from?: string;           // ISO date e.g. '2024-06-01'
  to?: string;
  groupBy?: 'day' | 'week' | 'month';
  channel?: 'dine_in' | 'window' | 'assisted';
}
```

## Types

```ts
import type {
  KpiDashboard,
  SalesReport,
  SalesDataPoint,
  ItemsReport,
  ItemReportEntry,
  InventoryReport,
  InventoryReportEntry,
  ReportsQuery,
} from '@fixl1234/restaurent-analytics';
```

## Public Exports

`AnalyticsClient`, `KpiDashboard`, `SalesReport`, `SalesDataPoint`, `ItemsReport`, `ItemReportEntry`, `InventoryReport`, `InventoryReportEntry`, `ReportsQuery`
