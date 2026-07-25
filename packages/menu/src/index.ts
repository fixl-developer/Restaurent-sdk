import type { HttpClient } from '@deepak747/smartdine-core';
import type { MenuResponse, MenuItem, MenuCategory } from '@deepak747/smartdine-types';

export interface GetMenuOptions {
  /** Restaurant slug (for self-hosted: identifies the outlet) */
  slug: string;
  /** Language code e.g. 'en', 'hi' */
  lang?: string;
}

export class MenuClient {
  constructor(private http: HttpClient) {}

  async get(options: GetMenuOptions): Promise<MenuResponse> {
    const params = new URLSearchParams();
    if (options.lang) params.set('lang', options.lang);
    const qs = params.toString() ? `?${params}` : '';
    return this.http.get<MenuResponse>(`/guest/menu/${options.slug}${qs}`, { noAuth: true });
  }

  async getCategories(options: GetMenuOptions): Promise<MenuCategory[]> {
    const menu = await this.get(options);
    return menu.categories;
  }

  async getItem(options: GetMenuOptions, itemId: string): Promise<MenuItem | undefined> {
    const menu = await this.get(options);
    for (const category of menu.categories) {
      const found = category.items.find((i) => i.id === itemId);
      if (found) return found;
    }
    return undefined;
  }

  async search(options: GetMenuOptions, query: string): Promise<MenuItem[]> {
    const menu = await this.get(options);
    const q = query.toLowerCase();
    return menu.categories.flatMap((c) =>
      c.items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      ),
    );
  }
}

export type { MenuResponse, MenuItem, MenuCategory };
