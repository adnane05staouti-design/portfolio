import { list, locOr, localizedOrEmpty, type LocList, type LocText } from "@/lib/cms";
import type { Education } from "@/types/content";
import educationJson from "../content/education.json";

/** Edited in the admin: /keystatic → Education (file: src/content/education.json). */
type EducationJson = {
  items: {
    school: string;
    schoolFull: string;
    degree: LocText;
    period: LocText;
    location: LocText;
    status: LocText;
    coursework?: LocList;
  }[];
};

export const education: Education[] = (educationJson as unknown as EducationJson).items.map((e, i) => ({
  id: `education-${i}`,
  school: e.school,
  schoolFull: e.schoolFull ?? "",
  degree: localizedOrEmpty(e.degree),
  period: locOr(e.period, "ADD DATES"),
  location: localizedOrEmpty(e.location),
  status: localizedOrEmpty(e.status),
  coursework: list(e.coursework),
}));
