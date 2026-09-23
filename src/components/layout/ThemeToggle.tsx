"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const subscribe = (callback: () => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}

/** Inline script run before paint so the stored theme never flashes. */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})();`;
