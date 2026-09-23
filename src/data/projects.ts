import { list, loc, locOr, localizedOrEmpty, paragraphs, type LocList, type LocText } from "@/lib/cms";
import { projectFiles } from "@/content";
import { todo, type Project, type ProjectContext, type ProjectImage } from "@/types/content";

/**
 * Edited in the admin: /keystatic → Projects (files: src/content/projects/<slug>.json).
 * To add a project, click “Create” in the admin — no code change needed.
 */
type ProjectJson = {
  title: string;
  order?: number;
  featured?: boolean;
  subtitle: LocText;
  summary: LocText;
  context?: string;
  period: LocText;
  role: LocText;
  stack?: string[];
  thumbnail?: string | null;
  thumbnailAlt: LocText;
  repoVisibility?: "private" | "public" | "unknown";
  repoUrl?: string | null;
  liveUrl?: string | null;
  highlights?: LocList;
  screenshots?: { image?: string | null; alt: LocText; caption?: LocText }[];
  diagrams?: { image?: string | null; alt: LocText; caption?: LocText }[];
  sections?: { key: string; title: LocText; body?: LocText; bullets?: LocList }[];
  pending?: string[];
};

const CONTEXTS: ProjectContext[] = ["internship", "academic", "personal"];

const image = (src: string | null | undefined, alt: LocText, label: string, caption?: LocText): ProjectImage => ({
  src: src || todo(label),
  alt: localizedOrEmpty(alt),
  caption: loc(caption) ?? undefined,
});

const toProject = (p: ProjectJson & { slug: string }): Project => ({
  slug: p.slug,
  title: p.title,
  subtitle: localizedOrEmpty(p.subtitle),
  summary: localizedOrEmpty(p.summary),
  context: CONTEXTS.includes(p.context as ProjectContext) ? (p.context as ProjectContext) : todo("CONFIRM CONTEXT"),
  period: locOr(p.period, "ADD PERIOD"),
  featured: !!p.featured,
  role: loc(p.role) ?? undefined,
  stack: (p.stack ?? []).filter(Boolean),
  thumbnail: image(p.thumbnail, p.thumbnailAlt, "ADD PROJECT SCREENSHOT"),
  repo:
    p.repoVisibility === "public" && p.repoUrl
      ? { visibility: "public", url: p.repoUrl }
      : p.repoVisibility === "private"
        ? { visibility: "private" }
        : { visibility: "unknown" },
  liveUrl: p.liveUrl || undefined,
  highlights: list(p.highlights),
  screenshots: (p.screenshots ?? []).map((s) =>
    image(s.image, s.alt, `ADD SCREENSHOT — ${loc(s.alt)?.en ?? ""}`.trim(), s.caption),
  ),
  diagrams: (p.diagrams ?? []).map((d) => image(d.image, d.alt, `ADD ${(loc(d.alt)?.en ?? "DIAGRAM").toUpperCase()}`, d.caption)),
  sections: (p.sections ?? [])
    .filter((s) => s.key && loc(s.title))
    .map((s) => ({ id: s.key.trim(), title: loc(s.title)!, body: paragraphs(s.body), bullets: list(s.bullets) })),
  pending: (p.pending ?? []).filter(Boolean),
});

const files = projectFiles as Record<string, ProjectJson>;

export const projects: Project[] = Object.entries(files)
  .map(([path, data]) => ({ ...data, slug: path.split("/").pop()!.replace(/\.json$/, "") }))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title))
  .map(toProject);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProject = projects.find((p) => p.featured) ?? projects[0];
export const otherProjects = projects.filter((p) => p.slug !== featuredProject?.slug);
