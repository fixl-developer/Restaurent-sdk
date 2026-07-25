import type { HttpClient } from '@deepak747/smartdine-core';
import type { OtpRequestResult, OtpVerifyResult } from '@deepak747/smartdine-types';

export class OtpClient {
  constructor(private http: HttpClient) {}

  async request(phone: string): Promise<OtpRequestResult> {
    return this.http.post<OtpRequestResult>('/guest/otp/request', { phone }, { noAuth: true });
  }

  async verify(phone: string, otp: string): Promise<OtpVerifyResult> {
    return this.http.post<OtpVerifyResult>('/guest/otp/verify', { phone, otp }, { noAuth: true });
  }
}

export type { OtpRequestResult, OtpVerifyResult };
