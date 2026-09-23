"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useActionState, useState, type FormEvent } from "react";
import { sendContact } from "@/app/actions/contact";
import { buttonClass } from "@/components/ui/Button";
import type { Dictionary } from "@/dictionaries";
import { validateContact, type ContactErrors, type ContactField, type ContactState } from "@/lib/contact-schema";

type Labels = Dictionary["contact"]["form"];

export function ContactForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const [clientErrors, setClientErrors] = useState<ContactErrors>({});

  const errors: ContactErrors = state.status === "invalid" ? { ...state.errors, ...clientErrors } : clientErrors;
  const defaults = "values" in state ? state.values : undefined;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    const found = validateContact({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    });
    setClientErrors(found);
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  };

  const clear = (field: ContactField) => {
    if (clientErrors[field]) setClientErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (state.status === "success") {
    return (
      <div role="status" className="card flex min-h-80 flex-col items-center justify-center gap-4 p-8 text-center">
        <CheckCircle2 size={36} className="text-success" aria-hidden="true" />
        <p className="max-w-sm text-lead">{labels.success}</p>
      </div>
    );
  }

  return (
    <form action={action} onSubmit={onSubmit} noValidate className="card relative space-y-5 p-6 md:p-8" key={state.status}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label={labels.name} error={errors.name ? labels.errors.name : undefined} defaultValue={defaults?.name} autoComplete="name" onInput={() => clear("name")} />
        <Field name="email" type="email" label={labels.email} error={errors.email ? labels.errors.email : undefined} defaultValue={defaults?.email} autoComplete="email" onInput={() => clear("email")} />
      </div>
      <Field name="subject" label={labels.subject} error={errors.subject ? labels.errors.subject : undefined} defaultValue={defaults?.subject} onInput={() => clear("subject")} />
      <Field name="message" label={labels.message} error={errors.message ? labels.errors.message : undefined} defaultValue={defaults?.message} multiline onInput={() => clear("message")} />

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {(state.status === "error" || state.status === "not_configured") && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
          {state.status === "not_configured" ? labels.notConfigured : labels.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
        {pending ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
        {pending ? labels.sending : labels.send}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  error,
  type = "text",
  multiline,
  defaultValue,
  autoComplete,
  onInput,
}: {
  name: ContactField;
  label: string;
  error?: string;
  type?: string;
  multiline?: boolean;
  defaultValue?: string;
  autoComplete?: string;
  onInput: () => void;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const cls = `w-full rounded-xl border bg-bg/60 px-4 py-3 text-[0.95rem] text-fg placeholder:text-subtle transition-colors outline-none focus:border-accent focus:ring-4 focus:ring-accent-soft ${
    error ? "border-danger" : "border-line-strong"
  }`;
  const common = {
    id,
    name,
    defaultValue,
    onInput,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cls,
  };
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {multiline ? <textarea rows={6} {...common} className={`${cls} resize-y`} /> : <input type={type} autoComplete={autoComplete} {...common} />}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
