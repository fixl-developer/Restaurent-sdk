import type { SmartDineConfig } from '@deepak747/smartdine-types';
import { NotFoundError, SmartDineError, UnauthorizedError, ValidationError } from './errors';

export class HttpClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;

  constructor(config: SmartDineConfig) {
    if (!config.baseUrl && !config.apiKey) {
      throw new SmartDineError(
        'Provide either baseUrl (self-hosted) or apiKey (SmartDine cloud)',
        'CONFIG_ERROR',
      );
    }

    this.baseUrl = config.baseUrl
      ? config.baseUrl.replace(/\/$/, '') + '/api/v1'
      : 'https://api.smartdine.dev/v1';

    this.timeout = config.timeout ?? 10_000;

    this.headers = {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { 'x-api-key': config.apiKey } : {}),
    };
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.headers['Authorization'];
  }

  async get<T>(path: string, options?: { noAuth?: boolean }): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: { noAuth?: boolean }): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: { noAuth?: boolean },
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = { ...this.headers };

    if (options?.noAuth) {
      delete headers['Authorization'];
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const message = json?.message ?? res.statusText;
        if (res.status === 401) throw new UnauthorizedError(message);
        if (res.status === 404) throw new NotFoundError(message);
        if (res.status === 422) throw new ValidationError(message);
        throw new SmartDineError(message, 'API_ERROR', res.status);
      }

      return (json?.data ?? json) as T;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new SmartDineError('Request timed out', 'TIMEOUT');
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
