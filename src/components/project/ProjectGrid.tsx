"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/types/content";
import { ProjectCard } from "./ProjectCard";

type Props = { projects: Project[]; locale: Locale; labels: Dictionary["projects"]; filterable?: boolean };

export function ProjectGrid({ projects, locale, labels, filterable = true }: Props) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<string | null>(null);

  // Only offer filters shared by at least two projects — avoids a wall of single-use chips.
  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.stack.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
    return [...counts.entries()].filter(([, n]) => n > 1).map(([s]) => s).slice(0, 8);
  }, [projects]);

  const visible = filter ? projects.filter((p) => p.stack.includes(filter)) : projects;

  return (
    <div>
      {filterable && filters.length > 0 && (
        <div role="group" aria-label="Filter" className="mb-8 flex flex-wrap gap-2">
          {[null, ...filters].map((f) => {
            const active = filter === f;
            return (
              <button
                key={f ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                {f ?? labels.all}
              </button>
            );
          })}
        </div>
      )}

      <motion.ul layout={!reduce} className={`grid gap-6 sm:grid-cols-2 ${visible.length > 2 ? "lg:grid-cols-3" : ""}`}>
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.li
              key={project.slug}
              layout={!reduce}
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} locale={locale} labels={labels} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {visible.length === 0 && <p className="text-muted">{labels.empty}</p>}
    </div>
  );
}
