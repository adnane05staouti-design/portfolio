import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { notFound } from "next/navigation";
import { themeScript } from "@/components/layout/ThemeToggle";
import { profile } from "@/data/profile";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";
import { alternates, siteUrl } from "@/lib/seo";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s — ${profile.name}` },
    description: dict.meta.description,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    keywords: ["Adnane Staouti", "portfolio", "software engineering", "full-stack", "Spring Boot", "React", "EMSI", "Casablanca"],
    alternates: alternates(lang),
    openGraph: {
      type: "profile",
      siteName: profile.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: lang === "fr" ? "fr_MA" : "en_US",
      url: `${siteUrl}/${lang}`,
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
  ],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} data-theme="dark" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top" className="min-h-dvh">
        {children}
      </body>
    </html>
  );
}
