/**
 * Content edited in the admin (/keystatic). The JSON files next to this one are
 * bundled at build time, and reloaded instantly in development after a save.
 * (import.meta.glob only matches files at or below this folder.)
 */
const modules = import.meta.glob("./projects/*.json", { eager: true });

/** { "./projects/<slug>.json": <parsed JSON> } */
export const projectFiles: Record<string, unknown> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path, (mod as { default?: unknown }).default ?? mod]),
);
