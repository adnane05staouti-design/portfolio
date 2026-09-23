import type { GalleryItem } from "@/components/project/Gallery";
import { certifications } from "@/data/certifications";
import type { Locale } from "@/lib/i18n";
import { isPlaceholder, type Maybe, type ProjectImage } from "@/types/content";

/** Returns the value, or null when it is still a placeholder. */
export const valueOf = <T,>(value: Maybe<T>): T | null => (isPlaceholder(value) ? null : value);

export const toGalleryItem = (image: ProjectImage, locale: Locale): GalleryItem => ({
  src: valueOf(image.src),
  placeholderLabel: isPlaceholder(image.src) ? image.src.label : undefined,
  alt: image.alt[locale],
  caption: image.caption?.[locale],
});

export const sectionIds = [
  "home",
  "about",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "contact",
] as const;
export type SectionId = (typeof sectionIds)[number];

/** Sections shown in the navigation (certifications only once one exists). */
export const navSections = (): SectionId[] =>
  sectionIds.filter((id) => id !== "certifications" || certifications.length > 0);
