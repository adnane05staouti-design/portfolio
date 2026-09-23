import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adnane Staouti — Portfolio",
    short_name: "Adnane",
    description: "Computer Engineering student — full-stack development and software engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b0d",
    theme_color: "#0a0b0d",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
