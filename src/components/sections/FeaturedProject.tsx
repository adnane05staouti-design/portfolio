import { ArrowUpRight, Lock, Network } from "lucide-react";
import { StackFlow } from "@/components/project/StackFlow";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { featuredProject as project } from "@/data/projects";
import type { Dictionary } from "@/dictionaries";
import { valueOf } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Gallery } from "@/components/project/Gallery";
import { toGalleryItem } from "@/lib/content";

export function FeaturedProject({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const section = (id: string) => project.sections.find((s) => s.id === id);
  const problem = section("problem")?.body?.[locale][0];
  const solution = section("solution")?.body?.[locale][0];
  const period = valueOf(project.period);
  const context = valueOf(project.context);
  const caseUrl = `/${locale}/projects/${project.slug}`;

  return (
    <Reveal as="article" className="card relative overflow-hidden" y={28}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-64" style={{ background: "var(--glow)" }} />

      <div className="relative p-6 sm:p-10 lg:p-14">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{dict.featured.eyebrow}</Badge>
          {context && <Badge>{dict.projects.context[context]}</Badge>}
          {period && <Badge>{period[locale]}</Badge>}
        </div>

        <h3 className="mt-6 text-h2 font-semibold">{project.title}</h3>
        <p className="mt-3 max-w-2xl text-lead text-muted">{project.subtitle[locale]}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="space-y-8">
            <Block index="01" title={dict.featured.problem} text={problem} />
            <Block index="02" title={dict.featured.solution} text={solution} />
            <div>
              <p className="eyebrow mb-4 flex gap-3">
                <span className="text-subtle">03</span>
                {dict.featured.features}
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {project.highlights?.[locale].map((h) => (
                  <li key={h} className="rounded-lg border border-line bg-surface-2/60 px-3.5 py-3 text-sm">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4 flex gap-3">
              <span className="text-subtle">04</span>
              {dict.featured.architecture}
            </p>
            {project.slug === "aos-abhbc" ? (
              <StackFlow dockerLabel="Docker Compose" />
            ) : (
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s} className="rounded-lg border border-line bg-surface-2/60 px-3 py-1.5 font-mono text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {project.screenshots.length > 0 && (
        <div className="mt-12">
          <Gallery
            items={[toGalleryItem(project.screenshots[0], locale)]}
            columns={1}
            labels={{ close: dict.a11y.close, previous: dict.a11y.previous, next: dict.a11y.next, zoom: dict.a11y.zoom }}
          />
        </div>
        )}

        <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <LinkButton href={caseUrl} size="lg">
              {dict.featured.viewCaseStudy}
              <ArrowUpRight size={17} aria-hidden="true" />
            </LinkButton>
            <LinkButton href={`${caseUrl}#architecture`} variant="secondary" size="lg">
              <Network size={17} aria-hidden="true" />
              {dict.featured.viewArchitecture}
            </LinkButton>
          </div>
          {project.repo.visibility === "private" && (
            <p className="flex items-center gap-2 text-sm text-subtle">
              <Lock size={15} aria-hidden="true" />
              {dict.featured.privateRepo}
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function Block({ index, title, text }: { index: string; title: string; text?: string }) {
  return (
    <div>
      <p className="eyebrow mb-3 flex gap-3">
        <span className="text-subtle">{index}</span>
        {title}
      </p>
      <p className="leading-relaxed text-muted">{text}</p>
    </div>
  );
}
