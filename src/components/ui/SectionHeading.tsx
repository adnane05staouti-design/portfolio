import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  index?: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  id?: string;
  className?: string;
  /** h1 when the heading is the page title (e.g. /projects), h2 inside a page */
  as?: "h1" | "h2";
};

export function SectionHeading({ index, eyebrow, title, intro, id, className = "", as: Heading = "h2" }: Props) {
  return (
    <Reveal className={`mb-12 max-w-3xl md:mb-16 ${className}`}>
      <p className="eyebrow mb-4 flex items-center gap-3">
        {index && <span className="text-subtle">{index}</span>}
        <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
        {eyebrow}
      </p>
      <Heading id={id} className="text-h2 font-semibold text-balance">
        {title}
      </Heading>
      {intro && <p className="mt-5 text-lead text-muted">{intro}</p>}
    </Reveal>
  );
}
