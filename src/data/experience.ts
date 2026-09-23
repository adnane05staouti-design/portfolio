import { list, localizedOrEmpty, type LocList, type LocText } from "@/lib/cms";
import type { Experience } from "@/types/content";
import experienceJson from "../content/experience.json";

/** Edited in the admin: /keystatic → Experience (file: src/content/experience.json). */
type ExperienceJson = {
  items: {
    role: LocText;
    company: string;
    companyFull: string;
    period: LocText;
    location: LocText;
    summary: LocText;
    tasks: LocList;
    stack?: string[];
    project?: string | null;
  }[];
};

export const experience: Experience[] = (experienceJson as unknown as ExperienceJson).items.map((e, i) => ({
  id: `experience-${i}`,
  role: localizedOrEmpty(e.role),
  company: e.company,
  companyFull: e.companyFull,
  period: localizedOrEmpty(e.period),
  location: localizedOrEmpty(e.location),
  summary: localizedOrEmpty(e.summary),
  tasks: list(e.tasks) ?? { en: [], fr: [] },
  stack: (e.stack ?? []).filter(Boolean),
  projectSlug: e.project || undefined,
}));
