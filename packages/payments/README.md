# @fixl1234/restaurent-payments

Payments module for the SmartDine SDK. Generate tax invoices, record payments (cash / UPI / card), create Razorpay UPI QR codes, void invoices, and manage cash drawer sessions.

## Install

```
npm install @fixl1234/restaurent-payments @fixl1234/restaurent-core
```

Requires staff authentication — call `http.setAuthToken(token)` before using.

## Setup

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';
import { PaymentsClient } from '@fixl1234/restaurent-payments';

const sdk = new SmartDineClient({ baseUrl: 'https://api.myrestaurant.com' });
sdk.http.setAuthToken(staffAccessToken);

const payments = new PaymentsClient(sdk.http);
```

## Invoices

### payments.generateInvoice(orderId, input?)

Generate a tax invoice for a settled order. Applies discount or coupon if provided.

```ts
const invoice = await payments.generateInvoice('order_abc123', {
  discount: 50,          // fixed rupee discount
  couponCode: 'SAVE10',
  customerName: 'Rahul',
  customerPhone: '+919876543210',
});

console.log(invoice.invoiceNumber, invoice.grand, invoice.amountDue);
```

### payments.getInvoice(invoiceId)

Fetch an invoice by ID.

```ts
const invoice = await payments.getInvoice('inv_abc123');
```

### payments.listInvoices(query?)

List invoices with optional filters.

```ts
const invoices = await payments.listInvoices({
  paymentStatus: 'unpaid',
  from: '2024-06-01',
  to: '2024-06-30',
  page: 1,
  limit: 50,
});
```

### payments.voidInvoice(invoiceId, reason)

Cancel an invoice.

```ts
await payments.voidInvoice('inv_abc123', 'Order cancelled by guest');
```

## Payments

### payments.recordPayment(invoiceId, input)

Record a payment against an invoice. Supports cash, UPI, card, wallet, or online prepay.

```ts
await payments.recordPayment('inv_abc123', {
  mode: 'cash',
  amount: 450,
  cashTendered: 500,   // for cash — enables change calculation
});

await payments.recordPayment('inv_abc123', {
  mode: 'upi',
  amount: 450,
  txnRef: 'PAY_20240601_XYZ',
});
```

### payments.upiQr(invoiceId)

Generate a Razorpay UPI QR code for an invoice. Returns the `upiDeeplink` for display.

```ts
const qr = await payments.upiQr('inv_abc123');
console.log(qr.upiDeeplink, qr.amount);
```

## Cash Sessions

### payments.openCashSession(openingFloat, notes?)

Open a cash drawer session at the start of a shift.

```ts
const session = await payments.openCashSession(2000, 'Morning shift');
console.log(session._id, session.status); // 'open'
```

### payments.currentCashSession()

Get the currently open session. Returns `null` if no session is open.

```ts
const session = await payments.currentCashSession();
if (session) {
  console.log('Expected cash:', session.expectedCash);
}
```

### payments.closeCashSession(id, actualCash, notes?)

Close the session and record the physical cash count.

```ts
const closed = await payments.closeCashSession(session._id, 5400, 'Evening close');
console.log('Variance:', closed.variance);
```

## Types

```ts
import type {
  InvoiceDto,
  GenerateInvoiceInput,
  RecordPaymentInput,
  UpiQrResponse,
  CashSessionDto,
  PaymentMode,
  InvoicePaymentStatus,
  InvoiceStatus,
} from '@fixl1234/restaurent-payments';
```

`PaymentMode`: `'cash' | 'upi' | 'card' | 'wallet' | 'online_prepay'`

## Public Exports

`PaymentsClient`, `InvoiceDto`, `GenerateInvoiceInput`, `RecordPaymentInput`, `UpiQrResponse`, `CashSessionDto`, `PaymentMode`, `InvoicePaymentStatus`, `InvoiceStatus`
