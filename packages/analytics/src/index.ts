import type { HttpClient } from '@fixl1234/restaurent-core';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface KpiDashboard {
  todayRevenue: number;
  todayOrders: number;
  avgOrderValue: number;
  activeOrders: number;
  lowStockItems: number;
  pendingRequests: number;
  averageRating: number;
  totalReviews: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
  avgValue: number;
}

export interface SalesReport {
  from: string;
  to: string;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  data: SalesDataPoint[];
}

export interface ItemReportEntry {
  itemId: string;
  name: string;
  category: string;
  qty: number;
  revenue: number;
  avgRating?: number;
}

export interface ItemsReport {
  from: string;
  to: string;
  items: ItemReportEntry[];
}

export interface InventoryReportEntry {
  itemId: string;
  name: string;
  unit: string;
  currentStock: number;
  reorderPoint: number;
  isLow: boolean;
}

export interface InventoryReport {
  items: InventoryReportEntry[];
  lowStockCount: number;
  outOfStockCount: number;
}

export interface ReportsQuery {
  from?: string;
  to?: string;
  groupBy?: 'day' | 'week' | 'month';
  channel?: 'dine_in' | 'window' | 'assisted';
}

// ── AnalyticsClient ───────────────────────────────────────────────────────────

export class AnalyticsClient {
  constructor(private http: HttpClient) {}

  /** Get today's KPI summary (revenue, orders, avg value, active orders, etc.). */
  async kpiDashboard(): Promise<KpiDashboard> {
    return this.http.get<KpiDashboard>('/reports/kpi');
  }

  /** Get sales report for a date range. */
  async salesReport(query: ReportsQuery = {}): Promise<SalesReport> {
    return this.http.get<SalesReport>('/reports/sales', { query } as never);
  }

  /** Get top/bottom items report for a date range. */
  async itemsReport(query: ReportsQuery & { limit?: number } = {}): Promise<ItemsReport> {
    return this.http.get<ItemsReport>('/reports/items', { query } as never);
  }

  /** Get inventory stock levels and low-stock alerts. */
  async inventoryReport(): Promise<InventoryReport> {
    return this.http.get<InventoryReport>('/reports/inventory');
  }

  /** Get revenue breakdown by channel (dine-in, window, delivery). */
  async channelBreakdown(query: ReportsQuery = {}): Promise<Record<string, { revenue: number; orders: number }>> {
    return this.http.get('/reports/channels', { query } as never);
  }

  /** Get peak hour heatmap data (orders per hour of day). */
  async peakHours(query: ReportsQuery = {}): Promise<Array<{ hour: number; orders: number; revenue: number }>> {
    return this.http.get('/reports/peak-hours', { query } as never);
  }
}
