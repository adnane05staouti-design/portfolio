import type { Localized } from "@/lib/i18n";
import { todo, type Maybe } from "@/types/content";

/**
 * Helpers that turn the JSON edited in the admin (/keystatic, files in src/content)
 * into the types used by the UI. Content is imported at build time: pages stay static.
 */

// ---------- JSON → UI types ----------
export type LocText = { en?: string; fr?: string } | null | undefined;
export type LocList = { en?: string[]; fr?: string[] } | null | undefined;

const clean = (s?: string | null) => (s ?? "").trim();

/** Bilingual text; if one language is empty the other is used. Empty in both → null. */
export function loc(v: LocText): Localized | null {
  const en = clean(v?.en);
  const fr = clean(v?.fr);
  if (!en && !fr) return null;
  return { en: en || fr, fr: fr || en };
}

/** Bilingual text that must exist: empty → visible placeholder. */
export const locOr = (v: LocText, label: string): Maybe<Localized> => loc(v) ?? todo(label);

export const textOr = (v: string | null | undefined, label: string): Maybe<string> => clean(v) || todo(label);

/** "a\n\nb" → ["a", "b"] in both languages. */
export function paragraphs(v: LocText): Localized<string[]> | undefined {
  const text = loc(v);
  if (!text) return undefined;
  const split = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return { en: split(text.en), fr: split(text.fr) };
}

export function list(v: LocList): Localized<string[]> | undefined {
  const en = (v?.en ?? []).map(clean).filter(Boolean);
  const fr = (v?.fr ?? []).map(clean).filter(Boolean);
  if (!en.length && !fr.length) return undefined;
  return { en: en.length ? en : fr, fr: fr.length ? fr : en };
}

export const localizedOrEmpty = (v: LocText): Localized => loc(v) ?? { en: "", fr: "" };
