"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article";
};

/** Fades and lifts content into view once. Collapses to a plain fade with reduced motion. */
export function Reveal({ children, className, delay = 0, y = 18, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.2 : 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
