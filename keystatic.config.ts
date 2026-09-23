import { collection, config, fields, singleton } from "@keystatic/core";

/**
 * Admin (CMS) configuration — the forms shown at /keystatic.
 *
 * Storage:
 *  - "local" (default): edits are written to the files of this folder. Use it with `npm run dev`.
 *  - "github": edits are committed to the GitHub repository, then Vercel redeploys the site.
 *    Enable it with NEXT_PUBLIC_KEYSTATIC_STORAGE=github and NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo.
 */
const useGitHub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";
const repo = (process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ?? "adnane05staouti-design/portfolio") as `${string}/${string}`;

// ---------- helpers: one text per language ----------
const bilingual = (label: string, opts: { multiline?: boolean; description?: string } = {}) =>
  fields.object(
    {
      en: fields.text({ label: `${label} — English`, multiline: opts.multiline }),
      fr: fields.text({ label: `${label} — Français`, multiline: opts.multiline }),
    },
    { label, description: opts.description },
  );

const bilingualList = (label: string, itemLabel: string) =>
  fields.object(
    {
      en: fields.array(fields.text({ label: itemLabel }), { label: `${label} — English`, itemLabel: (p) => p.value }),
      fr: fields.array(fields.text({ label: itemLabel }), { label: `${label} — Français`, itemLabel: (p) => p.value }),
    },
    { label },
  );

const PARAGRAPHS = "Separate paragraphs with an empty line.";

