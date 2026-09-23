import type { ReactNode } from "react";
import { getDictionary } from "@/dictionaries";
import { navSections } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function SiteShell({ locale, isHome = false, children }: { locale: Locale; isHome?: boolean; children: ReactNode }) {
  const dict = getDictionary(locale);
  return (
    <>
      <Navbar locale={locale} dict={{ nav: dict.nav, a11y: dict.a11y }} sections={navSections()} isHome={isHome} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
