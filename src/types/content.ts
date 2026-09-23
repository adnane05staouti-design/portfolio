import type { Localized } from "@/lib/i18n";

/**
 * A value that is not provided yet. The UI renders it as a clearly marked
 * placeholder and `npm run check:content` lists every remaining one.
 */
export type Placeholder = { placeholder: true; label: string };
export type Maybe<T> = T | Placeholder;

export const todo = (label: string): Placeholder => ({ placeholder: true, label });
export const isPlaceholder = (value: unknown): value is Placeholder =>
  typeof value === "object" && value !== null && "placeholder" in value;

export type SocialLink = {
  id: "github" | "linkedin" | "email";
  label: string;
  url: Maybe<string>;
};

export type Profile = {
  name: string;
  shortName: string;
  role: Localized;
  focus: Localized;
  intro: Localized;
  location: Localized;
  school: string;
  schoolFull: string;
  program: Localized;
  level: Localized;
  /** null = not looking right now: the badge and the "Looking for" line are hidden. */
  availability: Maybe<Localized> | null;
  spokenLanguages: Maybe<Localized>;
  email: Maybe<string>;
  cvUrl: Maybe<string>;
  photo: Maybe<string>;
  siteUrl: string;
};

export type ProjectContext = "internship" | "academic" | "personal";

export type ProjectImage = {
  src: Maybe<string>;
  alt: Localized;
  caption?: Localized;
};

export type ProjectSection = {
  id: string;
  title: Localized;
  body?: Localized<string[]>;
  bullets?: Localized<string[]>;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: Localized;
  summary: Localized;
  context: Maybe<ProjectContext>;
  period: Maybe<Localized>;
  featured: boolean;
  role?: Localized;
  stack: string[];
  thumbnail: ProjectImage;
  repo: { visibility: "private" } | { visibility: "public"; url: string } | { visibility: "unknown" };
  liveUrl?: string;
  highlights?: Localized<string[]>;
  screenshots: ProjectImage[];
  diagrams: ProjectImage[];
  /** Ordered case-study sections rendered on /projects/[slug]. */
  sections: ProjectSection[];
  /** Missing information still to provide (rendered as placeholders). */
  pending?: string[];
};

export type Experience = {
  id: string;
  role: Localized;
  company: string;
  companyFull: string;
  period: Localized;
  location: Localized;
  summary: Localized;
  tasks: Localized<string[]>;
  stack: string[];
  projectSlug?: string;
};

export type SkillGroup = {
  id: string;
  title: Localized;
  items: { name: string; usedIn?: string[] }[];
};

export type Education = {
  id: string;
  school: string;
  schoolFull: string;
  degree: Localized;
  period: Maybe<Localized>;
  location: Localized;
  status: Localized;
  coursework?: Localized<string[]>;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verifyUrl?: string;
};
