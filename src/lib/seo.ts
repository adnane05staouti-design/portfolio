import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { locales, type Locale } from "@/lib/i18n";

export const siteUrl = profile.siteUrl.replace(/\/$/, "");

/** Canonical + hreflang alternates for a locale-independent path ("" for home). */
export function alternates(locale: Locale, path = ""): Metadata["alternates"] {
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`]));
  return {
    canonical: `${siteUrl}/${locale}${path}`,
    languages: { ...languages, "x-default": `${siteUrl}/en${path}` },
  };
}

export function pageMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: Locale;
  path?: string;
  title?: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: "website",
      url: `${siteUrl}/${locale}${path}`,
      siteName: profile.name,
      locale: locale === "fr" ? "fr_MA" : "en_US",
      title: title ? `${title} — ${profile.name}` : undefined,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} — ${profile.name}` : undefined,
      description,
    },
  };
}
