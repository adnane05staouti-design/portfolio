"use server";

import { headers } from "next/headers";
import { validateContact, type ContactState, type ContactValues } from "@/lib/contact-schema";

/**
 * Sends the contact form through the Resend HTTP API.
 * Required environment variables (set them in Vercel, never in the code):
 *   RESEND_API_KEY     — secret API key
 *   CONTACT_TO_EMAIL   — where messages are delivered
 *   CONTACT_FROM_EMAIL — verified sender, e.g. "Portfolio <contact@your-domain.com>"
 *                        (defaults to Resend's test sender)
 */

// Best-effort in-memory rate limit (per server instance): 5 messages / 10 min / IP.
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

/** Env values pasted in a dashboard often carry spaces or quotes: clean them. */
const env = (name: string) => process.env[name]?.trim().replace(/^["']|["']$/g, "").trim() || undefined;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: ContactValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (String(formData.get("company") ?? "").length > 0) return { status: "success" };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors, values };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    console.warn("[contact] rate limit reached");
    return { status: "error", values };
  }

  const apiKey = env("RESEND_API_KEY");
  const to = env("CONTACT_TO_EMAIL");
  if (!apiKey || !to) {
    console.error(`[contact] not configured — RESEND_API_KEY ${apiKey ? "set" : "MISSING"}, CONTACT_TO_EMAIL ${to ? "set" : "MISSING"}`);
    return { status: "not_configured", values };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env("CONTACT_FROM_EMAIL") ?? "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: values.email,
        subject: `[Portfolio] ${values.subject}`,
        text: `From: ${values.name} <${values.email}>\n\n${values.message}`,
        html: `<p><strong>From:</strong> ${escape(values.name)} &lt;${escape(values.email)}&gt;</p><p>${escape(values.message).replace(/\n/g, "<br>")}</p>`,
      }),
    });
    if (!res.ok) {
      // Visible in Vercel → Logs. Never logs the API key.
      console.error(`[contact] Resend refused the email: ${res.status} ${await res.text()}`);
      return { status: "error", values };
    }
    return { status: "success" };
  } catch (error) {
    console.error("[contact] could not reach Resend:", error);
    return { status: "error", values };
  }
}
