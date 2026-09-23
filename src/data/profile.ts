import { loc, locOr, localizedOrEmpty, paragraphs, textOr, type LocText } from "@/lib/cms";
import type { Localized } from "@/lib/i18n";
import { todo, type Profile, type SocialLink } from "@/types/content";
import profileJson from "../content/profile.json";

/** Edited in the admin: /keystatic → Profile (file: src/content/profile.json). */
type ProfileJson = {
  name: string;
  role: LocText;
  focus: LocText;
  intro: LocText;
  location: LocText;
  school: string;
  schoolFull: string;
  program: LocText;
  level: LocText;
  openToWork: boolean;
  availability: LocText;
  spokenLanguages: LocText;
  email: string;
  cv: string | null;
  photo: string | null;
  github: string | null;
  linkedin: string | null;
  aboutTitle: LocText;
  aboutBody: LocText;
  interests: { title: LocText; text: LocText }[];
};

const raw = profileJson as unknown as ProfileJson;

/**
 * Public URL of the site (SEO, sitemap, social previews).
 * 1. NEXT_PUBLIC_SITE_URL if it is a valid http(s) URL
 * 2. otherwise the production domain Vercel provides automatically
 * 3. otherwise a default
 * An empty or invalid variable never breaks the build.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    "https://adnane-staouti.vercel.app",
  ];
  for (const value of candidates) {
    const url = value?.trim().replace(/\/+$/, "");
    if (!url) continue;
    try {
      if (/^https?:$/.test(new URL(url).protocol)) return url;
    } catch {
      /* invalid value: try the next one */
    }
  }
  return "https://adnane-staouti.vercel.app";
}

export const profile: Profile = {
  name: raw.name,
  shortName: raw.name.split(" ")[0],
  role: localizedOrEmpty(raw.role),
  focus: localizedOrEmpty(raw.focus),
  intro: localizedOrEmpty(raw.intro),
  location: localizedOrEmpty(raw.location),
  school: raw.school,
  schoolFull: raw.schoolFull,
  program: localizedOrEmpty(raw.program),
  level: localizedOrEmpty(raw.level),
  availability: raw.openToWork ? locOr(raw.availability, "ADD AVAILABILITY") : null,
  spokenLanguages: locOr(raw.spokenLanguages, "ADD SPOKEN LANGUAGES"),
  email: textOr(raw.email, "ADD EMAIL"),
  cvUrl: textOr(raw.cv, "ADD CV"),
  photo: textOr(raw.photo, "ADD PHOTO"),
  siteUrl: resolveSiteUrl(),
};

export const about: {
  title: Localized;
  body: Localized<string[]>;
  interests: { title: Localized; text: Localized }[];
} = {
  title: localizedOrEmpty(raw.aboutTitle),
  body: paragraphs(raw.aboutBody) ?? { en: [], fr: [] },
  interests: (raw.interests ?? [])
    .map((i) => ({ title: loc(i.title), text: localizedOrEmpty(i.text) }))
    .filter((i): i is { title: Localized; text: Localized } => i.title !== null),
};

const email = textOr(raw.email, "ADD EMAIL");

export const socials: SocialLink[] = [
  { id: "github", label: "GitHub", url: textOr(raw.github, "ADD GITHUB URL") },
  { id: "linkedin", label: "LinkedIn", url: textOr(raw.linkedin, "ADD LINKEDIN URL") },
  { id: "email", label: "Email", url: typeof email === "string" ? `mailto:${email}` : todo("ADD EMAIL") },
];
