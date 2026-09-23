"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email, label, copiedLabel }: { email: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
