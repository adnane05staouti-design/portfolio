"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container, Database, Globe, HardDrive, KeyRound, Send, Server, Shield } from "lucide-react";
import { useState, type ReactNode } from "react";
import { backendLayers, composeServices, requestFlow } from "@/data/architecture";
import type { Locale } from "@/lib/i18n";

const icons: Record<string, ReactNode> = {
  browser: <Globe size={17} />,
  nginx: <Shield size={17} />,
  api: <Server size={17} />,
  db: <Database size={17} />,
  telegram: <Send size={16} />,
};

type Labels = { hint: string; layers: string; deployment: string };

export function ArchitectureDiagram({ locale, labels }: { locale: Locale; labels: Labels }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState("api");
  const current = requestFlow.find((n) => n.id === selected)!;
  const main = requestFlow.filter((n) => n.id !== "telegram");
  const telegram = requestFlow.find((n) => n.id === "telegram")!;

  const nodeButton = (id: string) => {
    const n = requestFlow.find((x) => x.id === id)!;
    const active = selected === id;
    return (
      <button
        type="button"
        onClick={() => setSelected(id)}
        onMouseEnter={() => setSelected(id)}
        onFocus={() => setSelected(id)}
        aria-pressed={active}
        className={`w-full rounded-xl border px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-300 ${
          active
            ? "border-accent bg-accent-soft shadow-[0_0_0_4px_var(--accent-soft)]"
            : "border-line-strong bg-surface hover:border-accent/60"
        }`}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className={active ? "text-accent" : "text-muted"} aria-hidden="true">
            {icons[id]}
          </span>
          {n.title}
        </span>
        <span className="mt-0.5 block font-mono text-[0.68rem] text-subtle">{n.tech}</span>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* Request flow */}
      <div className="card bg-grid p-5 md:p-8">
        <p className="mb-6 text-sm text-subtle">{labels.hint}</p>
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:gap-10">
          <div className="flex flex-col">
            {main.map((n, i) => (
              <div key={n.id}>
                {nodeButton(n.id)}
                {i < main.length - 1 && <Link label={["HTTPS", "/api · /uploads", "JPA · JDBC"][i]} />}
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-6">
            <div>
              <p className="mb-2 font-mono text-[0.68rem] text-subtle">Spring Boot → Bot API</p>
              {nodeButton(telegram.id)}
            </div>
            <div aria-live="polite" className="min-h-40 rounded-xl border border-line bg-bg/70 p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="eyebrow">{current.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{current.description[locale]}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Backend layers */}
        <div className="card p-5 md:p-7">
          <p className="eyebrow mb-5 flex items-center gap-2">
            <KeyRound size={14} aria-hidden="true" />
            {labels.layers}
          </p>
          <ol className="space-y-2">
            {backendLayers.map((layer, i) => (
              <li
                key={layer.name}
                className="flex items-center gap-4 rounded-lg border border-line bg-surface-2/60 px-4 py-2.5"
                style={{ marginLeft: `${i * 10}px` }}
              >
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium">{layer.name}</span>
                <span className="ml-auto hidden text-right text-xs text-subtle sm:block">{layer.role[locale]}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Docker Compose */}
        <div className="card p-5 md:p-7">
          <p className="eyebrow mb-5 flex items-center gap-2">
            <Container size={14} aria-hidden="true" />
            {labels.deployment}
          </p>
          <div className="rounded-xl border border-dashed border-line-strong p-3">
            <ul className="grid gap-2 sm:grid-cols-3">
              {composeServices.map((s) => (
                <li key={s.name} className="rounded-lg border border-line bg-surface-2/60 p-3">
                  <p className="font-mono text-sm font-semibold">{s.name}</p>
                  <p className="mt-1 font-mono text-[0.65rem] text-subtle">{s.image}</p>
                  <p className="mt-2 text-xs text-muted">{s.detail[locale]}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2 font-mono text-[0.68rem] text-subtle">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1">
                <HardDrive size={12} aria-hidden="true" /> postgres_data
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1">
                <HardDrive size={12} aria-hidden="true" /> uploads_data
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1">
                <KeyRound size={12} aria-hidden="true" /> .env (not versioned)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({ label }: { label: string }) {
  return (
    <div className="relative flex h-10 items-center pl-7" aria-hidden="true">
      <svg className="absolute top-0 left-7 h-full w-px overflow-visible" viewBox="0 0 1 40" preserveAspectRatio="none">
        <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="var(--border-strong)" />
        <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="var(--accent)" strokeWidth="1.5" className="flow-line" />
      </svg>
      <span className="ml-5 font-mono text-[0.68rem] text-subtle">{label}</span>
    </div>
  );
}
