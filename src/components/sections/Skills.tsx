import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";

const titleOf = (slug: string) => projects.find((p) => p.slug === slug)?.title ?? slug;

export function Skills({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeading id="skills-title" index="04" eyebrow={dict.skills.eyebrow} title={dict.skills.title} intro={dict.skills.intro} />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, gi) => (
            <Reveal key={group.id} delay={0.04 * gi} className={`card p-6 ${group.id === "backend" ? "lg:row-span-1" : ""}`}>
              <h3 className="flex items-center justify-between">
                <span className="font-semibold">{group.title[locale]}</span>
                <span className="font-mono text-xs text-subtle">{String(group.items.length).padStart(2, "0")}</span>
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((skill) => {
                  const used = skill.usedIn && skill.usedIn.length > 0;
                  const tip = used ? `${dict.skills.usedIn}: ${skill.usedIn!.map(titleOf).join(", ")}` : undefined;
                  return (
                    <li key={skill.name}>
                      <span
                        title={tip}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                          used
                            ? "border-accent/30 bg-accent-soft text-fg hover:border-accent"
                            : "border-line bg-surface-2/60 text-muted hover:border-line-strong hover:text-fg"
                        }`}
                      >
                        {used && <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />}
                        {skill.name}
                        {tip && <span className="sr-only"> — {tip}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
