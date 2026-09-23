export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** A value that exists in every supported language. */
export type Localized<T = string> = Record<Locale, T>;

export const t = <T>(value: Localized<T>, locale: Locale): T => value[locale];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/** Builds a locale-prefixed internal path: href("fr", "/projects") -> "/fr/projects" */
export const href = (locale: Locale, path = "") =>
  `/${locale}${path === "/" ? "" : path}`;
