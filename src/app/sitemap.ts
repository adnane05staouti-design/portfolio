import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/projects", ...projects.map((p) => `/projects/${p.slug}`)];
  return paths.map((path) => ({
    url: `${siteUrl}/en${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/projects/aos-abhbc" ? 0.9 : 0.7,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) },
  }));
}
