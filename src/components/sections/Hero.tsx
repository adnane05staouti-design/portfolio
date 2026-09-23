import { ArrowDownRight, Download, Mail, MapPin } from "lucide-react";
import { LinkButton, buttonClass } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { profile, socials } from "@/data/profile";
import type { Dictionary } from "@/dictionaries";
import { valueOf } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { isPlaceholder } from "@/types/content";
import { ArchitectureGraph } from "./ArchitectureGraph";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cv = valueOf(profile.cvUrl);
  const availability = valueOf(profile.availability);
  const github = valueOf(socials.find((s) => s.id === "github")!.url);
  const linkedinUrl = socials.find((s) => s.id === "linkedin")!.url;
  const linkedin = valueOf(linkedinUrl);
  const [firstName, ...lastNames] = profile.name.split(" ");

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[36rem]" style={{ background: "var(--glow)" }} />

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <Reveal>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              {availability ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-xs text-muted">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  {availability[locale]}
                </span>
              ) : (
                isPlaceholder(profile.availability) && <PlaceholderTag value={profile.availability} />
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                <MapPin size={13} aria-hidden="true" />
                {profile.location[locale]}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 id="hero-title" className="text-display font-semibold uppercase">
              {firstName}
              <br />
              <span className="text-muted">{lastNames.join(" ")}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 text-h3 font-medium">{profile.role[locale]}</p>
            <p className="mt-2 font-mono text-sm text-accent">{profile.focus[locale]}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-6 max-w-xl text-lead text-muted">{profile.intro[locale]}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <LinkButton href="#projects" size="lg">
                {dict.hero.explore}
                <ArrowDownRight size={17} className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5" aria-hidden="true" />
              </LinkButton>
              {cv ? (
                <LinkButton href={cv} download="Adnane-Staouti-CV.pdf" variant="secondary" size="lg">
                  <Download size={17} aria-hidden="true" />
                  {dict.hero.cv}
                </LinkButton>
              ) : (
                <span className={buttonClass("secondary", "lg", "cursor-not-allowed opacity-70")} aria-disabled="true">
                  <Download size={17} aria-hidden="true" />
                  {dict.hero.cv}
                  {isPlaceholder(profile.cvUrl) && <PlaceholderTag value={profile.cvUrl} className="ml-1" />}
                </span>
              )}
              <LinkButton href="#contact" variant="ghost" size="lg">
                <Mail size={17} aria-hidden="true" />
                {dict.hero.contact}
              </LinkButton>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex items-center gap-2">
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent">
                  <GitHubIcon aria-hidden="true" />
                </a>
              )}
              {linkedin ? (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent">
                  <LinkedInIcon aria-hidden="true" />
                </a>
              ) : (
                isPlaceholder(linkedinUrl) && (
                  <span className="inline-flex items-center gap-2 text-muted">
                    <LinkedInIcon aria-hidden="true" />
                    <PlaceholderTag value={linkedinUrl} />
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={24} className="mx-auto hidden w-full max-w-xl sm:block lg:max-w-none">
          <ArchitectureGraph nodes={dict.hero.nodes} label={dict.hero.diagramLabel} caption={dict.hero.diagramCaption} />
        </Reveal>
      </div>
    </section>
  );
}
