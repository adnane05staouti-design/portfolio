import { localizedOrEmpty, type LocText } from "@/lib/cms";
import type { SkillGroup } from "@/types/content";
import skillsJson from "../content/skills.json";

/** Edited in the admin: /keystatic → Skills (file: src/content/skills.json). */
type SkillsJson = {
  groups: { title: LocText; items: { name: string; usedIn?: string[] }[] }[];
};

export const skills: SkillGroup[] = (skillsJson as unknown as SkillsJson).groups.map((g, i) => ({
  id: `skills-${i}`,
  title: localizedOrEmpty(g.title),
  items: g.items.filter((s) => s.name?.trim()).map((s) => ({ name: s.name.trim(), usedIn: (s.usedIn ?? []).filter(Boolean) })),
}));
