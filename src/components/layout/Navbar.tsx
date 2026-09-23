"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/dictionaries";
import type { SectionId } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  locale: Locale;
  dict: Pick<Dictionary, "nav" | "a11y">;
  sections: SectionId[];
  isHome: boolean;
};

export function Navbar({ locale, dict, sections, isHome }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId>("home");
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section indicator (home page only)
  useEffect(() => {
    if (!isHome) return;
    const elements = sections.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome, sections]);

  // Mobile menu: lock scroll, Esc to close, focus trap
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const items = [menuButton.current, ...panel.current.querySelectorAll<HTMLElement>("a,button")].filter(Boolean) as HTMLElement[];
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkFor = (id: SectionId) => (isHome ? `#${id}` : `/${locale}#${id}`);
  const links = sections.filter((id) => id !== "home");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-fg px-4 py-2 text-sm text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {dict.a11y.skip}
      </a>
      <nav
        aria-label={dict.a11y.mainNav}
        className={`container-page flex items-center justify-between transition-[height] duration-500 ${scrolled ? "h-16" : "h-20"}`}
      >
        <Link href={`/${locale}`} className="text-[1.05rem] font-semibold tracking-tight" onClick={() => setOpen(false)}>
          Adnane<span className="text-accent">.</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((id) => {
            const isActive = isHome && active === id;
            return (
              <li key={id} className="relative">
                <a
                  href={linkFor(id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-full px-3.5 py-2 text-sm transition-colors ${isActive ? "text-fg" : "text-muted hover:text-fg"}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32, duration: reduce ? 0 : undefined }}
                    />
                  )}
                  {dict.nav[id]}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <LanguageSwitch locale={locale} label={dict.a11y.switchLanguage} />
          <ThemeToggle label={dict.a11y.toggleTheme} />
          <button
            ref={menuButton}
            type="button"
            className="grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.a11y.closeMenu : dict.a11y.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg lg:hidden"
            initial={{ opacity: 0, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="container-page flex flex-col py-6">
              {links.map((id, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: reduce ? 0 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : 0.03 * i }}
                >
                  <a
                    href={linkFor(id)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-4 text-2xl font-medium tracking-tight"
                  >
                    {dict.nav[id]}
                    <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
