import { ArrowUpRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";

export function Experience({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeading id="experience-title" index="02" eyebrow={dict.experience.eyebrow} title={dict.experience.title} />

        <ol className="relative space-y-12 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-px before:bg-line md:before:left-[calc(16rem+11px)]">
          {experience.map((item) => (
            <Reveal as="li" key={item.id} className="relative grid gap-4 pl-10 md:grid-cols-[16rem_1fr] md:gap-0 md:pl-0">
              <div className="md:pr-10 md:text-right">
                <p className="font-mono text-sm text-accent">{item.period[locale]}</p>
                <p className="mt-1 text-sm text-subtle">{item.location[locale]}</p>
              </div>

              <span
                aria-hidden="true"
                className="absolute top-1 left-0 grid size-6 place-items-center rounded-full border border-accent/40 bg-bg md:left-[16rem]"
              >
                <Briefcase size={12} className="text-accent" />
              </span>

              <article className="card p-6 md:ml-12 md:p-8">
                <h3 className="text-h3 font-semibold">{item.role[locale]}</h3>
                <p className="mt-1 text-muted">
                  <span className="font-medium text-fg">{item.company}</span> — {item.companyFull}
                </p>
                <p className="mt-5 leading-relaxed text-muted">{item.summary[locale]}</p>
                <ul className="mt-6 space-y-2.5">
                  {item.tasks[locale].map((task) => (
                    <li key={task} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      {task}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.stack.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
                {item.projectSlug && (
                  <Link
                    href={`/${locale}/projects/${item.projectSlug}`}
                    className="group mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                  >
                    {dict.experience.caseStudy}
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                )}
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
