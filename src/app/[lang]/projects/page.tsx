import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata({ locale: lang, path: "/projects", title: dict.meta.projectsTitle, description: dict.meta.projectsDescription });
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <SiteShell locale={lang}>
      <section aria-labelledby="projects-page-title" className="relative isolate pt-36 pb-24 md:pt-44 md:pb-32">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-96" style={{ background: "var(--glow)" }} />
        <div className="container-page">
          <SectionHeading as="h1" id="projects-page-title" eyebrow={dict.projects.eyebrow} title={dict.projects.pageTitle + "."} intro={dict.projects.pageIntro} />
          <ProjectGrid projects={projects} locale={lang} labels={dict.projects} />
        </div>
      </section>
    </SiteShell>
  );
}
