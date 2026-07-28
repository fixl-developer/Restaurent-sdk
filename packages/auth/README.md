# @fixl1234/restaurent-auth

Auth module for the SmartDine SDK. Staff login with optional 2FA, token refresh, and guest phone-OTP flows.

## Install

```
npm install @fixl1234/restaurent-auth @fixl1234/restaurent-core
```

## Setup

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';
import { AuthClient } from '@fixl1234/restaurent-auth';

const sdk = new SmartDineClient({ baseUrl: 'https://api.myrestaurant.com' });
const auth = new AuthClient(sdk.http);
```

## Staff Auth

### auth.staffLogin(input)

Email + password login. If the account has 2FA enabled, `mfaRequired` is `true` and the `accessToken` is absent — call `staffVerify2fa` next.

```ts
const result = await auth.staffLogin({
  email: 'manager@myrestaurant.com',
  password: 'secret',
});

if (result.mfaRequired) {
  // prompt the user for their OTP, then call staffVerify2fa
} else {
  sdk.http.setAuthToken(result.accessToken!);
}
```

### auth.staffVerify2fa(userId, code)

Complete 2FA after `staffLogin` returns `mfaRequired: true`.

```ts
const session = await auth.staffVerify2fa(result.userId!, '829301');
sdk.http.setAuthToken(session.accessToken);
```

### auth.refreshToken(refreshToken)

Exchange a refresh token for a new access token (call before the access token expires).

```ts
const refreshed = await auth.refreshToken(storedRefreshToken);
sdk.http.setAuthToken(refreshed.accessToken);
```

### auth.staffLogout(refreshToken?)

Revoke the session on the server.

```ts
await auth.staffLogout(storedRefreshToken);
sdk.http.clearAuthToken();
```

### auth.me()

Return the currently authenticated staff user. Requires `Authorization` header to be set.

```ts
const user = await auth.me();
console.log(user.name, user.role.name, user.role.permissions);
```

## Guest Auth

### auth.guestOtpRequest(phone)

Request a guest OTP by phone number.

```ts
const result = await auth.guestOtpRequest('+919876543210');
console.log('OTP sent to', result.sentTo);
```

### auth.guestOtpVerify(phone, code)

Verify a guest OTP and receive a short-lived token.

```ts
const verified = await auth.guestOtpVerify('+919876543210', '482910');
console.log(verified.guestToken, 'expires in', verified.expiresInMin, 'min');
```

## Types

```ts
import type {
  StaffLoginInput,
  StaffUser,
  StaffRole,
  LoginResult,
  LoginResponse,
  RefreshResult,
  GuestOtpRequestResult,
  GuestOtpVerifyResult,
} from '@fixl1234/restaurent-auth';
```

## Public Exports

`AuthClient`, `StaffLoginInput`, `StaffUser`, `StaffRole`, `LoginResult`, `LoginResponse`, `RefreshResult`, `GuestOtpRequestResult`, `GuestOtpVerifyResult`
