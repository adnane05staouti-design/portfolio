import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { otherProjects } from "@/data/projects";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import { FeaturedProject } from "./FeaturedProject";

export function Projects({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeading id="projects-title" index="03" eyebrow={dict.projects.eyebrow} title={dict.featured.eyebrow + "."} />
        <FeaturedProject locale={locale} dict={dict} />

        <div className="mt-24 md:mt-32">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-h2 font-semibold">{dict.projects.title}</h3>
            <Link href={`/${locale}/projects`} className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              {dict.projects.seeAll}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Reveal>
          <ProjectGrid projects={otherProjects} locale={locale} labels={dict.projects} filterable={false} />
        </div>
      </div>
    </section>
  );
}
