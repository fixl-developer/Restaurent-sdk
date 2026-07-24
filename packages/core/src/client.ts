import type { SmartDineConfig } from '@smartdine/types';
import { HttpClient } from './http';
import { RealtimeClient } from './realtime';

export class SmartDineClient {
  readonly http: HttpClient;
  readonly realtime: RealtimeClient;

  constructor(config: SmartDineConfig) {
    this.http = new HttpClient(config);
    this.realtime = new RealtimeClient(config);
  }
}
