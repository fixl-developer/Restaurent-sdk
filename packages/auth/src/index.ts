import type { HttpClient } from '@fixl1234/restaurent-core';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StaffLoginInput {
  email: string;
  password: string;
}

export interface StaffRole {
  _id: string;
  name: string;
  permissions: string[];
}

export interface StaffUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  isActive: boolean;
}

export interface LoginResult {
  mfaRequired?: boolean;
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: StaffUser;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: StaffUser;
}

export interface GuestOtpRequestResult {
  sentTo: string;
}

export interface GuestOtpVerifyResult {
  verified: boolean;
  phone: string;
  guestToken: string;
  expiresInMin: number;
}

export interface RefreshResult {
  accessToken: string;
  user: StaffUser;
}

// ── AuthClient ────────────────────────────────────────────────────────────────

export class AuthClient {
  constructor(private http: HttpClient) {}

  /** Staff email + password login. Returns mfaRequired=true if 2FA is needed. */
  async staffLogin(input: StaffLoginInput): Promise<LoginResult> {
    return this.http.post<LoginResult>('/auth/staff/login', input, { noAuth: true });
  }

  /** Verify a staff 2FA OTP code after staffLogin returns mfaRequired=true. */
  async staffVerify2fa(userId: string, code: string): Promise<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/staff/2fa/verify', { userId, code }, { noAuth: true });
  }

  /** Refresh an expired access token using a refresh token. */
  async refreshToken(refreshToken: string): Promise<RefreshResult> {
    return this.http.post<RefreshResult>('/auth/staff/refresh', { refreshToken }, { noAuth: true });
  }

  /** Revoke a staff session (logout). */
  async staffLogout(refreshToken?: string): Promise<void> {
    await this.http.post('/auth/staff/logout', refreshToken ? { refreshToken } : {});
  }

  /** Get the currently authenticated staff user. */
  async me(): Promise<StaffUser> {
    return this.http.get<StaffUser>('/auth/me');
  }

  /** Request a guest OTP to the given phone number. */
  async guestOtpRequest(phone: string): Promise<GuestOtpRequestResult> {
    return this.http.post<GuestOtpRequestResult>(
      '/auth/guest/otp/request',
      { phone },
      { noAuth: true },
    );
  }

  /** Verify a guest OTP and receive a short-lived guest token. */
  async guestOtpVerify(phone: string, code: string): Promise<GuestOtpVerifyResult> {
    return this.http.post<GuestOtpVerifyResult>(
      '/auth/guest/otp/verify',
      { phone, code },
      { noAuth: true },
    );
  }
}
