import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { hasLocale, locales } from "@/lib/i18n";

export const alt = "Adnane Staouti — Computer Engineering Student";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "en";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0b0d",
          backgroundImage:
            "radial-gradient(60% 70% at 80% 0%, rgba(138,180,255,0.22), transparent 70%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 56px 56px, 56px 56px",
          color: "#ecedef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#8ab4ff", letterSpacing: 4 }}>
          <div style={{ width: 40, height: 2, background: "#8ab4ff" }} />
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>ADNANE STAOUTI</div>
          <div style={{ marginTop: 28, fontSize: 40, color: "#ecedef" }}>{profile.role[lang]}</div>
          <div style={{ marginTop: 10, fontSize: 30, color: "#9ba1ab" }}>{profile.focus[lang]}</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#9ba1ab" }}>
          {["Spring Boot", "React", "PostgreSQL", "Docker"].map((t) => (
            <div key={t} style={{ display: "flex", padding: "8px 18px", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999 }}>
              {t}
            </div>
          ))}
          <div style={{ display: "flex", marginLeft: "auto" }}>EMSI · Casablanca</div>
        </div>
      </div>
    ),
    size,
  );
}
