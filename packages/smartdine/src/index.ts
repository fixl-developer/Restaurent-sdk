// ── Core ──────────────────────────────────────────────────────────────────────
export { SmartDineClient, HttpClient, RealtimeClient } from '@fixl1234/restaurent-core';
export { SmartDineError, NotFoundError, UnauthorizedError, ValidationError } from '@fixl1234/restaurent-core';

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  SmartDineConfig,
  OrderStatus, OrderItemStatus, OrderChannel,
  Order, OrderItem, OrderTotals, TaxBreakupLine,
  OrderItemInput, PlaceDineInInput, PlaceWindowInput,
  GuestRequestInput, GuestRequestType,
  MenuResponse, MenuCategory, MenuItem,
  MenuVariant, MenuModifier, MenuModifierGroup,
  Combo, ComboItemRef, FoodType,
  OtpRequestResult, OtpVerifyResult,
  KdsOrder, KdsOrderItem,
} from '@fixl1234/restaurent-types';

// ── Menu ──────────────────────────────────────────────────────────────────────
export { MenuClient } from '@fixl1234/restaurent-menu';
export type { GetMenuOptions } from '@fixl1234/restaurent-menu';

// ── Orders ────────────────────────────────────────────────────────────────────
export { OrdersClient } from '@fixl1234/restaurent-orders';
export type { TrackOptions } from '@fixl1234/restaurent-orders';

// ── OTP ───────────────────────────────────────────────────────────────────────
export { OtpClient } from '@fixl1234/restaurent-otp';

// ── KDS ───────────────────────────────────────────────────────────────────────
export { KdsClient } from '@fixl1234/restaurent-kds';
export type { KdsSubscribeOptions } from '@fixl1234/restaurent-kds';

// ── Auth ──────────────────────────────────────────────────────────────────────
export { AuthClient } from '@fixl1234/restaurent-auth';
export type {
  StaffLoginInput, StaffUser, StaffRole,
  LoginResult, LoginResponse, RefreshResult,
  GuestOtpRequestResult, GuestOtpVerifyResult,
} from '@fixl1234/restaurent-auth';

// ── Payments ──────────────────────────────────────────────────────────────────
export { PaymentsClient } from '@fixl1234/restaurent-payments';
export type {
  InvoiceDto, GenerateInvoiceInput, RecordPaymentInput,
  UpiQrResponse, CashSessionDto,
  PaymentMode, InvoicePaymentStatus, InvoiceStatus,
} from '@fixl1234/restaurent-payments';

// ── Analytics ─────────────────────────────────────────────────────────────────
export { AnalyticsClient } from '@fixl1234/restaurent-analytics';
export type {
  KpiDashboard, SalesReport, SalesDataPoint,
  ItemsReport, ItemReportEntry,
  InventoryReport, InventoryReportEntry,
  ReportsQuery,
} from '@fixl1234/restaurent-analytics';

// ── Notifications ─────────────────────────────────────────────────────────────
export { NotificationsClient } from '@fixl1234/restaurent-notifications';
export type {
  NotificationDto, SendNotificationInput,
  OrderStatusNotificationInput, NotificationQuery,
  NotificationChannel, NotificationStatus,
} from '@fixl1234/restaurent-notifications';
