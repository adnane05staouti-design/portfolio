import type { ReactNode } from "react";

/** Minimal desktop-browser chrome around a screenshot. */
export function BrowserFrame({ children, url = "aos-abhbc", className = "" }: { children: ReactNode; url?: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line-strong bg-surface-2 shadow-card ${className}`}>
      <div className="flex items-center gap-3 border-b border-line px-3.5 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
        </div>
        <div className="mx-auto w-full max-w-[16rem] truncate rounded-md bg-bg/60 px-3 py-1 text-center font-mono text-[0.68rem] text-subtle">
          {url}
        </div>
        <span className="w-10" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}
