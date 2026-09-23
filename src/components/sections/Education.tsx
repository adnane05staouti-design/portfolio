import { GraduationCap } from "lucide-react";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education } from "@/data/education";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import { isPlaceholder } from "@/types/content";

export function Education({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section id="education" aria-labelledby="education-title" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeading id="education-title" index="05" eyebrow={dict.education.eyebrow} title={dict.education.title} />

        <ol className="space-y-6">
          {education.map((item) => (
            <Reveal as="li" key={item.id} className={`card grid gap-8 p-6 md:p-10 ${item.coursework ? "md:grid-cols-[1fr_1fr]" : ""}`}>
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl border border-line-strong bg-surface-2 text-accent">
                    <GraduationCap size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{item.school}</h3>
                    {item.schoolFull && <p className="text-sm text-muted">{item.schoolFull}</p>}
                  </div>
                </div>
                <p className="mt-6 font-medium">{item.degree[locale]}</p>
                <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-sm text-accent">
                  {item.status[locale]}
                  <span className="text-subtle">·</span>
                  {isPlaceholder(item.period) ? <PlaceholderTag value={item.period} /> : item.period[locale]}
                </p>
                <p className="mt-1 text-sm text-subtle">{item.location[locale]}</p>
              </div>
              {item.coursework && (
              <div>
                <h4 className="eyebrow mb-4">{dict.education.coursework}</h4>
                <ul className="flex flex-wrap gap-2">
                  {item.coursework[locale].map((c) => (
                    <li key={c} className="rounded-lg border border-line bg-surface-2/60 px-3 py-1.5 text-sm text-muted">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
