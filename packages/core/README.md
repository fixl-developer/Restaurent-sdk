# @fixl1234/restaurent-core

Core HTTP and WebSocket primitives for the SmartDine SDK. All feature packages depend on this package — you rarely need to use it directly unless you are building a custom module.

## Install

```
npm install @fixl1234/restaurent-core
```

Requires Node.js 18+ (uses built-in `fetch`).

## SmartDineClient

The root client that creates an `HttpClient` and a `RealtimeClient` from a single config object. Feature packages accept these two primitives in their constructors.

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';

const sdk = new SmartDineClient({
  baseUrl: 'https://api.myrestaurant.com', // self-hosted
  // apiKey: 'sk_live_...',               // SmartDine cloud
  timeout: 8000,                          // optional, default 10 000 ms
});

// sdk.http    → HttpClient
// sdk.realtime → RealtimeClient
```

Either `baseUrl` or `apiKey` is required. Providing neither throws `SmartDineError` with code `CONFIG_ERROR`.

## HttpClient

Low-level REST wrapper. Automatically appends `/api/v1` to `baseUrl`.

```ts
import { HttpClient } from '@fixl1234/restaurent-core';

const http = new HttpClient({ baseUrl: 'https://api.myrestaurant.com' });
```

### Methods

```ts
http.get<T>(path, options?)         // GET
http.post<T>(path, body?, options?) // POST
http.patch<T>(path, body?)          // PATCH
http.delete<T>(path)                // DELETE
```

Pass `{ noAuth: true }` in `options` to strip the `Authorization` header (used for public guest endpoints).

### Auth token

```ts
http.setAuthToken('eyJhbG...');
// all subsequent requests carry  Authorization: Bearer <token>

http.clearAuthToken();
```

## RealtimeClient

Socket.IO wrapper for live updates (orders, KDS, table status). Feature packages call `subscribe()` internally.

```ts
import { RealtimeClient } from '@fixl1234/restaurent-core';

const realtime = new RealtimeClient({ baseUrl: 'https://api.myrestaurant.com' });

const unsubscribe = realtime.subscribe(
  'guest',                           // namespace: 'guest' | 'kds' | 'staff' | ...
  {
    'order:status_changed': (data) => console.log(data),
    'order:updated': (data) => console.log(data),
  },
  { orderId: 'abc123' },             // optional join payload
);

// call unsubscribe() to disconnect
unsubscribe();
```

## Errors

All SDK errors extend `SmartDineError`.

| Class | When thrown |
|---|---|
| `SmartDineError` | Base class — generic API or config errors |
| `NotFoundError` | 404 response |
| `UnauthorizedError` | 401 response |
| `ValidationError` | 422 response |

```ts
import { NotFoundError, UnauthorizedError, ValidationError } from '@fixl1234/restaurent-core';

try {
  await http.get('/kds/orders/bad-id');
} catch (err) {
  if (err instanceof NotFoundError) {
    console.error('Order not found');
  }
}
```

## Public Exports

`HttpClient`, `RealtimeClient`, `SmartDineClient`, `SmartDineError`, `NotFoundError`, `UnauthorizedError`, `ValidationError`
