import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, Lock } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ArchitectureDiagram } from "@/components/project/ArchitectureDiagram";
import { Gallery } from "@/components/project/Gallery";
import { TableOfContents } from "@/components/project/TableOfContents";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { getProject, projects } from "@/data/projects";
import { getDictionary } from "@/dictionaries";
import { toGalleryItem } from "@/lib/content";
import { hasLocale, locales } from "@/lib/i18n";
import { pageMetadata, siteUrl } from "@/lib/seo";
import type { ReactNode } from "react";
import { isPlaceholder, type ProjectSection } from "@/types/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) return {};
  return pageMetadata({
    locale: lang,
    path: `/projects/${slug}`,
    title: `${project.title} — ${project.subtitle[lang]}`,
    description: project.summary[lang],
  });
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) notFound();
  const dict = getDictionary(lang);
  const cs = dict.caseStudy;
  const galleryLabels = { close: dict.a11y.close, previous: dict.a11y.previous, next: dict.a11y.next, zoom: dict.a11y.zoom };

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  // Only list interactive sections when this project has content for them.
  const sections = project.sections.filter((s) => {
    if (s.id === "screenshots") return project.screenshots.length > 0;
    if (s.id === "uml") return project.diagrams.length > 0;
    return true;
  });
  const toc = sections.map((s) => ({ id: s.id, title: s.title[lang] }));

  const period = project.period;
  const context = project.context;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.subtitle[lang],
    description: project.summary[lang],
    url: `${siteUrl}/${lang}/projects/${slug}`,
    author: { "@type": "Person", name: "Adnane Staouti" },
    keywords: project.stack.join(", "),
    inLanguage: lang,
  };

  const renderSection = (section: ProjectSection) => {
    switch (section.id) {
      case "architecture":
        return project.slug === "aos-abhbc" ? (
          <ArchitectureDiagram locale={lang} labels={{ hint: cs.diagramHint, layers: cs.layers, deployment: cs.deployment }} />
        ) : null;
      case "stack":
        return (
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="rounded-lg border border-line bg-surface px-3.5 py-2 font-mono text-sm">
                {s}
              </li>
            ))}
          </ul>
        );
      case "screenshots":
        return <Gallery items={project.screenshots.map((img) => toGalleryItem(img, lang))} labels={galleryLabels} />;
      case "uml":
        return <Gallery items={project.diagrams.map((img) => toGalleryItem(img, lang))} labels={galleryLabels} variant="plain" fit="contain" />;
      default:
        return null;
    }
  };

  return (
    <SiteShell locale={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <header className="relative isolate overflow-hidden border-b border-line pt-32 pb-16 md:pt-40 md:pb-20">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-96" style={{ background: "var(--glow)" }} />
        <div className="container-page">
          <Link href={`/${lang}/projects`} className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            {cs.back}
          </Link>
          <Reveal>
            <h1 className="mt-8 text-display font-semibold">{project.title}</h1>
            <p className="mt-5 max-w-3xl text-h3 text-muted">{project.subtitle[lang]}</p>
            <p className="mt-6 max-w-3xl text-lead text-muted">{project.summary[lang]}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              <Meta label={cs.context}>
                {isPlaceholder(context) ? <PlaceholderTag value={context} /> : dict.projects.context[context]}
              </Meta>
              <Meta label={cs.period}>{isPlaceholder(period) ? <PlaceholderTag value={period} /> : period[lang]}</Meta>
              <Meta label={cs.role} className="lg:col-span-2">
                {project.role?.[lang] ?? "—"}
              </Meta>
            </dl>
          </Reveal>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {project.repo.visibility === "private" && (
              <Badge>
                <Lock size={12} aria-hidden="true" />
                {dict.featured.privateRepo}
              </Badge>
            )}
            {project.repo.visibility === "public" && (
              <a href={project.repo.url} target="_blank" rel="noopener noreferrer">
                <Badge tone="accent">
                  <Code2 size={12} aria-hidden="true" />
                  {dict.projects.viewCode}
                </Badge>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-[13rem_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <TableOfContents items={toc} title={cs.toc} />
        </aside>

        <div className="min-w-0 space-y-20 md:space-y-24">
          {project.pending && project.pending.length > 0 && (
            <div className="rounded-[var(--radius-card)] border border-dashed border-accent/40 p-6">
              <p className="eyebrow mb-4">{cs.pending}</p>
              <ul className="flex flex-wrap gap-2">
                {project.pending.map((p) => (
                  <li key={p}>
                    <PlaceholderTag value={p} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sections.map((section, i) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28">
              <Reveal>
                <p className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${section.id}-title`} className="mt-2 text-h2 font-semibold">
                  {section.title[lang]}
                </h2>
              </Reveal>
              <div className="mt-8 space-y-6">
                {section.body?.[lang].map((p, j) => (
                  <Reveal key={j}>
                    <p className="max-w-3xl text-lead text-muted">{p}</p>
                  </Reveal>
                ))}
                {section.bullets && (
                  <Reveal>
                    <ul className="grid gap-3 md:grid-cols-2">
                      {section.bullets[lang].map((b) => (
                        <li key={b} className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-[0.95rem] leading-relaxed text-muted">
                          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                )}
                {renderSection(section) && <Reveal>{renderSection(section)}</Reveal>}
              </div>
            </section>
          ))}

          {/* Next project */}
          {next.slug !== project.slug && (
            <Link
              href={`/${lang}/projects/${next.slug}`}
              className="card group flex items-center justify-between gap-6 p-6 transition-colors hover:border-accent md:p-8"
            >
              <div>
                <p className="eyebrow">{cs.next}</p>
                <p className="mt-2 text-h3 font-semibold">{next.title}</p>
                <p className="mt-1 text-sm text-muted">{next.subtitle[lang]}</p>
              </div>
              <ArrowRight size={22} className="shrink-0 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function Meta({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-surface p-5 ${className}`}>
      <dt className="font-mono text-xs tracking-wide text-subtle uppercase">{label}</dt>
      <dd className="mt-2 text-sm">{children}</dd>
    </div>
  );
}
