import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-surface-2/70 text-muted",
  accent: "border-accent/30 bg-accent-soft text-accent",
  success: "border-success/30 bg-success/10 text-success",
};

export function Badge({ children, tone = "neutral", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.72rem] leading-none tracking-tight ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