export default config({
  storage: useGitHub ? { kind: "github", repo } : { kind: "local" },
  ui: {
    brand: { name: "Adnane — Portfolio" },
    navigation: {
      Profile: ["profile"],
      Content: ["projects", "experience", "education", "skills", "certifications"],
    },
  },

  singletons: {
    profile: singleton({
      label: "Profile",
      path: "src/content/profile",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Full name", validation: { isRequired: true } }),
        role: bilingual("Title (e.g. Computer Engineering Student)"),
        focus: bilingual("Focus line under the title"),
        intro: bilingual("Short introduction (hero)", { multiline: true }),
        location: bilingual("Location"),
        school: fields.text({ label: "School (short)" }),
        schoolFull: fields.text({ label: "School (full name)" }),
        program: bilingual("Program"),
        level: bilingual("Current level (e.g. 4th year)"),
        openToWork: fields.checkbox({
          label: "Open to opportunities",
          description: "Shows the availability badge in the hero and the “Looking for” line.",
        }),
        availability: bilingual("Availability text", { description: "Used only when “Open to opportunities” is checked." }),
        spokenLanguages: bilingual("Spoken languages"),
        email: fields.text({ label: "Contact email" }),
        cv: fields.file({ label: "CV (PDF)", directory: "public/cv", publicPath: "/cv/" }),
        photo: fields.image({ label: "Profile photo", directory: "public/images/profile", publicPath: "/images/profile/" }),
        github: fields.url({ label: "GitHub URL" }),
        linkedin: fields.url({ label: "LinkedIn URL" }),
        aboutTitle: bilingual("About — heading"),
        aboutBody: bilingual("About — text", { multiline: true, description: PARAGRAPHS }),
        interests: fields.array(
          fields.object({ title: bilingual("Title"), text: bilingual("Description") }),
          { label: "About — “What I work on” cards", itemLabel: (p) => p.fields.title.fields.en.value || "Card" },
        ),
      },
    }),

    experience: singleton({
      label: "Experience",
      path: "src/content/experience",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            role: bilingual("Role"),
            company: fields.text({ label: "Company (short)" }),
            companyFull: fields.text({ label: "Company (full name)" }),
            period: bilingual("Period"),
            location: bilingual("Location"),
            summary: bilingual("Summary", { multiline: true }),
            tasks: bilingualList("Tasks", "Task"),
            stack: fields.array(fields.text({ label: "Technology" }), { label: "Technologies", itemLabel: (p) => p.value }),
            project: fields.relationship({ label: "Related case study", collection: "projects" }),
          }),
          { label: "Experiences (drag to reorder)", itemLabel: (p) => `${p.fields.role.fields.en.value} — ${p.fields.company.value}` },
        ),
      },
    }),

    education: singleton({
      label: "Education",
      path: "src/content/education",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            school: fields.text({ label: "School (short)" }),
            schoolFull: fields.text({ label: "School (full name)" }),
            degree: bilingual("Degree"),
            period: bilingual("Period"),
            location: bilingual("Location"),
            status: bilingual("Status (e.g. Currently in 4th year)"),
            coursework: bilingualList("Relevant coursework", "Course"),
          }),
          { label: "Education (drag to reorder)", itemLabel: (p) => p.fields.school.value || "School" },
        ),
      },
    }),

    skills: singleton({
      label: "Skills",
      path: "src/content/skills",
      format: { data: "json" },
      schema: {
        groups: fields.array(
          fields.object({
            title: bilingual("Category"),
            items: fields.array(
              fields.object({
                name: fields.text({ label: "Skill" }),
                usedIn: fields.multiRelationship({ label: "Used in projects", collection: "projects" }),
              }),
              { label: "Skills", itemLabel: (p) => p.fields.name.value || "Skill" },
            ),
          }),
          { label: "Categories (drag to reorder)", itemLabel: (p) => p.fields.title.fields.en.value || "Category" },
        ),
      },
    }),

    certifications: singleton({
      label: "Certifications",
      path: "src/content/certifications",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: "Identifier (no spaces, e.g. ccna-1)" }),
            name: fields.text({ label: "Certificate name" }),
            issuer: fields.text({ label: "Issuer" }),
            date: fields.text({ label: "Date (e.g. 2026-05)" }),
            credentialId: fields.text({ label: "Credential ID (optional)" }),
            verifyUrl: fields.url({ label: "Verification link (optional)" }),
          }),
          {
            label: "Certifications — the section stays hidden while this list is empty",
            itemLabel: (p) => p.fields.name.value || "Certification",
          },
        ),
      },
    }),
  },

  collections: {
    projects: collection({
      label: "Projects",
      path: "src/content/projects/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "order"],
      schema: {
        title: fields.slug({ name: { label: "Project name" }, slug: { label: "URL slug", description: "Used in /projects/<slug>" } }),
        order: fields.integer({ label: "Order (0 = first)", defaultValue: 10 }),
        featured: fields.checkbox({ label: "Featured project (big case-study block on the home page — only one)" }),
        subtitle: bilingual("Subtitle"),
        summary: bilingual("Short summary", { multiline: true }),
        context: fields.select({
          label: "Context",
          options: [
            { label: "— not specified —", value: "" },
            { label: "Internship", value: "internship" },
            { label: "Academic", value: "academic" },
            { label: "Personal", value: "personal" },
          ],
          defaultValue: "",
        }),
        period: bilingual("Period (e.g. July – August 2026)"),
        role: bilingual("My role (optional)"),
        stack: fields.array(fields.text({ label: "Technology" }), { label: "Technologies", itemLabel: (p) => p.value }),
        thumbnail: fields.image({ label: "Card image", directory: "public/images/projects", publicPath: "/images/projects/" }),
        thumbnailAlt: bilingual("Card image — description (alt text)"),
        repoVisibility: fields.select({
          label: "Source code",
          options: [
            { label: "Not shown", value: "unknown" },
            { label: "Private — code available upon request", value: "private" },
            { label: "Public — show a link", value: "public" },
          ],
          defaultValue: "unknown",
        }),
        repoUrl: fields.url({ label: "Public repository URL (only if public)" }),
        liveUrl: fields.url({ label: "Live demo URL (optional)" }),
        highlights: bilingualList("Highlights (featured project only)", "Highlight"),
        screenshots: fields.array(
          fields.object({
            image: fields.image({ label: "Screenshot", directory: "public/images/projects", publicPath: "/images/projects/" }),
            alt: bilingual("Description (alt text)"),
            caption: bilingual("Caption"),
          }),
          { label: "Screenshots (anonymize personal data first!)", itemLabel: (p) => p.fields.alt.fields.en.value || "Screenshot" },
        ),
        diagrams: fields.array(
          fields.object({
            image: fields.image({ label: "Diagram", directory: "public/images/projects", publicPath: "/images/projects/" }),
            alt: bilingual("Diagram name"),
          }),
          { label: "UML / architecture diagrams", itemLabel: (p) => p.fields.alt.fields.en.value || "Diagram" },
        ),
        sections: fields.array(
          fields.object({
            key: fields.text({
              label: "Section id",
              description:
                "Short id without spaces (e.g. problem). Special ids: architecture, stack, screenshots, uml — they also show the interactive block.",
            }),
            title: bilingual("Title"),
            body: bilingual("Text", { multiline: true, description: PARAGRAPHS }),
            bullets: bilingualList("Bullet points", "Point"),
          }),
          { label: "Case-study sections (drag to reorder)", itemLabel: (p) => p.fields.title.fields.en.value || p.fields.key.value },
        ),
        pending: fields.array(fields.text({ label: "Missing item" }), {
          label: "Still to add (shown as placeholders)",
          itemLabel: (p) => p.value,
        }),
      },
    }),
  },
});
