# @fixl1234/restaurent-otp

Guest OTP module for the SmartDine SDK. Phone-based one-time password flow for guest identity verification — no passwords, no accounts.

## Install

```
npm install @fixl1234/restaurent-otp @fixl1234/restaurent-core
```

## Setup

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';
import { OtpClient } from '@fixl1234/restaurent-otp';

const sdk = new SmartDineClient({ baseUrl: 'https://api.myrestaurant.com' });
const otp = new OtpClient(sdk.http);
```

## OtpClient

### otp.request(phone)

Send an OTP to the guest's phone number. Returns the number the OTP was sent to.

```ts
const result = await otp.request('+919876543210');
console.log('OTP sent to', result.sentTo);
```

### otp.verify(phone, code)

Verify the OTP code. On success, returns a short-lived `guestToken` to authenticate subsequent requests.

```ts
const result = await otp.verify('+919876543210', '482910');

if (result.verified) {
  console.log('Token:', result.guestToken);        // use as Bearer token
  console.log('Expires in:', result.expiresInMin, 'minutes');
}
```

Pass `result.guestToken` to `orders.placeWindow()` or store it for authenticated guest requests.

## Types

```ts
import type { OtpRequestResult, OtpVerifyResult } from '@fixl1234/restaurent-otp';
```

## Public Exports

`OtpClient`, `OtpRequestResult`, `OtpVerifyResult`
