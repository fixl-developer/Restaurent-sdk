# @fixl1234/restaurent-menu

Menu module for the SmartDine SDK. Fetch the full menu, browse categories, look up individual items, and search by name or tag — all without authentication.

## Install

```
npm install @fixl1234/restaurent-menu @fixl1234/restaurent-core
```

## Setup

```ts
import { SmartDineClient } from '@fixl1234/restaurent-core';
import { MenuClient } from '@fixl1234/restaurent-menu';

const sdk = new SmartDineClient({ baseUrl: 'https://api.myrestaurant.com' });
const menu = new MenuClient(sdk.http);
```

## MenuClient

### menu.get(options)

Fetch the full menu — categories, items, combos.

```ts
const fullMenu = await menu.get({ slug: 'my-restaurant', lang: 'en' });
// fullMenu.categories → MenuCategory[]
// fullMenu.combos     → Combo[]
```

`slug` identifies the restaurant outlet. `lang` is optional (default: `'en'`).

### menu.getCategories(options)

Returns only the categories array.

```ts
const categories = await menu.getCategories({ slug: 'my-restaurant' });
categories.forEach((cat) => {
  console.log(cat.name, cat.items.length, 'items');
});
```

### menu.getItem(options, itemId)

Look up a single item across all categories.

```ts
const item = await menu.getItem({ slug: 'my-restaurant' }, 'item_abc123');
if (item) {
  console.log(item.name, item.basePrice, item.variants);
}
```

Returns `undefined` if the item is not found.

### menu.search(options, query)

Full-text search across item names, descriptions, and tags.

```ts
const results = await menu.search({ slug: 'my-restaurant' }, 'paneer');
results.forEach((item) => console.log(item.name, item.basePrice));
```

## Types

```ts
import type { MenuResponse, MenuItem, MenuCategory } from '@fixl1234/restaurent-menu';
```

## Public Exports

`MenuClient`, `GetMenuOptions`, `MenuResponse`, `MenuItem`, `MenuCategory`
