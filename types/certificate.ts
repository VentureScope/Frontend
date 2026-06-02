export interface Certificate {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  credential_id: string | null;
  credential_url: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CertificatePayload {
  name: string;
  issuer: string;
  credential_id?: string | null;
  credential_url?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  description?: string | null;
}

export type CertificateUpdatePayload = Partial<CertificatePayload>;
