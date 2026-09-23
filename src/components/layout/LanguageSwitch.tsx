"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const target: Locale = locale === "en" ? "fr" : "en";
  const nextPath = pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${target}`);

  return (
    <Link
      href={nextPath}
      hrefLang={target}
      aria-label={label}
      title={label}
      className="grid h-9 min-w-9 place-items-center rounded-full px-2 font-mono text-xs tracking-wider text-muted uppercase transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {target}
    </Link>
  );
}
