import { Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications } from "@/data/certifications";
import { profile, socials } from "@/data/profile";
import type { Dictionary } from "@/dictionaries";
import { valueOf } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { isPlaceholder } from "@/types/content";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";

export function Contact({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const email = valueOf(profile.email);
  const github = socials.find((s) => s.id === "github")!;
  const linkedin = socials.find((s) => s.id === "linkedin")!;

  const rows = [
    {
      icon: <Mail size={18} aria-hidden="true" />,
      label: "Email",
      content: email ? (
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${email}`} className="break-all hover:text-accent">
            {email}
          </a>
          <CopyEmail email={email} label={dict.contact.copy} copiedLabel={dict.contact.copied} />
        </div>
      ) : (
        isPlaceholder(profile.email) && <PlaceholderTag value={profile.email} />
      ),
    },
    {
      icon: <LinkedInIcon size={17} aria-hidden="true" />,
      label: "LinkedIn",
      content: isPlaceholder(linkedin.url) ? (
        <PlaceholderTag value={linkedin.url} />
      ) : (
        <a href={linkedin.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
          {linkedin.url.replace(/^https?:\/\/(www\.)?/, "")}
        </a>
      ),
    },
    {
      icon: <GitHubIcon size={17} aria-hidden="true" />,
      label: "GitHub",
      content: isPlaceholder(github.url) ? (
        <PlaceholderTag value={github.url} />
      ) : (
        <a href={github.url} target="_blank" rel="noopener noreferrer" className="break-all hover:text-accent">
          {github.url.replace(/^https?:\/\//, "")}
        </a>
      ),
    },
    { icon: <MapPin size={18} aria-hidden="true" />, label: dict.contact.location, content: profile.location[locale] },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line py-24 md:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-96 rotate-180" style={{ background: "var(--glow)" }} />
      <div className="container-page">
        <SectionHeading id="contact-title" index={certifications.length ? "07" : "06"} eyebrow={dict.contact.eyebrow} title={dict.contact.title} intro={dict.contact.intro} />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <ul className="card divide-y divide-line">
              {rows.map((row) => (
                <li key={row.label} className="flex gap-4 p-5">
                  <span className="mt-0.5 text-accent">{row.icon}</span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs tracking-wide text-subtle uppercase">{row.label}</p>
                    <div className="mt-1 text-[0.95rem]">{row.content}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm labels={dict.contact.form} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
