import type { HttpClient } from '@fixl1234/restaurent-core';

// ── Types ─────────────────────────────────────────────────────────────────────

export type PaymentMode = 'cash' | 'upi' | 'card' | 'wallet' | 'online_prepay';
export type InvoicePaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';
export type InvoiceStatus = 'final' | 'void';

export interface InvoiceLineItem {
  name: string;
  variantName?: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceDto {
  _id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumberSnapshot: string;
  issueDate: string;
  channel: 'dine_in' | 'window' | 'assisted';
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grand: number;
  amountPaid: number;
  amountDue: number;
  paymentStatus: InvoicePaymentStatus;
  status: InvoiceStatus;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string;
}

export interface GenerateInvoiceInput {
  discount?: number;
  couponCode?: string;
  loyaltyPoints?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export interface RecordPaymentInput {
  mode: PaymentMode;
  amount: number;
  txnRef?: string;
  cashTendered?: number;
  notes?: string;
}

export interface UpiQrResponse {
  paymentId: string;
  amount: number;
  currency: string;
  upiDeeplink?: string;
  mocked: boolean;
}

export interface CashSessionDto {
  _id: string;
  openingFloat: number;
  expectedCash: number;
  actualCash?: number;
  variance?: number;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
}

// ── PaymentsClient ────────────────────────────────────────────────────────────

export class PaymentsClient {
  constructor(private http: HttpClient) {}

  /** Generate a tax invoice for an order. */
  async generateInvoice(orderId: string, input: GenerateInvoiceInput = {}): Promise<InvoiceDto> {
    return this.http.post<InvoiceDto>(`/billing/orders/${orderId}/bill`, input);
  }

  /** Get an invoice by ID. */
  async getInvoice(invoiceId: string): Promise<InvoiceDto> {
    return this.http.get<InvoiceDto>(`/invoices/${invoiceId}`);
  }

  /** List invoices with optional filters. */
  async listInvoices(query: {
    paymentStatus?: InvoicePaymentStatus;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<InvoiceDto[]> {
    return this.http.get<InvoiceDto[]>('/invoices', { query } as never);
  }

  /** Record a payment against an invoice. */
  async recordPayment(invoiceId: string, input: RecordPaymentInput): Promise<void> {
    await this.http.post(`/payments/invoices/${invoiceId}`, input);
  }

  /** Generate a Razorpay UPI QR code for an invoice. */
  async upiQr(invoiceId: string): Promise<UpiQrResponse> {
    return this.http.post<UpiQrResponse>('/payments/upi/qr', { invoiceId });
  }

  /** Void (cancel) an invoice. */
  async voidInvoice(invoiceId: string, reason: string): Promise<InvoiceDto> {
    return this.http.post<InvoiceDto>(`/invoices/${invoiceId}/void`, { reason });
  }

  /** Open a cash session for a shift. */
  async openCashSession(openingFloat: number, notes?: string): Promise<CashSessionDto> {
    return this.http.post<CashSessionDto>('/cash-sessions/open', { openingFloat, notes });
  }

  /** Get the current open cash session. */
  async currentCashSession(): Promise<CashSessionDto | null> {
    return this.http.get<CashSessionDto | null>('/cash-sessions/current');
  }

  /** Close the current cash session. */
  async closeCashSession(id: string, actualCash: number, notes?: string): Promise<CashSessionDto> {
    return this.http.post<CashSessionDto>(`/cash-sessions/${id}/close`, { actualCash, notes });
  }
}
