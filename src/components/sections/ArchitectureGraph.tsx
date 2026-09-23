"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useId, useState, type PointerEvent } from "react";

type NodeId = "client" | "nginx" | "api" | "db" | "telegram" | "scheduler";
type NodeText = { label: string; detail: string };

const NODES: Record<NodeId, { x: number; y: number; depth: number }> = {
  client: { x: 90, y: 60, depth: 1.4 },
  nginx: { x: 340, y: 60, depth: 1 },
  api: { x: 230, y: 210, depth: 0.6 },
  scheduler: { x: 440, y: 210, depth: 1.2 },
  db: { x: 100, y: 360, depth: 1 },
  telegram: { x: 400, y: 360, depth: 1.3 },
};

/** [from, to, label, label position] — labels placed by hand so they never touch a node. */
const EDGES: [NodeId, NodeId, string, [number, number]?][] = [
  ["client", "nginx", "HTTPS", [215, 42]],
  ["nginx", "api", "/api", [312, 140]],
  ["api", "db", "JPA", [132, 285]],
  ["api", "telegram", "Bot API", [345, 272]],
  ["api", "scheduler", ""],
  ["scheduler", "telegram", ""],
];

const W = 144;
const H = 50;

const pathFor = (a: NodeId, b: NodeId) => {
  const p = NODES[a];
  const q = NODES[b];
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  // Slight curve for a more organic, drawn feel
  const cx = mx + (q.y - p.y) * 0.12;
  const cy = my - (q.x - p.x) * 0.12;
  return `M ${p.x} ${p.y} Q ${cx} ${cy} ${q.x} ${q.y}`;
};

export function ArchitectureGraph({ nodes, label, caption }: { nodes: Record<NodeId, NodeText>; label: string; caption: string }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const uid = useId().replace(/:/g, "");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const connected = (id: NodeId) =>
    hovered === null || hovered === id || EDGES.some(([a, b]) => (a === hovered && b === id) || (b === hovered && a === id));
  const edgeActive = (a: NodeId, b: NodeId) => hovered === null || hovered === a || hovered === b;

  return (
    <figure className="relative">
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative aspect-[520/420] w-full"
      >
        <div
          aria-hidden="true"
          className="absolute inset-[8%] rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent)" }}
        />
        <svg viewBox="0 0 520 420" className="relative h-full w-full overflow-visible" role="img" aria-label={label}>
          <defs>
            <linearGradient id={`edge-${uid}`} x1="0" x2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Edges */}
          {EDGES.map(([a, b, tag, pos]) => {
            const d = pathFor(a, b);
            const active = edgeActive(a, b);
            const p = NODES[a];
            return (
              <g key={`${a}-${b}`} style={{ opacity: active ? 1 : 0.25, transition: "opacity .3s" }}>
                <path d={d} fill="none" stroke="var(--border-strong)" strokeWidth="1" />
                <path d={d} fill="none" stroke={`url(#edge-${uid})`} strokeWidth="1.4" className="flow-line" />
                {/* Hidden by CSS under reduced motion (keeps server and client markup identical) */}
                <circle r="2.6" fill="var(--accent)" className="motion-reduce:hidden">
                  <animateMotion dur={`${2.4 + (p.x % 7) * 0.2}s`} repeatCount="indefinite" path={d} />
                </circle>
                {tag && pos && (
                  <text
                    x={pos[0]}
                    y={pos[1]}
                    textAnchor="middle"
                    className="fill-subtle font-mono"
                    fontSize="9.5"
                  >
                    {tag}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {(Object.keys(NODES) as NodeId[]).map((id) => (
            <Node
              key={id}
              id={id}
              text={nodes[id]}
              sx={sx}
              sy={sy}
              dim={!connected(id)}
              highlighted={hovered === id}
              onEnter={() => setHovered(id)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </svg>
      </div>
      <figcaption className="mt-2 text-center font-mono text-[0.7rem] text-subtle">{caption}</figcaption>
    </figure>
  );
}

function Node({
  id,
  text,
  sx,
  sy,
  dim,
  highlighted,
  onEnter,
  onLeave,
}: {
  id: NodeId;
  text: NodeText;
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  dim: boolean;
  highlighted: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const { x, y, depth } = NODES[id];
  const tx = useTransform(sx, (v) => v * 14 * depth);
  const ty = useTransform(sy, (v) => v * 14 * depth);
  const isCore = id === "api";

  return (
    <motion.g
      style={{ x: tx, y: ty, opacity: dim ? 0.35 : 1 }}
      className="cursor-default outline-none transition-opacity duration-300"
      tabIndex={0}
      role="img"
      aria-label={`${text.label} — ${text.detail}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <rect
        x={x - W / 2}
        y={y - H / 2}
        width={W}
        height={H}
        rx="12"
        fill="var(--surface)"
        stroke={highlighted || isCore ? "var(--accent)" : "var(--border-strong)"}
        strokeWidth={highlighted ? 1.6 : 1}
        style={{ transition: "stroke .25s" }}
      />
      <circle cx={x - W / 2 + 14} cy={y - 6} r="3" fill={isCore ? "var(--accent)" : "var(--text-subtle)"} />
      <text x={x - W / 2 + 24} y={y - 2} className="fill-fg" fontSize="13" fontWeight="600">
        {text.label}
      </text>
      <text x={x - W / 2 + 14} y={y + 15} className="fill-subtle font-mono" fontSize="8.4">
        {text.detail}
      </text>
    </motion.g>
  );
}
