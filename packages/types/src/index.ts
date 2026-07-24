// ── Order enums ───────────────────────────────────────────────────────────────
export type OrderChannel = 'dine_in' | 'window' | 'delivery';

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'settled'
  | 'cancelled';

export type OrderItemStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'cancelled';

// ── Menu types ────────────────────────────────────────────────────────────────
export type FoodType = 'veg' | 'non_veg' | 'egg' | 'vegan';

export interface MenuVariant {
  id: string;
  name: string;
  priceDelta: number;
  absolutePrice?: number;
}

export interface MenuModifier {
  id: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
}

export interface MenuModifierGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  modifiers: MenuModifier[];
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  categoryId: string;
  basePrice: number;
  foodType: FoodType;
  spiceLevel: number;
  calories?: number;
  allergens: string[];
  tags: string[];
  imageUrl?: string;
  prepTimeMinutes: number;
  variants: MenuVariant[];
  modifierGroups: MenuModifierGroup[];
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconUrl?: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface ComboItemRef {
  itemId: string;
  variantId?: string;
  qty: number;
}

export interface Combo {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  items: ComboItemRef[];
}

export interface MenuResponse {
  lang: string;
  categories: MenuCategory[];
  combos: Combo[];
}

// ── Order totals ──────────────────────────────────────────────────────────────
export interface TaxBreakupLine {
  name: string;
  rate: number;
  amount: number;
}

export interface OrderTotals {
  subtotal: number;
  modifierTotal: number;
  discount: number;
  serviceCharge: number;
  tax: number;
  taxBreakup: TaxBreakupLine[];
  roundOff: number;
  grand: number;
}

// ── Order DTO (guest-facing) ──────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  name: string;
  variantName?: string;
  qty: number;
  lineTotal: number;
  status: OrderItemStatus;
  modifiers: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  channel: OrderChannel;
  windowToken?: string;
  estimatedPrepMinutes: number;
  items: OrderItem[];
  totals: OrderTotals;
}

// ── Order placement inputs ────────────────────────────────────────────────────
export interface OrderItemInput {
  itemId?: string;
  comboId?: string;
  variantId?: string;
  qty: number;
  notes?: string;
  modifiers?: Array<{ groupId: string; modifierId: string }>;
}

export interface PlaceDineInInput {
  qrSlug?: string;
  tableId?: string;
  guestPhone?: string;
  guestName?: string;
  guestNotes?: string;
  items: OrderItemInput[];
  couponCode?: string;
}

export interface PlaceWindowInput {
  guestName?: string;
  guestNotes?: string;
  pickupAt?: string;
  items: OrderItemInput[];
  couponCode?: string;
}

// ── OTP ───────────────────────────────────────────────────────────────────────
export interface OtpRequestResult {
  sentTo: string;
}

export interface OtpVerifyResult {
  verified: boolean;
  phone: string;
  guestToken: string;
  expiresInMin: number;
}

// ── Guest requests ────────────────────────────────────────────────────────────
export type GuestRequestType = 'call_waiter' | 'water' | 'bill' | 'other';

export interface GuestRequestInput {
  orderId: string;
  type: GuestRequestType;
  note?: string;
}

// ── KDS ───────────────────────────────────────────────────────────────────────
export interface KdsOrderItem {
  id: string;
  name: string;
  variantName?: string;
  qty: number;
  status: OrderItemStatus;
  modifiers: string[];
  notes?: string;
}

export interface KdsOrder {
  id: string;
  orderNumber: string;
  channel: OrderChannel;
  tableLabel?: string;
  windowToken?: string;
  placedAt: string;
  items: KdsOrderItem[];
}

// ── SDK config ────────────────────────────────────────────────────────────────
export interface SmartDineConfig {
  /** For self-hosted: full base URL e.g. https://api.myrestaurant.com */
  baseUrl?: string;
  /** For SmartDine cloud: your API key */
  apiKey?: string;
  /** Request timeout in ms (default: 10000) */
  timeout?: number;
}
