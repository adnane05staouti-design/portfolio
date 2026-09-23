export type ContactField = "name" | "email" | "subject" | "message";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, true>>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors; values: ContactValues }
  | { status: "success" }
  | { status: "error" | "not_configured"; values: ContactValues };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the client (instant feedback) and the server (source of truth). */
export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (v.name.trim().length < 2 || v.name.length > 100) errors.name = true;
  if (!EMAIL.test(v.email.trim()) || v.email.length > 200) errors.email = true;
  if (v.subject.trim().length < 2 || v.subject.length > 150) errors.subject = true;
  if (v.message.trim().length < 20 || v.message.length > 5000) errors.message = true;
  return errors;
}
