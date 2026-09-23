import { Container, Database, Globe, Send, Server } from "lucide-react";
import type { ReactNode } from "react";

/** Compact vertical architecture flow used in the featured-project teaser. */
export function StackFlow({ dockerLabel }: { dockerLabel: string }) {
  return (
    <div className="card bg-grid relative overflow-hidden p-5 sm:p-7" role="img" aria-label="React → REST API → Spring Boot → PostgreSQL; Spring Boot → Telegram API">
      <div className="mx-auto flex max-w-sm flex-col items-stretch">
        <Box icon={<Globe size={16} />} title="React" meta="Vite · React Router · Axios" />
        <Connector label="REST · JSON · JWT" />
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <Box icon={<Server size={16} />} title="Spring Boot" meta="Controller → Service → Repository" accent />
          <div className="flex items-center gap-2">
            <span className="relative h-px w-6 overflow-hidden bg-line-strong sm:w-10">
              <span className="absolute inset-y-0 left-0 w-full bg-accent/70 [mask-image:repeating-linear-gradient(90deg,black_0_4px,transparent_4px_10px)]" />
            </span>
            <Box icon={<Send size={15} />} title="Telegram" meta="Bot API" compact />
          </div>
        </div>
        <Connector label="JPA · Flyway" />
        <Box icon={<Database size={16} />} title="PostgreSQL 17" meta="Constraints · migrations" />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 border-t border-dashed border-line pt-5 font-mono text-[0.7rem] text-subtle">
        <Container size={14} aria-hidden="true" />
        {dockerLabel}: nginx · backend · postgres
      </div>
    </div>
  );
}

function Box({ icon, title, meta, accent, compact }: { icon: ReactNode; title: string; meta: string; accent?: boolean; compact?: boolean }) {
  return (
    <div
      className={`rounded-xl border bg-surface/90 backdrop-blur ${compact ? "px-3 py-2.5" : "px-4 py-3.5"} ${
        accent ? "border-accent/50 shadow-[0_0_0_4px_var(--accent-soft)]" : "border-line-strong"
      }`}
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span className={accent ? "text-accent" : "text-muted"} aria-hidden="true">
          {icon}
        </span>
        {title}
      </p>
      <p className="mt-0.5 font-mono text-[0.68rem] text-subtle">{meta}</p>
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="relative flex h-12 items-center pl-8" aria-hidden="true">
      <svg className="absolute top-0 left-8 h-full w-px overflow-visible" viewBox="0 0 1 48" preserveAspectRatio="none">
        <line x1="0.5" y1="0" x2="0.5" y2="48" stroke="var(--border-strong)" />
        <line x1="0.5" y1="0" x2="0.5" y2="48" stroke="var(--accent)" strokeWidth="1.5" className="flow-line" />
      </svg>
      <span className="ml-5 font-mono text-[0.68rem] text-subtle">{label}</span>
    </div>
  );
}
