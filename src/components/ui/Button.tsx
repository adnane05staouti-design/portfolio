import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg hover:bg-accent hover:text-accent-contrast shadow-[0_8px_24px_-12px_var(--accent)]",
  secondary: "border border-line-strong bg-surface/60 text-fg hover:border-accent hover:text-accent",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra = "") =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`;

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
  /** true, or the file name proposed to the visitor */
  download?: boolean | string;
} & Omit<ComponentProps<"a">, "href">;

/** Internal links use next/link; external links and downloads use a plain anchor. */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external,
  download,
  ...rest
}: LinkButtonProps) {
  const cls = buttonClass(variant, size, className);
  if (external || download || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: typeof download === "string" ? download : "" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
