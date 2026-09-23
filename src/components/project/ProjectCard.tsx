"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Code2, ImageIcon } from "lucide-react";
import type { PointerEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import { isPlaceholder, type Project } from "@/types/content";

type Props = {
  project: Project;
  locale: Locale;
  labels: Dictionary["projects"];
};

export function ProjectCard({ project, locale, labels }: Props) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(400px circle at ${glowX} ${glowY}, var(--accent-soft), transparent 60%)`;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const thumb = isPlaceholder(project.thumbnail.src) ? null : project.thumbnail.src;
  const detailsUrl = `/${locale}/projects/${project.slug}`;

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="card group relative flex h-full flex-col overflow-hidden transition-[border-color] duration-300 hover:border-line-strong"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />

      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg">
        {thumb ? (
          <Image
            src={thumb}
            alt={project.thumbnail.alt[locale]}
            fill
            quality={90}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
        ) : (
          <div className="bg-grid flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
            <ImageIcon size={22} className="text-subtle" aria-hidden="true" />
            {isPlaceholder(project.thumbnail.src) && <PlaceholderTag value={project.thumbnail.src} />}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {isPlaceholder(project.context) ? (
            <PlaceholderTag value={project.context} />
          ) : (
            <Badge tone="accent">{labels.context[project.context]}</Badge>
          )}
          {isPlaceholder(project.period) ? <PlaceholderTag value={project.period} /> : <Badge>{project.period[locale]}</Badge>}
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight">
          <Link href={detailsUrl} className="after:absolute after:inset-0 after:z-20 focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-accent">{project.subtitle[locale]}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary[locale]}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
          {project.stack.slice(0, 6).map((s) => (
            <li key={s}>
              <Badge>{s}</Badge>
            </li>
          ))}
          {project.stack.length > 6 && (
            <li>
              <Badge>+{project.stack.length - 6}</Badge>
            </li>
          )}
        </ul>

        <div className="relative z-30 mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
          <Link href={detailsUrl} className="inline-flex items-center gap-1.5 font-medium text-fg transition-colors hover:text-accent">
            {labels.viewDetails}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          {project.repo.visibility === "public" && (
            <a href={project.repo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-fg">
              <Code2 size={15} aria-hidden="true" />
              {labels.viewCode}
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-fg">
              {labels.liveDemo}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
