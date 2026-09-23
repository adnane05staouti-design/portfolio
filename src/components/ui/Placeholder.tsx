import type { Placeholder } from "@/types/content";

/**
 * Visible marker for content that still has to be provided.
 * Run `npm run check:content` to list them all before publishing.
 */
export function PlaceholderTag({ value, className = "" }: { value: Placeholder | string; className?: string }) {
  const label = typeof value === "string" ? value : value.label;
  return (
    <span
      className={`inline-flex items-center rounded-md border border-dashed border-accent/50 bg-accent-soft px-2 py-0.5 font-mono text-[0.72rem] text-accent ${className}`}
    >
      [{label}]
    </span>
  );
}
