// Lists the information still missing in src/content (the files edited in the admin).
// Usage: npm run check:content   (exits with code 1 if something is missing)
import { readdirSync, readFileSync } from "node:fs";

const read = (f) => JSON.parse(readFileSync(`src/content/${f}`, "utf8"));
const empty = (v) => v === null || v === undefined || (typeof v === "string" && !v.trim());
const emptyLoc = (v) => !v || (empty(v.en) && empty(v.fr));
const missing = [];
const optional = [];

const p = read("profile.json");
if (empty(p.photo)) missing.push("Profile → photo");
if (empty(p.cv)) missing.push("Profile → CV");
if (empty(p.linkedin)) missing.push("Profile → LinkedIn URL");
if (empty(p.email)) missing.push("Profile → email");
if (emptyLoc(p.spokenLanguages)) missing.push("Profile → spoken languages");
if (p.openToWork && emptyLoc(p.availability)) missing.push("Profile → availability text");

read("education.json").items.forEach((e) => emptyLoc(e.period) && missing.push(`Education → ${e.school} → period`));

for (const file of readdirSync("src/content/projects").filter((f) => f.endsWith(".json"))) {
  const pr = read(`projects/${file}`);
  const name = `Projects → ${pr.title}`;
  if (emptyLoc(pr.period)) missing.push(`${name} → period`);
  if (empty(pr.context)) missing.push(`${name} → context`);
  if (empty(pr.thumbnail)) optional.push(`${name} → card image (a stack tile is shown instead)`);
  (pr.screenshots ?? []).forEach((s, i) => empty(s.image) && missing.push(`${name} → screenshot ${i + 1}`));
  (pr.diagrams ?? []).forEach((d) => empty(d.image) && missing.push(`${name} → ${d.alt?.en ?? "diagram"}`));
  (pr.pending ?? []).forEach((t) => missing.push(`${name} → ${t}`));
}

if (optional.length > 0) {
  console.log(`ℹ ${optional.length} optional item(s):`);
  optional.forEach((m) => console.log("  - " + m));
  console.log("");
}

if (missing.length === 0) {
  console.log("✓ Nothing missing — ready to publish.");
} else {
  console.log(`✗ ${missing.length} item(s) still missing (edit them at /keystatic):\n`);
  missing.forEach((m) => console.log("  - " + m));
  process.exitCode = 1;
}
