import { io, Socket } from 'socket.io-client';
import type { SmartDineConfig } from '@fixl1234/restaurent-types';

export type RealtimeEvent = Record<string, (...args: unknown[]) => void>;

export class RealtimeClient {
  private baseUrl: string;
  private sockets = new Map<string, Socket>();

  constructor(config: SmartDineConfig) {
    this.baseUrl = config.baseUrl
      ? config.baseUrl.replace(/\/$/, '')
      : 'https://api.smartdine.dev';
  }

  subscribe<T extends RealtimeEvent>(
    namespace: string,
    events: T,
    query?: Record<string, string>,
  ): () => void {
    const key = `${namespace}:${JSON.stringify(query ?? {})}`;

    if (this.sockets.has(key)) {
      this.sockets.get(key)!.disconnect();
    }

    const socket = io(`${this.baseUrl}/${namespace}`, {
      query,
      transports: ['websocket'],
      autoConnect: true,
    });

    for (const [event, handler] of Object.entries(events)) {
      socket.on(event, handler as (...args: unknown[]) => void);
    }

    this.sockets.set(key, socket);

    return () => {
      socket.disconnect();
      this.sockets.delete(key);
    };
  }

  disconnectAll() {
    for (const socket of this.sockets.values()) {
      socket.disconnect();
    }
    this.sockets.clear();
  }
}
