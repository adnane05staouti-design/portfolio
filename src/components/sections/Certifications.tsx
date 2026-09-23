import { Award, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications } from "@/data/certifications";
import type { Dictionary } from "@/dictionaries";

/** Renders nothing until at least one real certification is added in data/certifications.ts. */
export function Certifications({ dict }: { dict: Dictionary }) {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" aria-labelledby="certifications-title" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeading id="certifications-title" index="06" eyebrow={dict.certifications.eyebrow} title={dict.certifications.title} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <Reveal as="li" key={c.id} delay={0.05 * i} className="card flex flex-col p-6">
              <Award size={20} className="text-accent" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted">{c.issuer}</p>
              <p className="mt-1 font-mono text-xs text-subtle">{c.date}</p>
              {c.credentialId && (
                <p className="mt-3 font-mono text-xs text-subtle">
                  {dict.certifications.credential}: {c.credentialId}
                </p>
              )}
              {c.verifyUrl && (
                <a
                  href={c.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-accent"
                >
                  {dict.certifications.verify}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
