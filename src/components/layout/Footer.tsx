import { ArrowUp, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { socials, profile } from "@/data/profile";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import { valueOf } from "@/lib/content";

const icons = { github: GitHubIcon, linkedin: LinkedInIcon, email: Mail };

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight">
            {profile.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-1 text-sm text-muted">{profile.role[locale]}</p>
          <p className="mt-6 font-mono text-xs text-subtle">
            © {year} {profile.name} — {dict.footer.rights}
          </p>
          <p className="mt-1 font-mono text-xs text-subtle">{dict.footer.builtWith}</p>
        </div>
        <div className="flex items-center gap-2">
          {socials.map((s) => {
            const url = valueOf(s.url);
            if (!url) return null;
            const Icon = icons[s.id];
            return (
              <a
                key={s.id}
                href={url}
                aria-label={s.label}
                {...(s.id !== "email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={17} aria-hidden="true" />
              </a>
            );
          })}
          <a
            href="#top"
            aria-label={dict.footer.backToTop}
            className="ml-2 grid size-10 place-items-center rounded-full bg-surface-2 text-fg transition-colors hover:bg-accent hover:text-accent-contrast"
          >
            <ArrowUp size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
