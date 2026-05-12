export type ContactReason = "medical-inquiry" | "general" | "media" | "other";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  reason?: ContactReason;
  recaptchaToken?: string;
}

export interface ContactResponse {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  reason: ContactReason;
  createdAt: string;
}
