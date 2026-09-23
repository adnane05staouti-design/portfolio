import { NextResponse, type NextRequest } from "next/server";
import { isAdminEnabled } from "@/lib/admin";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

/** Picks the visitor's preferred supported language from Accept-Language. */
function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((r) => (locales as readonly string[]).includes(r.lang));
  return (match?.lang as Locale) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: a real 404 when it is disabled (public site without GitHub storage).
  if (pathname === "/keystatic" || pathname.startsWith("/keystatic/")) {
    return isAdminEnabled ? undefined : new NextResponse("Not found", { status: 404 });
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, cv, robots, sitemap…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
