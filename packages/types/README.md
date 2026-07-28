# @fixl1234/restaurent-types

Shared TypeScript types and enums for the SmartDine SDK. All feature packages re-export the types they use — you rarely need to install this package directly.

## Install

```
npm install @fixl1234/restaurent-types
```

## Type Groups

### Order

```ts
import type {
  Order,
  OrderItem,
  OrderTotals,
  OrderStatus,
  OrderItemStatus,
  OrderChannel,
  PlaceDineInInput,
  PlaceWindowInput,
  OrderItemInput,
  GuestRequestInput,
  GuestRequestType,
} from '@fixl1234/restaurent-types';
```

`OrderStatus`: `'placed' | 'accepted' | 'preparing' | 'ready' | 'served' | 'settled' | 'cancelled'`

`OrderChannel`: `'dine_in' | 'window' | 'delivery'`

### Menu

```ts
import type {
  MenuResponse,
  MenuCategory,
  MenuItem,
  MenuVariant,
  MenuModifier,
  MenuModifierGroup,
  Combo,
  ComboItemRef,
  FoodType,
} from '@fixl1234/restaurent-types';
```

`FoodType`: `'veg' | 'non_veg' | 'egg' | 'vegan'`

### KDS

```ts
import type {
  KdsOrder,
  KdsOrderItem,
} from '@fixl1234/restaurent-types';
```

### OTP

```ts
import type {
  OtpRequestResult,
  OtpVerifyResult,
} from '@fixl1234/restaurent-types';
```

### SDK Config

```ts
import type { SmartDineConfig } from '@fixl1234/restaurent-types';

const config: SmartDineConfig = {
  baseUrl: 'https://api.myrestaurant.com',
  timeout: 8000,
};
```

## Public Exports

All types listed above plus `VERSION` (package version string).
