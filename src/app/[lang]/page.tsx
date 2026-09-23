import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { About } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { education } from "@/data/education";
import { profile, socials } from "@/data/profile";
import { getDictionary } from "@/dictionaries";
import { valueOf } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: `${siteUrl}/${lang}`,
    jobTitle: profile.role[lang],
    address: { "@type": "PostalAddress", addressLocality: "Casablanca", addressCountry: "MA" },
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.schoolFull })),
    sameAs: socials.filter((s) => s.id !== "email").map((s) => valueOf(s.url)).filter(Boolean),
    knowsAbout: ["Software Engineering", "Full-Stack Development", "Spring Boot", "React", "PostgreSQL", "Docker", "Computer Networks"],
  };

  return (
    <SiteShell locale={lang} isHome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero locale={lang} dict={dict} />
      <About locale={lang} dict={dict} />
      <Experience locale={lang} dict={dict} />
      <Projects locale={lang} dict={dict} />
      <Skills locale={lang} dict={dict} />
      <Education locale={lang} dict={dict} />
      <Certifications dict={dict} />
      <Contact locale={lang} dict={dict} />
    </SiteShell>
  );
}
