import Image from "next/image";
import { UserRound } from "lucide-react";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about, profile } from "@/data/profile";
import type { Dictionary } from "@/dictionaries";
import { valueOf } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { isPlaceholder, type Maybe } from "@/types/content";
import type { Localized } from "@/lib/i18n";

export function About({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const photo = valueOf(profile.photo);
  const f = dict.about.facts;

  const facts = (
    [
    [f.location, profile.location],
    [f.school, `${profile.school} — ${profile.schoolFull}`],
    [f.program, profile.program],
    [f.level, profile.level],
    [f.languages, profile.spokenLanguages],
    [f.looking, profile.availability],
  ] as [string, Maybe<Localized> | string | null][]
  ).filter((fact): fact is [string, Maybe<Localized> | string] => fact[1] !== null);

  return (
    <section id="about" aria-labelledby="about-title" className="py-24 md:py-32">
      <div className="container-page">
        <SectionHeading id="about-title" index="01" eyebrow={dict.about.eyebrow} title={about.title[locale]} />

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="space-y-5">
            <div className="card relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:aspect-[4/5]">
              {photo ? (
                <Image src={photo} alt={dict.about.photoAlt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover object-[center_25%]" />
              ) : (
                <div className="bg-grid flex h-full flex-col items-center justify-center gap-3 text-subtle">
                  <UserRound size={40} strokeWidth={1.2} aria-hidden="true" />
                  {isPlaceholder(profile.photo) && <PlaceholderTag value={profile.photo} />}
                </div>
              )}
            </div>
            <dl className="card divide-y divide-line">
              {facts.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="font-mono text-xs tracking-wide text-subtle uppercase">{label}</dt>
                  <dd className="text-sm sm:text-right">
                    {typeof value === "string" ? value : isPlaceholder(value) ? <PlaceholderTag value={value} /> : value[locale]}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div>
            <Reveal className="space-y-5 text-lead text-muted">
              {about.body[locale].map((p, i) => (
                <p key={i} className={i === 0 ? "text-fg" : ""}>
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="eyebrow mt-14 mb-6">{dict.about.interestsTitle}</h3>
            </Reveal>
            <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
              {about.interests.map((item, i) => (
                <Reveal as="li" key={item.title.en} delay={0.04 * i} className="bg-surface p-5 transition-colors hover:bg-surface-2">
                  <p className="flex items-center gap-2 font-medium">
                    <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {item.title[locale]}
                  </p>
                  <p className="mt-1.5 text-sm text-muted">{item.text[locale]}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
