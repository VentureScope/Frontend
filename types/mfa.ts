// TypeScript types for TOTP MFA API

export interface MFAEnrollResponse {
  factor_id: string;
  totp_uri: string;    // otpauth:// URI – use a QR library to render
  secret: string;      // plain-text base32 for manual entry
}

export interface MFAEnrollVerifyPayload {
  factor_id: string;
  code: string;
}

export interface MFAEnrollVerifyResponse {
  verified: boolean;
  message: string;
}

export interface MFAChallengePayload {
  factor_id: string;
}

export interface MFAChallengeResponse {
  challenge_id: string;
}

export interface MFAVerifyPayload {
  factor_id: string;
  challenge_id: string;
  code: string;
}

export interface MFAVerifyResponse {
  verified: boolean;
  aal: "aal2" | string;
}

export interface MFAFactor {
  factor_id: string;
  friendly_name: string | null;
  created_at: string;
}

export interface MFAListFactorsResponse {
  factors: MFAFactor[];
}

export interface MFAUnenrollPayload {
  factor_id: string;
}

export interface MFAUnenrollResponse {
  factor_id: string;
  deleted: boolean;
}

export interface MFASyncResponse {
  mfa_enabled: boolean;
  enrolled_at: string | null;
}

export interface MFADisableResponse {
  mfa_enabled: boolean;
}

export interface MFAALResponse {
  current_level: "aal1" | "aal2";
  next_level: "aal1" | "aal2";
  mfa_enabled: boolean;
  enrolled_at: string | null;
}
